"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/organisms/AdminPageHeader/AdminPageHeader";
import { AdminButton } from "@/components/atoms/AdminButton";
import { TextField } from "@/components/atoms/TextField";
import { SelectField } from "@/components/atoms/SelectField";
import { StatusPill } from "@/components/atoms/StatusPill";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { PromotionEditForm } from "@/components/organisms/PromotionsAdmin/PromotionEditForm";
import {
  deletePromotionAction,
  reorderPromotionsAction,
  savePromotionAction,
} from "@/lib/cms/promo-actions";
import {
  EMPTY_SCHEDULE,
  isPromotionActiveAt,
  scheduleSummary,
  siteMoment,
  type Promotion,
  type PromotionStatus,
  type SiteMoment,
} from "@/lib/cms/promo-types";

const ALL_STATUSES = "all";

/** Cada cuánto se vuelve a mirar el reloj mientras la pantalla está abierta. Una
 * promoción con franja horaria tiene que dejar de figurar como activa sola, sin
 * que nadie recargue la página. */
const CLOCK_REFRESH_MS = 30_000;

const BLANK_PROMOTION: Promotion = {
  id: "",
  title: "Nueva promoción",
  description: "",
  imageUrl: "",
  imageAlt: "",
  ctaLabel: "",
  ctaHref: "",
  status: "draft",
  schedule: EMPTY_SCHEDULE,
};

/** Compara ignorando mayúsculas y tildes, para que "envio" encuentre "Envío gratis". */
function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export interface PromotionsAdminProps {
  promotions: Promotion[];
  /** El "ahora" del vivero calculado en el servidor, para que el primer render
   * del navegador coincida con el HTML. */
  initialMoment: SiteMoment;
}

export function PromotionsAdmin({
  promotions: initialPromotions,
  initialMoment,
}: PromotionsAdminProps) {
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [view, setView] = useState<"list" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(ALL_STATUSES);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();

  // "Hoy" según el reloj del vivero, no el del navegador de quien edita.
  const [moment, setMoment] = useState<SiteMoment>(initialMoment);
  const year = moment.date.slice(0, 4);

  useEffect(() => {
    const timer = setInterval(() => setMoment(siteMoment()), CLOCK_REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  const visiblePromotions = useMemo(() => {
    const needle = fold(query.trim());
    return promotions.filter((promotion) => {
      const matchesQuery =
        !needle ||
        fold(promotion.title).includes(needle) ||
        fold(promotion.description).includes(needle);
      const matchesStatus = status === ALL_STATUSES || promotion.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [promotions, query, status]);

  const filtersActive = query.trim() !== "" || status !== ALL_STATUSES;
  const activeNow = promotions.filter((promotion) => isPromotionActiveAt(promotion, moment));

  const editingPromotion = editingId
    ? promotions.find((p) => p.id === editingId) ?? BLANK_PROMOTION
    : BLANK_PROMOTION;

  function openPromotion(id: string) {
    setError(null);
    setEditingId(id);
    setView("edit");
  }

  function newPromotion() {
    setError(null);
    setEditingId(null);
    setView("edit");
  }

  function clearFilters() {
    setQuery("");
    setStatus(ALL_STATUSES);
  }

  /** Mueve una promoción dentro del orden real, no del filtrado. El orden decide
   * cuál gana cuando hay varias activas el mismo día. */
  function move(id: string, direction: -1 | 1) {
    const from = promotions.findIndex((p) => p.id === id);
    const to = from + direction;
    if (from === -1 || to < 0 || to >= promotions.length) return;

    const next = [...promotions];
    [next[from], next[to]] = [next[to], next[from]];
    setPromotions(next);
    setError(null);

    startSaving(async () => {
      const result = await reorderPromotionsAction(next.map((p) => p.id));
      if (!result.ok) {
        // Volver al orden anterior es más honesto que dejar en pantalla uno que
        // la base no tiene.
        setPromotions(promotions);
        setError(result.error);
      }
    });
  }

  function save(promotion: Promotion, nextStatus: PromotionStatus) {
    setError(null);
    startSaving(async () => {
      const result = await savePromotionAction(promotion, nextStatus);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      const saved = result.promotion;
      setPromotions((current) =>
        current.some((p) => p.id === saved.id)
          ? current.map((p) => (p.id === saved.id ? saved : p))
          : [...current, saved],
      );
      setView("list");
      router.refresh();
    });
  }

  function remove(id: string) {
    setError(null);

    if (!id) {
      setView("list");
      return;
    }

    startSaving(async () => {
      const result = await deletePromotionAction(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setPromotions((current) => current.filter((p) => p.id !== id));
      setView("list");
      router.refresh();
    });
  }

  if (view === "edit") {
    return (
      <PromotionEditForm
        key={editingId ?? "nueva"}
        promotion={editingPromotion}
        saving={saving}
        error={error}
        onDiscard={() => {
          setError(null);
          setView("list");
        }}
        onSave={save}
        onDelete={remove}
        moment={moment}
      />
    );
  }

  return (
    <>
      <AdminPageHeader
        crumb="Sitio"
        title="Promocional"
        actions={
          <AdminButton variant="solid" onClick={newPromotion}>
            + Nueva promoción
          </AdminButton>
        }
      />

      <div className="flex flex-col gap-5 px-6 pb-20 pt-7 lg:px-10">
        {error ? (
          <div
            role="alert"
            className="rounded-md border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta"
          >
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2.5">
          <TextField
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por título o descripción"
            aria-label="Buscar promociones"
            className="min-w-[240px] flex-1 rounded-full"
          />
          <SelectField
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filtrar por estado"
            className="rounded-full"
          >
            <option value={ALL_STATUSES}>Todos los estados</option>
            <option value="live">Publicada</option>
            <option value="draft">Borrador</option>
          </SelectField>
        </div>

        <p className="-mt-1 text-[13px] text-stone">
          {filtersActive ? (
            <>
              {visiblePromotions.length} de {promotions.length} promociones
              <button
                type="button"
                onClick={clearFilters}
                className="ml-2 border-b border-line text-forest transition-colors hover:border-terracotta hover:text-terracotta"
              >
                Limpiar filtros
              </button>
            </>
          ) : activeNow.length === 0 ? (
            "Ninguna promoción está corriendo en este momento."
          ) : activeNow.length === 1 ? (
            <>En pantalla ahora: {activeNow[0].title || "sin título"}.</>
          ) : (
            <>
              {activeNow.length} promociones coinciden con hoy; se muestra la primera de la lista:{" "}
              {activeNow[0].title || "sin título"}.
            </>
          )}
        </p>

        {visiblePromotions.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[10px] border border-dashed border-line bg-paper-light px-6 py-16 text-center">
            <p className="font-display text-2xl text-forest">
              {promotions.length === 0 ? "Todavía no hay promociones" : "Ninguna promoción coincide"}
            </p>
            <p className="max-w-[420px] text-sm leading-[1.6] text-stone">
              {promotions.length === 0
                ? "Creá la primera para que aparezca como popup al entrar a la landing."
                : "Probá con otro título o quitá los filtros para ver todas."}
            </p>
            {promotions.length === 0 ? (
              <AdminButton variant="solid" onClick={newPromotion}>
                + Nueva promoción
              </AdminButton>
            ) : (
              <AdminButton variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </AdminButton>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[10px] border border-line-light bg-paper-light">
            <div className="grid min-w-[900px] grid-cols-[56px_minmax(0,2fr)_minmax(0,1.6fr)_130px_120px_150px] items-center gap-4 bg-[#F2EDE0] px-[18px] py-[13px] text-[11px] uppercase tracking-[0.14em] text-taupe">
              <span />
              <span>Promoción</span>
              <span>Calendario</span>
              <span>Ahora</span>
              <span>Estado</span>
              <span className="justify-self-end">Orden</span>
            </div>
            {visiblePromotions.map((promotion) => {
              const index = promotions.indexOf(promotion);
              const running = isPromotionActiveAt(promotion, moment);
              return (
                <div
                  key={promotion.id}
                  className="grid min-w-[900px] grid-cols-[56px_minmax(0,2fr)_minmax(0,1.6fr)_130px_120px_150px] items-center gap-4 border-t border-[#EDE6D6] px-[18px] py-3 transition-colors hover:bg-white"
                >
                  <div className="h-11 w-11 overflow-hidden rounded-md">
                    <ImagePlaceholder
                      src={promotion.imageUrl || undefined}
                      alt={promotion.imageAlt}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => openPromotion(promotion.id)}
                    className="min-w-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
                  >
                    <div className="text-[15px] font-medium text-forest">
                      {promotion.title || "Sin título"}
                    </div>
                    <div className="truncate text-[13px] text-taupe">{promotion.description}</div>
                  </button>
                  <span className="truncate text-sm text-ink">
                    {scheduleSummary(promotion.schedule, year)}
                  </span>
                  <span className={running ? "text-sm text-[#2F5636]" : "text-sm text-taupe"}>
                    {running ? "● En pantalla" : "○ Sin mostrar"}
                  </span>
                  <StatusPill
                    live={promotion.status === "live"}
                    labelLive="Publicada"
                    className="justify-self-start"
                  />
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      aria-label={`Subir ${promotion.title}`}
                      disabled={filtersActive || saving || index === 0}
                      onClick={() => move(promotion.id, -1)}
                      className="rounded-full border border-[#CFC6B0] px-2.5 py-1 text-sm text-forest transition-colors hover:bg-[#EFE9DA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      aria-label={`Bajar ${promotion.title}`}
                      disabled={filtersActive || saving || index === promotions.length - 1}
                      onClick={() => move(promotion.id, 1)}
                      className="rounded-full border border-[#CFC6B0] px-2.5 py-1 text-sm text-forest transition-colors hover:bg-[#EFE9DA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      ↓
                    </button>
                    <AdminButton variant="outline" onClick={() => openPromotion(promotion.id)}>
                      Editar
                    </AdminButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
