import React from 'react';
import { UseFormWatch } from 'react-hook-form';
import { CheckCircle2, ChevronLeft, Building, Loader2, FileCheck, Tag, ClipboardList, Sparkles } from 'lucide-react';
import { ProductFormData } from '../../types';

interface ReviewStepProps {
  watch: UseFormWatch<ProductFormData>;
  loading: boolean;
  onPrevious: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ watch, loading, onPrevious }) => {
  const categories = [
    { value: 'food', label: 'Food & Beverages', icon: '🍎' },
    { value: 'non-food', label: 'Non-Food Products', icon: '📦' },
    { value: 'electronics', label: 'Electronics', icon: '💻' },
    { value: 'clothing', label: 'Clothing & Textiles', icon: '👕' },
    { value: 'cosmetics', label: 'Cosmetics & Personal Care', icon: '💄' }
  ];

  const selectedCategory = categories.find(c => c.value === watch('category'));

  return (
    <div className="space-y-8 fade-in">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-green-50 rounded-xl border border-green-200">
            <FileCheck className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Please review your product information before submitting. Once submitted, we'll generate your comprehensive transparency report.
        </p>
      </div>

      <div className="card p-6 space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
          <Building className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-900">Product Information Summary</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Product Name</span>
            </div>
            <p className="text-gray-900 text-lg font-medium">{watch('name') || 'Not specified'}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Company</span>
            </div>
            <p className="text-gray-900 text-lg font-medium">{watch('company') || 'Not specified'}</p>
          </div>

          <div className="space-y-2 lg:col-span-2">
            <div className="flex items-center space-x-2">
              <ClipboardList className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Category</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{selectedCategory?.icon}</span>
              <p className="text-gray-900 text-lg font-medium">{selectedCategory?.label || 'Not specified'}</p>
            </div>
          </div>

          {watch('description') && (
            <div className="space-y-2 lg:col-span-2">
              <div className="flex items-center space-x-2">
                <FileCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Description</span>
              </div>
              <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-xl border border-gray-200">
                {watch('description')}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="status-success">
        <div className="flex items-start space-x-3">
          <Sparkles className="h-6 w-6 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-lg mb-2">What happens next?</h4>
            <div className="space-y-2 text-sm opacity-90">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                <span>Your product information will be processed using AI-powered analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                <span>A comprehensive transparency report will be generated</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                <span>You'll receive insights on impact and compliance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                <span>The report will be available for download and sharing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="status-info">
        <div className="flex items-start space-x-3">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">Data Privacy & Security</h4>
            <p className="text-sm opacity-90">
              Your product information is securely stored and processed. We use industry-standard encryption
              and follow best practices for data protection. Your data will only be used to generate your transparency report.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 gap-4">
        <button
          type="button"
          onClick={onPrevious}
          disabled={loading}
          className="btn-secondary flex items-center space-x-2 hover-lift disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Details</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="text-gray-500 text-sm">
            Step 3 of 3 - Final Review
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 w-full sm:w-auto justify-center ${loading ? '' : 'hover-glow'
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating Report...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Generate Transparency Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
