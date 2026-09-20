"use client";

import {
  createContext,
  startTransition,
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

  const isFirstRender = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus("pending");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setSaveStatus("saving");
      startTransition(() => {
        saveDraftAction(sections).then((result) => {
          if (result.ok) {
            setSaveStatus("saved");
            setSaveError(null);
          } else {
            setSaveStatus("error");
            setSaveError(result.error);
          }
        });
      });
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [sections]);

  const publish = useCallback(async () => {
    setPublishStatus("publishing");
    setPublishError(null);

    const result = await publishAction();
    if (result.ok) {
      setPublishStatus("idle");
      return true;
    }

    setPublishStatus("error");
    setPublishError(result.error);
    return false;
  }, []);

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
