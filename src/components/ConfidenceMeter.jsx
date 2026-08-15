/**
 * Zone thresholds: clean decodes measure ~0.997-0.999, so 0.8 is a safe
 * "high confidence" floor. Amber covers the uncertain middle ground between
 * "clearly fine" and "clearly bad."
 *
 * Note: with the current style-robust ("v3") backend weights, a *styled*
 * decode can also legitimately score in the high zone (measured ~0.92-0.95
 * for text) — this is no longer a clean-vs-styled signal the way it was
 * with the original weights (see backend/services/stego_service.py's
 * text_decode_confidence docstring). It's just "how sure the decoder
 * seemed," nothing more.
 */
function zoneFor(confidence) {
  if (confidence >= 0.8) return { key: "high", label: "High confidence", color: "success" };
  if (confidence >= 0.5) return { key: "moderate", label: "Moderate confidence", color: "warning" };
  return { key: "low", label: "Low confidence", color: "danger" };
}

const barColor = { success: "bg-success", warning: "bg-warning", danger: "bg-danger" };
const textColor = { success: "text-success", warning: "text-warning", danger: "text-danger" };

export default function ConfidenceMeter({ confidence }) {
  const zone = zoneFor(confidence);
  const pct = Math.round(confidence * 100);

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className={`text-sm font-semibold ${textColor[zone.color]}`}>{zone.label}</p>
        <p className="text-sm text-text-muted">{pct}%</p>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-surface-raised" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Decode confidence">
        <div className={`h-full rounded-full transition-all ${barColor[zone.color]}`} style={{ width: `${pct}%` }} />
      </div>

      {zone.key === "low" && (
        <p role="alert" className="mt-3 rounded-lg border border-danger-border bg-danger-bg px-3 py-2.5 text-sm text-text">
          This image may not contain hidden data from this system, or may have been altered (styled, compressed, resized).
        </p>
      )}
    </div>
  );
}
