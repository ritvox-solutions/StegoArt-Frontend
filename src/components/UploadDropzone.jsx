import { useEffect, useId, useRef, useState } from "react";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from "../api/client";

const FRIENDLY_TYPES = "JPEG, PNG, or WEBP";

function validate(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `${file.name} isn't a supported image type — please use ${FRIENDLY_TYPES}.`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `${file.name} is ${(file.size / 1e6).toFixed(1)}MB — the limit is 10MB.`;
  }
  return null;
}

/**
 * Drag-and-drop zone that is ALSO fully keyboard operable: a real, focusable
 * "Browse" <button> triggers the native file picker (Enter/Space both work),
 * independent of drag-and-drop. Validates type/size client-side before ever
 * calling onFileSelected, and surfaces either that or an externally-passed
 * `error` (e.g. a server-side validation failure) inline, in the same spot.
 */
export default function UploadDropzone({ label, file, onFileSelected, error, helpText }) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const inputId = useId();
  const errorId = useId();

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleFiles(fileList) {
    const picked = fileList?.[0];
    if (!picked) return;
    const problem = validate(picked);
    setLocalError(problem);
    if (!problem) onFileSelected(picked);
  }

  const shownError = localError || error;

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-text">
          {label}
        </label>
      )}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={[
          "rounded-xl border-2 border-dashed p-6 text-center transition-colors",
          isDragOver ? "border-brand-from bg-surface-hover" : "border-border bg-surface",
          shownError ? "border-danger" : "",
        ].join(" ")}
      >
        {previewUrl ? (
          <div className="flex flex-col items-center gap-3">
            <img src={previewUrl} alt={`Preview of ${file.name}`} className="max-h-56 rounded-lg border border-border-subtle object-contain" />
            <p className="text-xs text-text-muted">
              {file.name} · {(file.size / 1e6).toFixed(2)}MB
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-surface-hover"
            >
              Choose a different file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6">
            <span className="text-3xl" aria-hidden="true">🖼️</span>
            <p className="text-sm text-text-muted">Drag and drop an image here, or</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="brand-gradient-bg rounded-md px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Browse files
            </button>
            <p className="text-xs text-text-faint">{FRIENDLY_TYPES} · up to 10MB</p>
          </div>
        )}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          aria-describedby={shownError ? errorId : undefined}
        />
      </div>
      {shownError && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-danger">
          {shownError}
        </p>
      )}
      {!shownError && helpText && <p className="mt-2 text-xs text-text-faint">{helpText}</p>}
    </div>
  );
}
