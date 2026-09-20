import "server-only";
import { getStorage } from "firebase-admin/storage";
import { getAdminApp } from "./admin";

export function getBucket() {
  return getStorage(getAdminApp()).bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
}
