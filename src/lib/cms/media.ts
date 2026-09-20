import "server-only";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAdminApp } from "@/lib/firebase/admin";
import { getBucket } from "@/lib/firebase/storage";

const SIGNED_URL_EXPIRES_MS = 5 * 60 * 1000; // 5 minutos
const ALLOWED_CONTENT_TYPE = "image/webp";

/** `media/{yyyy}/{mm}/{uuid}.webp` — ver PLAN-DESARROLLO.md sección 3. El nombre
 * de archivo (sin extensión) ES el id del documento en Firestore `media/`, así
 * `deleteMediaRecord` puede derivar uno del otro sin una lectura extra. */
export const STORAGE_PATH_PATTERN = /^media\/\d{4}\/\d{2}\/[0-9a-f-]{36}\.webp$/;

function mediaCollection() {
  return getFirestore(getAdminApp()).collection("media");
}

function storagePathFor(mediaId: string, now: Date): string {
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  return `media/${yyyy}/${mm}/${mediaId}.webp`;
}

function mediaIdFromStoragePath(storagePath: string): string {
  const filename = storagePath.split("/").pop() ?? "";
  return filename.replace(/\.webp$/, "");
}

/** El SDK de Storage y `storage.rules` (día 1) hablan de reglas de Firebase, que
 * solo se evalúan a través del endpoint REST `firebasestorage.googleapis.com`
 * — no del endpoint crudo de GCS `storage.googleapis.com`, que ignora esas
 * reglas y requiere IAM a nivel de bucket. Como `storage.rules` ya permite
 * lectura pública de `media/**`, servimos las imágenes por acá. */
export function publicUrlFor(storagePath: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${getBucket().name}/o/${encodeURIComponent(storagePath)}?alt=media`;
}

export interface UploadTarget {
  mediaId: string;
  storagePath: string;
  uploadUrl: string;
  publicUrl: string;
}

export async function createUploadTarget(contentType: string): Promise<UploadTarget> {
  if (contentType !== ALLOWED_CONTENT_TYPE) {
    throw new Error("Tipo de imagen no soportado.");
  }

  const mediaId = crypto.randomUUID();
  const storagePath = storagePathFor(mediaId, new Date());
  const file = getBucket().file(storagePath);

  const [uploadUrl] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + SIGNED_URL_EXPIRES_MS,
    contentType,
  });

  return { mediaId, storagePath, uploadUrl, publicUrl: publicUrlFor(storagePath) };
}

export interface SaveMediaInput {
  mediaId: string;
  storagePath: string;
  publicUrl: string;
  alt: string;
  width: number;
  height: number;
  bytes: number;
  createdBy: string;
}

export async function saveMediaRecord(input: SaveMediaInput): Promise<void> {
  await mediaCollection()
    .doc(input.mediaId)
    .set({
      storagePath: input.storagePath,
      url: input.publicUrl,
      alt: input.alt,
      width: input.width,
      height: input.height,
      bytes: input.bytes,
      createdAt: FieldValue.serverTimestamp(),
      createdBy: input.createdBy,
    });
}

export async function deleteMediaRecord(storagePath: string): Promise<void> {
  await getBucket().file(storagePath).delete({ ignoreNotFound: true });
  await mediaCollection().doc(mediaIdFromStoragePath(storagePath)).delete();
}
