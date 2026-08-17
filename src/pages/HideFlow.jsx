import { useNavigate } from "react-router-dom";
import { useHideFlow } from "../state/HideFlowContext";
import { useExtractFlow } from "../state/ExtractFlowContext";
import { useToast } from "../state/ToastContext";
import { MAX_TEXT_CHARS, base64PngToFile, encodeSecret, toPngDataUrl } from "../api/client";
import StepProgress from "../components/StepProgress";
import UploadDropzone from "../components/UploadDropzone";
import StyleGallery from "../components/StyleGallery";
import ProcessingState from "../components/ProcessingState";
import ImageCompareCard from "../components/ImageCompareCard";
import MetricsPanel from "../components/MetricsPanel";

const STEP_LABELS = ["Cover image", "Secret", "Style", "Processing", "Result"];

export default function HideFlow() {
  const { state, setStep, setCoverFile, setSecretText, setStyle, setResult, reset } = useHideFlow();
  const extractFlow = useExtractFlow();
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function submit() {
    setStep(4);
    try {
      const result = await encodeSecret({
        coverImage: state.coverFile,
        secretText: state.secretText,
        applyStyle: state.applyStyle,
        styleName: state.styleName,
      });
      setResult(result);
      setStep(5);
    } catch (e) {
      // Inputs stay exactly as the user left them — only the step goes back,
      // nothing in state is cleared, so Retry (or a manual resubmit) just works.
      showToast(e.message, { onRetry: submit });
      setStep(3);
    }
  }

  function tryExtractingResult() {
    const file = base64PngToFile(state.result.stego_image_base64, "stego.png");
    extractFlow.prefillFromStegoFile(file);
    navigate("/extract");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Hide Data</h1>
      <p className="mt-1 text-sm text-text-muted">Embed a secret inside a cover image, invisibly.</p>

      <div className="mt-8">
        <StepProgress currentStep={state.step} labels={STEP_LABELS} />
      </div>

      <div className="mt-8">
        {state.step === 1 && (
          <StepCover coverFile={state.coverFile} setCoverFile={setCoverFile} onNext={() => setStep(2)} />
        )}
        {state.step === 2 && (
          <StepSecret
            secretText={state.secretText}
            setSecretText={setSecretText}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {state.step === 3 && (
          <StepStyle
            applyStyle={state.applyStyle}
            styleName={state.styleName}
            setStyle={setStyle}
            onBack={() => setStep(2)}
            onSubmit={submit}
          />
        )}
        {state.step === 4 && <ProcessingState messages={state.applyStyle ? ["Embedding your secret…", "Applying style…"] : ["Embedding your secret…"]} />}
        {state.step === 5 && state.result && (
          <StepResult result={state.result} onTryExtracting={tryExtractingResult} onStartOver={reset} />
        )}
      </div>
    </div>
  );
}

function WizardNav({ onBack, onNext, nextLabel = "Continue", nextDisabled = false }) {
  return (
    <div className="mt-6 flex items-center justify-between">
      {onBack ? (
        <button type="button" onClick={onBack} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text hover:bg-surface-hover">
          Back
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="brand-gradient-bg rounded-md px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {nextLabel}
      </button>
    </div>
  );
}

function StepCover({ coverFile, setCoverFile, onNext }) {
  return (
    <div>
      <UploadDropzone
        label="Cover image"
        file={coverFile}
        onFileSelected={setCoverFile}
        helpText="This ordinary-looking photo will carry your hidden secret."
      />
      <WizardNav onNext={onNext} nextDisabled={!coverFile} />
    </div>
  );
}

function StepSecret({ secretText, setSecretText, onBack, onNext }) {
  const overLimit = secretText.length > MAX_TEXT_CHARS;
  const canProceed = secretText.trim().length > 0 && !overLimit;

  return (
    <div>
      <label htmlFor="secret-text" className="mb-2 block text-sm font-medium text-text">
        Secret message
      </label>
      <textarea
        id="secret-text"
        value={secretText}
        onChange={(e) => setSecretText(e.target.value)}
        rows={5}
        className="w-full rounded-lg border border-border bg-surface p-3 text-sm text-text placeholder:text-text-faint focus-visible:border-brand-from"
        placeholder="Type the message you want to hide…"
      />
      <p className={`mt-1.5 text-right text-xs ${overLimit ? "text-danger" : "text-text-faint"}`}>
        {secretText.length} / {MAX_TEXT_CHARS} characters
      </p>
      {overLimit && <p role="alert" className="text-sm text-danger">Message is too long by {secretText.length - MAX_TEXT_CHARS} characters.</p>}

      <WizardNav onBack={onBack} onNext={onNext} nextDisabled={!canProceed} />
    </div>
  );
}

function StepStyle({ applyStyle, styleName, setStyle, onBack, onSubmit }) {
  const selected = applyStyle ? styleName : null;
  return (
    <div>
      <StyleGallery selectedStyle={selected} onSelect={(name) => setStyle(name !== null, name)} />
      <WizardNav onBack={onBack} onNext={onSubmit} nextLabel="Hide My Secret" />
    </div>
  );
}

function StepResult({ result, onTryExtracting, onStartOver }) {
  const stegoUrl = toPngDataUrl(result.stego_image_base64);
  const styledUrl = result.styled_image_base64 ? toPngDataUrl(result.styled_image_base64) : null;

  return (
    <div>
      <div className={`grid grid-cols-1 gap-4 ${styledUrl ? "md:grid-cols-2" : "md:max-w-sm"}`}>
        <ImageCompareCard label="Stego image (send this to Extract)" src={stegoUrl} filename="stego.png" />
        {styledUrl && (
          <ImageCompareCard
            label="Styled version"
            src={styledUrl}
            filename={`stego-${result.styled_decode_supported ? "styled" : "styled-display-only"}.png`}
          />
        )}
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">Signal preservation (cover vs. stego)</h2>
        <MetricsPanel psnr={result.psnr} ssim={result.ssim} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button type="button" onClick={onTryExtracting} className="brand-gradient-bg rounded-md px-5 py-2 text-sm font-semibold text-white hover:opacity-90">
          Try Extracting This Image
        </button>
        <button type="button" onClick={onStartOver} className="rounded-md border border-border px-5 py-2 text-sm font-medium text-text hover:bg-surface-hover">
          Start Over
        </button>
      </div>
    </div>
  );
}
