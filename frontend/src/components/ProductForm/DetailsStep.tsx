import { UseFormRegister } from 'react-hook-form';
import { ChevronLeft, ChevronRight, Loader2, HelpCircle, ClipboardCheck } from 'lucide-react';
import type { Question, ProductFormData } from '../../types';

interface DetailsStepProps {
  register: UseFormRegister<ProductFormData>;
  questions: Question[];
  onPrevious: () => void;
  onNext: () => void;
  watch: any;
}

const DetailsStep: React.FC<DetailsStepProps> = ({ 
  register, 
  questions, 
  onPrevious, 
  onNext,
  watch
}) => {
  // Check if all questions are answered
  const allAnswered = questions.every(question => {
    const value = watch(`question_${question.id}`);
    return value && value.toString().trim().length > 0;
  });

  const answeredCount = questions.filter(question => {
    const value = watch(`question_${question.id}`);
    return value && value.toString().trim().length > 0;
  }).length;
  const getQuestionIcon = (type: string) => {
    switch (type) {
      case 'select':
        return '📋';
      case 'textarea':
        return '📝';
      case 'number':
        return '🔢';
      case 'date':
        return '📅';
      default:
        return '✏️';
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'select':
        return 'Multiple Choice';
      case 'textarea':
        return 'Detailed Response';
      case 'number':
        return 'Numeric Value';
      case 'date':
        return 'Date Selection';
      default:
        return 'Text Input';
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <ClipboardCheck className="h-6 w-6 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Product Details & Transparency</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Please provide detailed information about your product. These questions are tailored to your product category and help create a comprehensive transparency report.
        </p>
      </div>
      
      {questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          <p className="text-gray-700 font-medium">Loading category-specific questions...</p>
          <p className="text-gray-500 text-sm">This may take a moment</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className={`${allAnswered ? 'status-success' : 'status-info'} transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5" />
                <span className="font-medium">
                  {answeredCount} of {questions.length} Questions Answered
                </span>
              </div>
              <span className="text-sm opacity-80">
                {allAnswered ? 'All questions completed! ✓' : 'All questions must be answered'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {questions.map((question, index) => (
              <div key={question.id} className="card p-6 hover-lift-card">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-sm font-bold text-emerald-700 border border-emerald-200">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <label className="form-label text-base font-semibold text-gray-900 leading-relaxed">
                          {question.text}
                        </label>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-lg">{getQuestionIcon(question.type)}</span>
                          <span className="text-xs text-gray-500 font-medium">
                            {getQuestionTypeLabel(question.type)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-11">
                    {question.type === 'select' ? (
                      <select
                        {...register(`question_${question.id}` as any, {
                          required: 'This field is required'
                        })}
                        className="form-select focus-ring"
                      >
                        <option value="">Select an option</option>
                        {question.options?.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : question.type === 'textarea' ? (
                      <textarea
                        {...register(`question_${question.id}` as any, {
                          required: 'This field is required',
                          minLength: { value: 10, message: 'Please provide at least 10 characters' }
                        })}
                        className="form-textarea focus-ring"
                        rows={4}
                        placeholder={`Provide detailed information about ${question.text.toLowerCase()}`}
                      />
                    ) : question.type === 'number' ? (
                      <input
                        {...register(`question_${question.id}` as any, {
                          required: 'This field is required',
                          valueAsNumber: true
                        })}
                        type="number"
                        className="form-input focus-ring"
                        placeholder={`Enter ${question.text.toLowerCase()}`}
                      />
                    ) : question.type === 'date' ? (
                      <input
                        {...register(`question_${question.id}` as any, {
                          required: 'This field is required'
                        })}
                        type="date"
                        className="form-input focus-ring"
                      />
                    ) : (
                      <input
                        {...register(`question_${question.id}` as any, {
                          required: 'This field is required',
                          minLength: { value: 2, message: 'Please provide at least 2 characters' }
                        })}
                        type="text"
                        className="form-input focus-ring"
                        placeholder={`Enter ${question.text.toLowerCase()}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!allAnswered && (
            <div className="status-warning">
              <div className="flex items-start space-x-3">
                <HelpCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Required Information</h4>
                  <p className="text-sm opacity-90">
                    All questions must be answered to proceed to the review step. This ensures your transparency report is complete and comprehensive.
                  </p>
                </div>
              </div>
            </div>
          )}

          {allAnswered && (
            <div className="status-success slide-up">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">All questions answered! Ready to review and submit.</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 gap-4">
        <button
          type="button"
          onClick={onPrevious}
          className="btn-secondary flex items-center space-x-2 hover-lift w-full sm:w-auto justify-center"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Basic Info</span>
        </button>
        
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="text-gray-500 text-sm">
            Step 2 of 3 - Product Details
          </div>
          <button
            type="button"
            onClick={onNext}
            disabled={!allAnswered}
            className={`btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 w-full sm:w-auto justify-center ${
              !allAnswered ? 'grayscale' : 'hover-glow'
            }`}
          >
            <span>Review & Submit</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsStep;
