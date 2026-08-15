import { useId, useState } from "react";

function InfoTooltip({ text }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-describedby={id}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-border-subtle text-[10px] font-bold text-text-faint hover:border-brand hover:text-brand"
      >
        i
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-lg border border-border bg-surface-raised p-3 text-left text-xs font-normal leading-snug text-text-muted shadow-xl"
        >
          {text}
        </span>
      )}
    </span>
  );
}

const METRIC_INFO = {
  psnr: "PSNR (Peak Signal-to-Noise Ratio): how close the stego image is to the original cover, in decibels — higher is better. Above ~30dB is generally considered visually indistinguishable from the original.",
  ssim: "SSIM (Structural Similarity): measures structural similarity between two images, from 0 to 1. Closer to 1 means the stego image is virtually identical in structure to the cover.",
};

export default function MetricsPanel({ psnr, ssim }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-xl border border-border-subtle bg-surface p-4">
        <p className="flex items-center text-xs font-semibold uppercase tracking-wide text-text-muted">
          PSNR
          <InfoTooltip text={METRIC_INFO.psnr} />
        </p>
        <p className="mt-1 text-2xl font-bold text-text">{psnr.toFixed(2)} <span className="text-sm font-normal text-text-muted">dB</span></p>
        <p className="mt-1 text-xs text-text-faint">{psnr >= 30 ? "Visually indistinguishable from the cover" : "Some visible difference from the cover"}</p>
      </div>
      <div className="rounded-xl border border-border-subtle bg-surface p-4">
        <p className="flex items-center text-xs font-semibold uppercase tracking-wide text-text-muted">
          SSIM
          <InfoTooltip text={METRIC_INFO.ssim} />
        </p>
        <p className="mt-1 text-2xl font-bold text-text">{ssim.toFixed(4)}</p>
        <p className="mt-1 text-xs text-text-faint">{ssim >= 0.9 ? "Structurally near-identical to the cover" : "Some structural difference from the cover"}</p>
      </div>
    </div>
  );
}
