import { WizardStep } from '@/types/reconciliation';

interface StepIndicatorProps {
  currentStep: WizardStep;
  onStepClick?: (step: WizardStep) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  const steps: { step: WizardStep; label: string; description: string }[] = [
    { step: 1, label: 'Step 1', description: 'Upload Purchase Order' },
    { step: 2, label: 'Step 2', description: 'Upload Receiving File' },
    { step: 3, label: 'Step 3', description: 'Map Columns' },
    { step: 4, label: 'Step 4', description: 'Run Reconciliation' },
    { step: 5, label: 'Step 5', description: 'View Results' },
  ];

  return (
    <nav aria-label="Progress" className="w-full">
      <ol role="list" className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4">
        {steps.map((s) => {
          const isCurrent = s.step === currentStep;
          const isCompleted = s.step < currentStep;
          const isClickable = onStepClick && s.step <= currentStep;

          return (
            <li key={s.step} className="relative">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(s.step)}
                className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all ${
                  isCurrent
                    ? 'border-slate-900 bg-slate-900 text-white font-medium shadow-sm'
                    : isCompleted
                    ? 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100'
                    : 'border-slate-200 bg-white text-slate-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-semibold uppercase tracking-wider text-[10px] ${
                      isCurrent ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {s.label}
                  </span>
                  {isCompleted && (
                    <span className="text-emerald-600 font-bold">✓</span>
                  )}
                </div>
                <div className="mt-1 font-medium truncate">{s.description}</div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
