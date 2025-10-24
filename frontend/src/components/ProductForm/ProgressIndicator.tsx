import { Check, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  const steps = [
    { step: 1, label: 'Basic Info' },
    { step: 2, label: 'Details' },
    { step: 3, label: 'Review' }
  ];

  return (
    <div className="space-y-8">
      <div className="relative max-w-3xl mx-auto">
        <div className="flex justify-between items-center">
          {steps.map((item) => (
            <div key={item.step} className="flex flex-col items-center space-y-3 relative z-10">
              <div className={`
                w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-500 shadow-xl border
                ${currentStep > item.step 
                  ? 'bg-emerald-500 text-white border-emerald-600 scale-105' 
                  : currentStep === item.step 
                  ? 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-400/50 step-pulse scale-110' 
                  : 'bg-white border-gray-300 text-gray-500'
                }
              `}>
                {currentStep > item.step ? (
                  <Check className="h-8 w-8" />
                ) : (
                  <span>{item.step}</span>
                )}
              </div>
              
              <div className="text-center">
                <div className={`
                  text-sm font-bold transition-colors duration-300 tracking-wide
                  ${currentStep >= item.step ? 'text-gray-900' : 'text-gray-500'}
                `}>
                  {item.label}
                </div>
                {currentStep === item.step && (
                  <div className="text-xs text-emerald-600 mt-1 font-semibold uppercase tracking-wider">
                    Active
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="absolute top-8 left-0 right-0 flex justify-between px-8">
          <div className={`
            h-2 flex-1 mx-8 rounded-full transition-all duration-700 border
            ${currentStep > 1 
              ? 'bg-emerald-500 border-emerald-600' 
              : 'bg-white border-gray-300'
            }
          `} />
          <div className={`
            h-2 flex-1 mx-8 rounded-full transition-all duration-700 border
            ${currentStep > 2 
              ? 'bg-emerald-500 border-emerald-600' 
              : 'bg-white border-gray-300'
            }
          `} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center mt-4 text-sm">
          <span className="text-gray-600 font-semibold">Step {currentStep} of {totalSteps}</span>
          <span className="font-bold text-emerald-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
      </div>

      <div className="text-center flex flex-col sm:flex-row gap-3 justify-center">
        <div className="inline-flex items-center space-x-3 px-6 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm">
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
          <span className="text-emerald-800 font-semibold">
            {currentStep === 1 && 'Complete your basic product information'}
            {currentStep === 2 && 'Answer detailed transparency questions'}
            {currentStep === 3 && 'Review and submit your transparency report'}
          </span>
        </div>
        
        {currentStep < 3 && (
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700">
            <ArrowRight className="h-4 w-4" />
            <span>
              Next: {currentStep === 1 ? 'Category-specific questions' : 'Final review and submission'}
            </span>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-semibold">Ready to generate your transparency report!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressIndicator;
