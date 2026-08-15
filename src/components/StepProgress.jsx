/**
 * Desktop: full horizontal stepper with numbered circles + connecting lines.
 * Narrow screens (<640px, Tailwind's `sm`): collapses to plain "Step X of N: Label" text.
 */
export default function StepProgress({ currentStep, labels }) {
  const total = labels.length;

  return (
    <nav aria-label="Progress">
      <p className="text-sm font-medium text-text-muted sm:hidden">
        Step {currentStep} of {total}: <span className="text-text">{labels[currentStep - 1]}</span>
      </p>

      <ol className="hidden items-center sm:flex">
        {labels.map((label, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          return (
            <li key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    isDone ? "brand-gradient-bg text-white" : isCurrent ? "border-2 border-brand text-brand" : "border border-border text-text-faint",
                  ].join(" ")}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isDone ? "✓" : stepNum}
                </span>
                <span className={`max-w-[6.5rem] text-center text-xs ${isCurrent ? "font-semibold text-text" : "text-text-faint"}`}>
                  {label}
                </span>
              </div>
              {stepNum !== total && (
                <div className={`mx-2 h-0.5 flex-1 rounded ${isDone ? "brand-gradient-bg" : "bg-border"}`} aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
