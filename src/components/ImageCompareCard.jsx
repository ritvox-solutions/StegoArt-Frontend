/**
 * One image tile with a label and its own download button. Used to lay out
 * Cover | Stego | Styled side by side (stacks vertically below ~768px via
 * the grid the parent applies).
 */
export default function ImageCompareCard({ label, src, filename, footer }) {
  return (
    <div className="flex flex-col rounded-xl border border-border-subtle bg-surface p-3">
      <p className="mb-2 text-sm font-semibold text-text">{label}</p>
      <div className="flex flex-1 items-center justify-center overflow-hidden rounded-lg bg-base">
        <img src={src} alt={label} className="max-h-64 w-full object-contain" />
      </div>
      {footer}
      <a
        href={src}
        download={filename}
        className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-text hover:bg-surface-hover"
      >
        <span aria-hidden="true">⬇</span> Download
      </a>
    </div>
  );
}
