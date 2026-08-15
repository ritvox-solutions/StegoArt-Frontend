import { createContext, useContext, useMemo, useState } from "react";

const HideFlowContext = createContext(null);

const initial = {
  step: 1,
  coverFile: null,
  secretType: "text", // 'text' | 'image'
  secretText: "",
  secretImageFile: null,
  applyStyle: false,
  styleName: null,
  result: null, // encode response
};

/**
 * Lifted above the router (see App.jsx) so a user's in-progress Hide Flow
 * survives navigating to another page and back — only "Start Over"
 * (reset()) or a full page reload clears it.
 */
export function HideFlowProvider({ children }) {
  const [state, setState] = useState(initial);

  const api = useMemo(
    () => ({
      state,
      setStep: (step) => setState((s) => ({ ...s, step })),
      setCoverFile: (coverFile) => setState((s) => ({ ...s, coverFile })),
      setSecretType: (secretType) => setState((s) => ({ ...s, secretType })),
      setSecretText: (secretText) => setState((s) => ({ ...s, secretText })),
      setSecretImageFile: (secretImageFile) => setState((s) => ({ ...s, secretImageFile })),
      setStyle: (applyStyle, styleName) => setState((s) => ({ ...s, applyStyle, styleName })),
      setResult: (result) => setState((s) => ({ ...s, result })),
      reset: () => setState(initial),
    }),
    [state]
  );

  return <HideFlowContext.Provider value={api}>{children}</HideFlowContext.Provider>;
}

export function useHideFlow() {
  const ctx = useContext(HideFlowContext);
  if (!ctx) throw new Error("useHideFlow must be used within a HideFlowProvider");
  return ctx;
}
