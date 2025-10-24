import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FileText, ArrowRight, AlertTriangle, Building, Tag, ClipboardList } from 'lucide-react';
import { ProductFormData } from '../../types';

interface BasicInfoStepProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  watchedCategory: string;
  onNext: () => void;
  watch: any;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ 
  register, 
  errors, 
  watchedCategory, 
  onNext,
  watch
}) => {
  const name = watch('name');
  const company = watch('company');
  const isValid = name && name.trim().length >= 2 && company && company.trim().length >= 2 && watchedCategory;
  const categories = [
    { value: 'food', label: 'Food & Beverages', icon: '🍎', description: 'Food products, beverages, and consumables' },
    { value: 'non-food', label: 'Non-Food Products', icon: '📦', description: 'General consumer goods and products' },
    { value: 'electronics', label: 'Electronics', icon: '💻', description: 'Electronic devices and components' },
    { value: 'clothing', label: 'Clothing & Textiles', icon: '👕', description: 'Apparel, textiles, and fashion items' },
    { value: 'cosmetics', label: 'Cosmetics & Personal Care', icon: '💄', description: 'Beauty products and personal care items' }
  ];

  return (
    <div className="space-y-8 fade-in">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <FileText className="h-6 w-6 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Basic Product Information</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Let's start with the essential details about your product. This information will help us generate a comprehensive transparency report.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label flex items-center space-x-2">
              <Tag className="h-4 w-4 text-emerald-600" />
              <span>Product Name *</span>
            </label>
            <div className="input-group">
              <input
                {...register('name', { 
                  required: 'Product name is required',
                  minLength: { value: 2, message: 'Product name must be at least 2 characters' }
                })}
                className={`form-input focus-ring ${errors.name ? 'border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="Enter your product name"
              />
              {errors.name && (
                <div className="form-error">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{errors.name.message}</span>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label flex items-center space-x-2">
              <Building className="h-4 w-4 text-emerald-600" />
              <span>Company Name *</span>
            </label>
            <div className="input-group">
              <input
                {...register('company', { 
                  required: 'Company name is required',
                  minLength: { value: 2, message: 'Company name must be at least 2 characters' }
                })}
                className={`form-input focus-ring ${errors.company ? 'border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="Enter your company name"
              />
              {errors.company && (
                <div className="form-error">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{errors.company.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label flex items-center space-x-2">
            <ClipboardList className="h-4 w-4 text-emerald-600" />
            <span>Product Category *</span>
          </label>
          <div className="input-group">
            <select
              {...register('category', { required: 'Category is required' })}
              className={`form-select focus-ring ${errors.category ? 'border-red-500 focus:ring-red-500/50' : ''}`}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <div className="form-error">
                <AlertTriangle className="h-4 w-4" />
                <span>{errors.category.message}</span>
              </div>
            )}
          </div>
          
          {watchedCategory && (
            <div className="mt-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{categories.find(c => c.value === watchedCategory)?.icon}</span>
                <div>
                  <h4 className="text-emerald-800 font-semibold">
                    {categories.find(c => c.value === watchedCategory)?.label}
                  </h4>
                  <p className="text-emerald-700 text-sm">
                    {categories.find(c => c.value === watchedCategory)?.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label flex items-center space-x-2">
            <FileText className="h-4 w-4 text-emerald-600" />
            <span>Product Description</span>
            <span className="text-gray-500 text-xs font-normal">(Optional)</span>
          </label>
          <div className="input-group">
            <textarea
              {...register('description')}
              className="form-textarea focus-ring"
              rows={4}
              placeholder="Describe your product, its key features, and any transparency considerations..."
            />
          </div>
          <p className="text-gray-500 text-sm mt-2">
            A detailed description helps generate more accurate transparency reports and recommendations.
          </p>
        </div>
      </div>

      {isValid && (
        <div className="status-success slide-up">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Ready to proceed to detailed questions</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 gap-4">
        <div className="text-gray-500 text-sm">
          Step 1 of 3 - Basic Information
        </div>
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className={`btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 w-full sm:w-auto justify-center ${
            !isValid ? 'grayscale' : 'hover-glow'
          }`}
        >
          <span>Continue to Details</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default BasicInfoStep;
