import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../services/api';
import { Question, ProductFormData } from '../types';
import { PackageIcon } from '../components/Icons';
import ProgressIndicator from '../components/ProductForm/ProgressIndicator';
import BasicInfoStep from '../components/ProductForm/BasicInfoStep';
import DetailsStep from '../components/ProductForm/DetailsStep';
import ReviewStep from '../components/ProductForm/ReviewStep';

const ProductForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProductFormData>();

  const watchedCategory = watch('category');

  useEffect(() => {
    if (watchedCategory && watchedCategory !== selectedCategory) {
      setSelectedCategory(watchedCategory);
      loadQuestions(watchedCategory);
    }
  }, [watchedCategory, selectedCategory]);

  const loadQuestions = async (category: string) => {
    try {
      const fetchedQuestions = await productApi.getQuestions(category);
      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const answers = questions.map(question => ({
        question_id: question.id,
        value: (data as any)[`question_${question.id}`] || ''
      })).filter(answer => answer.value);

      const submissionData: ProductFormData = {
        name: data.name,
        category: data.category,
        company: data.company,
        description: data.description,
        answers
      };

      const result = await productApi.submitProduct(submissionData);
      navigate(`/report/${result.product.id}`);
    } catch (error) {
      console.error('Error submitting product:', error);
      alert('Error submitting transparency report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="card p-6 sm:p-8 lg:p-12 shadow-2xl">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <PackageIcon className="h-10 w-10 text-emerald-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Product Transparency Portal
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed px-4">
              Create a comprehensive transparency report for your product. Help drive positive impact 
              through data disclosure and build trust with stakeholders through complete transparency.
            </p>
          </div>

          <div className="mb-8 sm:mb-12">
            <ProgressIndicator currentStep={currentStep} totalSteps={3} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="min-h-[400px] sm:min-h-[600px]">
              {currentStep === 1 && (
                <BasicInfoStep
                  register={register}
                  errors={errors}
                  watchedCategory={watchedCategory}
                  onNext={nextStep}
                  watch={watch}
                />
              )}

              {currentStep === 2 && (
                <DetailsStep
                  register={register}
                  questions={questions}
                  onPrevious={prevStep}
                  onNext={nextStep}
                  watch={watch}
                />
              )}

              {currentStep === 3 && (
                <ReviewStep
                  watch={watch}
                  loading={loading}
                  onPrevious={prevStep}
                />
              )}
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Secure • Confidential • AI-Powered Analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
