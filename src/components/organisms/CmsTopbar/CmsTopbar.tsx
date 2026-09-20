"use client";

import { useState } from "react";
import { Button, Modal } from "lib-kit-components";
import { LogoutButton } from "@/components/organisms/LogoutButton/LogoutButton";
import { useCmsDraft } from "@/lib/cms/draft-context";

const SAVE_STATUS_LABEL: Record<string, string> = {
  saved: "Guardado",
  pending: "Cambios sin guardar",
  saving: "Guardando…",
  error: "Error al guardar",
};

export function CmsTopbar() {
  const { saveStatus, saveError, publish, publishStatus, publishError } = useCmsDraft();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [justPublished, setJustPublished] = useState(false);

  async function handlePublish() {
    const ok = await publish();
    if (ok) {
      setConfirmOpen(false);
      setJustPublished(true);
      setTimeout(() => setJustPublished(false), 4000);
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6">
      <div>
        <p className="text-sm font-semibold text-zinc-900">Panel de contenido</p>
        <p className="text-xs text-zinc-400">VJA Plantas</p>
      </div>
      <div className="flex items-center gap-4">
        <p className={`text-xs ${saveStatus === "error" ? "text-red-500" : "text-zinc-400"}`}>
          {justPublished ? "Publicado" : SAVE_STATUS_LABEL[saveStatus]}
          {saveStatus === "error" && saveError ? `: ${saveError}` : ""}
        </p>
        <Button size="sm" onClick={() => setConfirmOpen(true)}>
          Publicar
        </Button>
        <LogoutButton />
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Publicar cambios"
        description="El contenido publicado se actualiza con el borrador actual. La publicación anterior queda en el historial de versiones."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button loading={publishStatus === "publishing"} onClick={handlePublish}>
              Publicar
            </Button>
          </div>
        }
      >
        {publishStatus === "error" && publishError ? <p className="text-sm text-red-500">{publishError}</p> : null}
      </Modal>
    </header>
  );
}
