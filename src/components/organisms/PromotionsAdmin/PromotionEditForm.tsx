"use client";

import { useState } from "react";
import { TextField } from "@/components/atoms/TextField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import { SegmentedControl } from "@/components/atoms/SegmentedControl";
import { AdminButton } from "@/components/atoms/AdminButton";
import { StatusPill } from "@/components/atoms/StatusPill";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { ImageUploader } from "@/components/molecules/ImageUploader/ImageUploader";
import { AdminPageHeader } from "@/components/organisms/AdminPageHeader/AdminPageHeader";
import { ScheduleEditor } from "@/components/organisms/PromotionsAdmin/ScheduleEditor";
import { PromoPopupCard } from "@/components/organisms/PromoPopup/PromoPopupCard";
import {
  isPromotionActiveAt,
  scheduleSummary,
  type Promotion,
  type PromotionStatus,
  type SiteMoment,
} from "@/lib/cms/promo-types";

interface PromotionEditFormProps {
  promotion: Promotion;
  saving: boolean;
  error: string | null;
  onDiscard: () => void;
  onSave: (promotion: Promotion, status: PromotionStatus) => void;
  onDelete: (id: string) => void;
  /** El "ahora" del vivero, que mantiene al día el listado que abrió este form. */
  moment: SiteMoment;
}

export function PromotionEditForm({
  promotion,
  saving,
  error,
  onDiscard,
  onSave,
  onDelete,
  moment,
}: PromotionEditFormProps) {
  const [form, setForm] = useState<Promotion>(promotion);

  function set<K extends keyof Promotion>(key: K, value: Promotion[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  // Se recalcula en cada render del editor, que es justo lo que se quiere: el
  // cartel responde al calendario que se está tocando, no al de hace un rato.
  const liveNow = isPromotionActiveAt({ ...form, status: "live" }, moment);

  return (
    <>
      <AdminPageHeader
        crumb="Promocional / Editar"
        title={form.title || "Nueva promoción"}
        actions={
          <>
            <AdminButton variant="outline" onClick={onDiscard} disabled={saving}>
              Descartar
            </AdminButton>
            <AdminButton variant="outline" onClick={() => onSave(form, "draft")} disabled={saving}>
              {saving ? "Guardando…" : "Guardar borrador"}
            </AdminButton>
            <AdminButton variant="solid" onClick={() => onSave(form, "live")} disabled={saving}>
              Publicar
            </AdminButton>
          </>
        }
      />

      {error ? (
        <div
          role="alert"
          className="mx-6 mt-5 rounded-md border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta lg:mx-10"
        >
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] items-start gap-6 px-6 pb-20 pt-7 lg:px-10">
        <div className="flex flex-col gap-5">
          <FieldCard title="Contenido del popup">
            <TextField
              label="Título"
              value={form.title}
              onChange={(event) => set("title", event.target.value)}
            />
            <TextAreaField
              label="Descripción"
              rows={5}
              value={form.description}
              onChange={(event) => set("description", event.target.value)}
            />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <TextField
                label="Texto del botón · opcional"
                placeholder="Ver el catálogo"
                value={form.ctaLabel}
                onChange={(event) => set("ctaLabel", event.target.value)}
              />
              <TextField
                label="Enlace del botón"
                placeholder="/productos"
                value={form.ctaHref}
                onChange={(event) => set("ctaHref", event.target.value)}
              />
            </div>
          </FieldCard>

          <FieldCard
            title="Imagen"
            subtitle="Se muestra arriba del texto, recortada apaisada."
          >
            <ImageUploader
              imageUrl={form.imageUrl}
              imageAlt={form.imageAlt}
              onChange={({ imageUrl, imageAlt }) =>
                setForm((current) => ({ ...current, imageUrl, imageAlt }))
              }
            />
          </FieldCard>

          <FieldCard
            title="Cuándo se muestra"
            subtitle="El popup aparece la primera vez que alguien entra a la landing."
          >
            <ScheduleEditor
              schedule={form.schedule}
              onChange={(schedule) => set("schedule", schedule)}
            />
          </FieldCard>
        </div>

        <div className="flex flex-col gap-5">
          <FieldCard title="Publicación" tinted>
            <div className="flex items-center justify-between gap-3.5">
              <span className="text-sm text-ink">Estado</span>
              <SegmentedControl
                options={[
                  { value: "draft", label: "Borrador" },
                  { value: "live", label: "Publicada" },
                ]}
                value={form.status}
                onChange={(status) => set("status", status)}
              />
            </div>
            <div className="flex items-start justify-between gap-3.5 border-t border-line-light pt-3.5">
              <div className="min-w-0">
                <div className="text-sm text-forest">Ahora mismo</div>
                <div className="mt-0.5 text-[13px] leading-[1.5] text-stone">
                  {scheduleSummary(form.schedule, moment.date.slice(0, 4))}
                </div>
              </div>
              <StatusPill
                live={form.status === "live" && liveNow}
                labelLive="En pantalla"
                labelDraft={form.status === "live" ? "Fuera de fecha" : "Sin publicar"}
                className="shrink-0"
              />
            </div>
          </FieldCard>

          <FieldCard title="Vista previa">
            <div className="-mx-2 flex justify-center rounded-lg bg-[#EFE9DA] px-2 py-5">
              <PromoPopupCard
                promotion={form}
                onClose={() => {}}
                className="w-full max-w-[340px]"
              />
            </div>
          </FieldCard>

          <FieldCard title="Zona de riesgo">
            <p className="-mt-2 text-[13px] leading-[1.5] text-stone">
              Eliminar la promoción la saca del sitio en el acto. No se puede deshacer.
            </p>
            <AdminButton
              variant="danger-outline"
              disabled={saving || !promotion.id}
              onClick={() => onDelete(promotion.id)}
              className="w-fit"
            >
              Eliminar promoción
            </AdminButton>
          </FieldCard>
        </div>
      </div>
    </>
  );
}
