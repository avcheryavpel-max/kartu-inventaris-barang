import React from 'react';
import {
  Upload,
  Layers,
  Sparkles,
  FileCheck2,
  Table,
  Download,
  CheckCircle,
} from 'lucide-react';

export interface StepItem {
  id: number;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

export const STEPS: StepItem[] = [
  { id: 1, label: 'Upload Dokumen', sublabel: 'PDF & Format KIB', icon: Upload },
  { id: 2, label: 'Ekstraksi Faktual', sublabel: '53 Halaman PDF', icon: Layers },
  { id: 3, label: 'Klasifikasi Cerdas', sublabel: 'KIB A–F & Non-Kap', icon: Sparkles },
  { id: 4, label: 'Format Template', sublabel: 'Struktur Resmi', icon: FileCheck2 },
  { id: 5, label: 'Validasi Integritas', sublabel: '12 Kepatuhan Audit', icon: CheckCircle },
  { id: 6, label: 'Review & Audit Trail', sublabel: 'Koreksi Interaktif', icon: Table },
  { id: 7, label: 'Ekspor Excel KIB', sublabel: 'Download .xlsx', icon: Download },
];

interface StepperProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  maxReachedStep: number;
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  onSelectStep,
  maxReachedStep,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between overflow-x-auto no-scrollbar py-1 gap-2">
            {STEPS.map((step) => {
              const isCurrent = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              const isAccessible = step.id <= maxReachedStep;
              const Icon = step.icon;

              return (
                <li key={step.id} className="relative shrink-0 flex items-center">
                  <button
                    onClick={() => isAccessible && onSelectStep(step.id)}
                    disabled={!isAccessible}
                    className={`group flex items-center text-left py-1.5 px-3 rounded-lg transition-all duration-150 ${
                      isCurrent
                        ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-800'
                        : isCompleted
                        ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        : isAccessible
                        ? 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        : 'text-slate-300 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center mr-2.5 text-xs font-bold shrink-0 transition-colors ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950 font-extrabold'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-800 font-bold'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        step.id
                      )}
                    </span>
                    <div className="flex flex-col">
                      <span
                        className={`text-xs font-semibold whitespace-nowrap ${
                          isCurrent ? 'text-white' : isCompleted ? 'text-slate-900' : 'text-slate-600'
                        }`}
                      >
                        {step.label}
                      </span>
                      <span
                        className={`text-[10px] whitespace-nowrap ${
                          isCurrent ? 'text-amber-300 font-medium' : 'text-slate-400'
                        }`}
                      >
                        {step.sublabel}
                      </span>
                    </div>
                  </button>

                  {step.id < STEPS.length && (
                    <div className="hidden xl:block w-4 h-0.5 bg-slate-200 mx-1 shrink-0" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};
