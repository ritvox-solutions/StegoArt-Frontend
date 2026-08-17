import { useEffect, useState } from "react";
import { getStyles, getStyleThumbnailUrl } from "../api/client";

/**
 * "No style" is a real tile in the gallery itself (not a separate
 * checkbox), per spec. Style names/thumbnails come from GET /api/styles —
 * never hardcoded here, so this always reflects whatever the backend
 * actually has loaded.
 */
export default function StyleGallery({ selectedStyle, onSelect }) {
  const [styles, setStyles] = useState(null); // null = loading
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getStyles()
      .then((s) => !cancelled && setStyles(s))
      .catch((e) => !cancelled && setLoadError(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      <button
        type="button"
        onClick={() => onSelect(null)}
        aria-pressed={selectedStyle === null}
        className={[
          "flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-colors",
          selectedStyle === null ? "border-brand-from bg-surface-hover" : "border-border bg-surface hover:bg-surface-hover",
        ].join(" ")}
      >
        <span className="flex h-20 w-full items-center justify-center rounded-lg bg-surface-raised text-2xl" aria-hidden="true">
          🚫
        </span>
        <span className="text-sm font-medium text-text">No style</span>
      </button>

      {styles === null && !loadError && (
        <p className="col-span-full text-sm text-text-muted">Loading styles…</p>
      )}
      {loadError && (
        <p role="alert" className="col-span-full text-sm text-danger">
          Couldn't load styles: {loadError}
        </p>
      )}

      {styles?.map((s) => (
        <button
          key={s.name}
          type="button"
          onClick={() => onSelect(s.name)}
          aria-pressed={selectedStyle === s.name}
          className={[
            "flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-colors",
            selectedStyle === s.name ? "border-brand-from bg-surface-hover" : "border-border bg-surface hover:bg-surface-hover",
          ].join(" ")}
        >
          <img
            src={getStyleThumbnailUrl(s.name)}
            alt=""
            className="h-20 w-full rounded-lg object-cover"
          />
          <span className="text-sm font-medium capitalize text-text">{s.name.replace(/_/g, " ")}</span>
        </button>
      ))}
    </div>
  );
}
