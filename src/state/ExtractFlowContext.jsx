import { createContext, useContext, useMemo, useState } from "react";

const ExtractFlowContext = createContext(null);

const initial = {
  step: 1,
  stegoFile: null,
  stegoPreviewUrl: null,
  result: null, // decode response
};

/**
 * Lifted above the router (see App.jsx), same reasoning as HideFlowContext.
 * Also the landing spot for Hide Flow's "Try Extracting This Image" deep
 * link — prefillFromStegoFile() is called from HideFlow, then it navigates
 * here, with the stego image handed off entirely in memory (no backend
 * storage/round trip involved).
 */
export function ExtractFlowProvider({ children }) {
  const [state, setState] = useState(initial);

  const api = useMemo(
    () => ({
      state,
      setStep: (step) => setState((s) => ({ ...s, step })),
      setResult: (result) => setState((s) => ({ ...s, result })),
      setStegoFile: (stegoFile) =>
        setState((s) => ({
          ...s,
          stegoFile,
          stegoPreviewUrl: stegoFile ? URL.createObjectURL(stegoFile) : null,
        })),
      prefillFromStegoFile: (file) =>
        setState({
          ...initial,
          stegoFile: file,
          stegoPreviewUrl: URL.createObjectURL(file),
        }),
      reset: () => setState(initial),
    }),
    [state]
  );

  return <ExtractFlowContext.Provider value={api}>{children}</ExtractFlowContext.Provider>;
}

export function useExtractFlow() {
  const ctx = useContext(ExtractFlowContext);
  if (!ctx) throw new Error("useExtractFlow must be used within an ExtractFlowProvider");
  return ctx;
}
