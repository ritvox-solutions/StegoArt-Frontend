import { useState } from "react";
import { useExtractFlow } from "../state/ExtractFlowContext";
import { useToast } from "../state/ToastContext";
import { decodeSecret } from "../api/client";
import StepProgress from "../components/StepProgress";
import UploadDropzone from "../components/UploadDropzone";
import ProcessingState from "../components/ProcessingState";
import ConfidenceMeter from "../components/ConfidenceMeter";

const STEP_LABELS = ["Upload stego image", "Processing", "Result"];

export default function ExtractFlow() {
  const { state, setStep, setStegoFile, setResult, reset } = useExtractFlow();
  const { showToast } = useToast();

  async function submit() {
    setStep(2);
    try {
      const result = await decodeSecret({ stegoImage: state.stegoFile });
      setResult(result);
      setStep(3);
    } catch (e) {
      showToast(e.message, { onRetry: submit });
      setStep(1);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Extract Data</h1>
      <p className="mt-1 text-sm text-text-muted">Recover a secret hidden inside a plain (unstyled) stego image.</p>

      <div className="mt-8">
        <StepProgress currentStep={state.step} labels={STEP_LABELS} />
      </div>

      <div className="mt-8">
        {state.step === 1 && (
          <StepUpload stegoFile={state.stegoFile} setStegoFile={setStegoFile} onSubmit={submit} />
        )}
        {state.step === 2 && <ProcessingState messages={["Decoding hidden data…"]} />}
        {state.step === 3 && state.result && <StepResult result={state.result} onStartOver={reset} />}
      </div>
    </div>
  );
}

function StepUpload({ stegoFile, setStegoFile, onSubmit }) {
  return (
    <div>
      <UploadDropzone
        label="Stego image"
        file={stegoFile}
        onFileSelected={setStegoFile}
        helpText="Upload the plain (unstyled) image that has a secret hidden inside it."
      />

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!stegoFile}
          className="brand-gradient-bg rounded-md px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Extract Secret
        </button>
      </div>
    </div>
  );
}

function StepResult({ result, onStartOver }) {
  const [copyState, setCopyState] = useState("idle"); // 'idle' | 'copied' | 'failed'

  async function copyText() {
    try {
      await navigator.clipboard.writeText(result.recovered_text ?? "");
      setCopyState("copied");
    } catch {
      // Clipboard access can fail (denied permission, insecure context,
      // older browser) — surface that instead of the button silently doing
      // nothing, which would otherwise look broken with no feedback at all.
      setCopyState("failed");
    }
    setTimeout(() => setCopyState("idle"), 2000);
  }

  return (
    <div>
      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-text">Recovered text</p>
          <button
            type="button"
            onClick={copyText}
            className={`rounded-md border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover ${
              copyState === "failed" ? "border-danger-border text-danger" : "border-border text-text"
            }`}
          >
            {copyState === "copied" ? "Copied!" : copyState === "failed" ? "Copy failed" : "Copy"}
          </button>
        </div>
        <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border-subtle bg-surface p-4 font-mono text-sm text-text">
          {result.recovered_text || <span className="text-text-faint">(empty)</span>}
        </pre>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-text">Decode confidence</p>
        <ConfidenceMeter confidence={result.confidence} />
      </div>

      <div className="mt-8">
        <button type="button" onClick={onStartOver} className="rounded-md border border-border px-5 py-2 text-sm font-medium text-text hover:bg-surface-hover">
          Start Over
        </button>
      </div>
    </div>
  );
}
