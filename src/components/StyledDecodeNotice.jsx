/**
 * Single canonical copy of the Mode A caveat, so it's never duplicated (and
 * potentially drifting) between the pre-encode style picker and the
 * post-encode result screen. Its wording mirrors backend/schemas.py's
 * EncodeResponse.styled_decode_supported Field description verbatim — the
 * backend is the source of truth for this constraint, this component just
 * renders it.
 *
 * `mode="notice"` (default): general-purpose, shown above the style gallery
 * before a style is even chosen — necessarily predictive copy, since there's
 * no dry-run endpoint to read styled_decode_supported from before encoding.
 * `mode="result"`: shown on the result screen, and MUST be gated by the
 * caller on the real API response's styled_decode_supported field being
 * false — never on locally-tracked "did I select a style" state.
 */
export default function StyledDecodeNotice({ mode = "notice" }) {
  return (
    <div role="note" className="flex items-start gap-3 rounded-lg border border-warning-border bg-warning-bg px-4 py-3">
      <span className="mt-0.5 text-lg" aria-hidden="true">⚠️</span>
      <p className="text-sm leading-snug text-text">
        {mode === "result"
          ? "This styled image's hidden data can't be recovered from it directly — decode from the unstyled stego image above instead."
          : "Applying a style makes the image look artistic, but the hidden data can then only be recovered from the original (unstyled) version — not the styled one."}
      </p>
    </div>
  );
}
