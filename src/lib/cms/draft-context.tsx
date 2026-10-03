"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { publishAction, saveDraftAction } from "./actions";
import type { CmsSection } from "./types";

export type SaveStatus = "saved" | "pending" | "saving" | "error";
export type PublishStatus = "idle" | "publishing" | "error";

/** Describe el estado del autoguardado del borrador (no si está publicado). */
export const SAVE_STATUS_LABEL: Record<SaveStatus, string> = {
  saved: "Borrador guardado",
  pending: "Cambios sin guardar",
  saving: "Guardando…",
  error: "Error al guardar",
};

type SectionsUpdater = CmsSection[] | ((current: CmsSection[]) => CmsSection[]);

interface CmsDraftContextValue {
  sections: CmsSection[];
  setSections: (updater: SectionsUpdater) => void;
  saveStatus: SaveStatus;
  saveError: string | null;
  publishStatus: PublishStatus;
  publishError: string | null;
  publish: () => Promise<boolean>;
}

const CmsDraftContext = createContext<CmsDraftContextValue | null>(null);

const AUTOSAVE_DELAY_MS = 1000;

const SAVE_FAILED =
  "No pudimos guardar el borrador. Revisá tu conexión y, si el problema sigue, volvé a iniciar sesión.";
const PUBLISH_FAILED = "No pudimos publicar. Probá de nuevo en un momento.";

export function CmsDraftProvider({
  initialSections,
  children,
}: {
  initialSections: CmsSection[];
  children: ReactNode;
}) {
  const [sections, setSections] = useState<CmsSection[]>(initialSections);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<PublishStatus>("idle");
  const [publishError, setPublishError] = useState<string | null>(null);

  /** Lo último que escribió el editor y lo último que confirmó el servidor. Al
   * comparar las dos referencias sabemos si queda algo por mandar, tanto para el
   * debounce como para el `flush` que corre antes de publicar. */
  const pendingRef = useRef<CmsSection[]>(initialSections);
  const savedRef = useRef<CmsSection[]>(initialSections);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Los guardados se encadenan: dos `set` en vuelo podrían llegar a Firestore
   * en el orden inverso y dejar guardado el borrador viejo. */
  const queueRef = useRef<Promise<boolean>>(Promise.resolve(true));

  const runSave = useCallback(async (): Promise<boolean> => {
    const snapshot = pendingRef.current;
    if (snapshot === savedRef.current) return true;

    setSaveStatus("saving");
    try {
      const result = await saveDraftAction(snapshot);
      if (!result.ok) {
        setSaveStatus("error");
        setSaveError(result.error);
        return false;
      }

      savedRef.current = snapshot;
      setSaveError(null);
      // Si el editor siguió escribiendo mientras guardábamos, lo de recién ya
      // quedó viejo: el próximo debounce lo manda.
      setSaveStatus(pendingRef.current === snapshot ? "saved" : "pending");
      return true;
    } catch {
      // `saveDraftAction` puede rechazar (sesión caída, Firestore sin respuesta).
      // Sin este catch la promesa quedaba sin atender y el cartel se congelaba
      // en “Guardando…” sin que el editor se enterara de nada.
      setSaveStatus("error");
      setSaveError(SAVE_FAILED);
      return false;
    }
  }, []);

  const save = useCallback(() => {
    queueRef.current = queueRef.current.then(runSave, runSave);
    return queueRef.current;
  }, [runSave]);

  /** Guarda ya mismo lo que haya pendiente, sin esperar el debounce. */
  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    return save();
  }, [save]);

  useEffect(() => {
    pendingRef.current = sections;
    // En el primer render `sections` es lo que vino del servidor: no hay nada
    // que mandar de vuelta.
    if (sections === savedRef.current) return;

    setSaveStatus("pending");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      void save();
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [sections, save]);

  // Última red: cerrar la pestaña con el debounce corriendo perdía lo tipeado en
  // el último segundo sin ningún aviso.
  useEffect(() => {
    function warn(event: BeforeUnloadEvent) {
      if (pendingRef.current === savedRef.current) return;
      event.preventDefault();
    }

    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  const publish = useCallback(async () => {
    setPublishStatus("publishing");
    setPublishError(null);

    // `publishAction` copia a publicado lo que haya guardado en Firestore, no lo
    // que tiene el editor en pantalla. Publicar con el autoguardado todavía en
    // vuelo —tipear y apretar Publicar enseguida— sacaba al sitio el borrador
    // anterior y los últimos cambios parecían no haberse guardado nunca.
    if (!(await flush())) {
      setPublishStatus("error");
      setPublishError(`${SAVE_FAILED} No se publicó nada.`);
      return false;
    }

    try {
      const result = await publishAction();
      if (result.ok) {
        setPublishStatus("idle");
        return true;
      }

      setPublishStatus("error");
      setPublishError(result.error);
      return false;
    } catch {
      setPublishStatus("error");
      setPublishError(PUBLISH_FAILED);
      return false;
    }
  }, [flush]);

  const value = useMemo<CmsDraftContextValue>(
    () => ({ sections, setSections, saveStatus, saveError, publishStatus, publishError, publish }),
    [sections, saveStatus, saveError, publishStatus, publishError, publish],
  );

  return <CmsDraftContext.Provider value={value}>{children}</CmsDraftContext.Provider>;
}

export function useCmsDraft(): CmsDraftContextValue {
  const context = useContext(CmsDraftContext);
  if (!context) {
    throw new Error("useCmsDraft debe usarse dentro de CmsDraftProvider");
  }
  return context;
}
