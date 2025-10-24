import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../services/api';
import type { ProductWithAnswers } from '../types';
import { 
  FileText, 
  Package, 
  Calendar, 
  Building, 
  Download, 
  Loader2, 
  Plus,
  ChevronLeft
} from 'lucide-react';

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ProductWithAnswers | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadProductData(id);
    }
  }, [id]);

  const loadProductData = async (productId: string) => {
    try {
      const productData = await productApi.getProduct(productId);
      setData(productData);
    } catch (error) {
      console.error('Error loading product data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!id) return;
    
    setPdfLoading(true);
    try {
      const pdfBlob = await productApi.generatePDF(id);
      
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `product-report-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card">
          <div className="text-center py-12 px-4 sm:px-8">
            <div className="flex justify-center mb-4">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The requested product could not be found.</p>
            <Link to="/" className="btn-secondary inline-flex items-center space-x-2">
              <ChevronLeft className="h-5 w-5" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { product, answers } = data;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-emerald-600" />
                  <span>Product Transparency Report</span>
                </h1>
                <p className="text-gray-600 flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Generated on {new Date(product.created_at).toLocaleDateString()}</span>
                </p>
              </div>
              <button
                onClick={downloadPDF}
                disabled={pdfLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {pdfLoading ? (
                  <span className="flex items-center space-x-2 justify-center">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Generating...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2 justify-center">
                    <Download className="h-5 w-5" />
                    <span>Download PDF</span>
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Package className="h-6 w-6 text-emerald-600" />
                <span>Product Information</span>
              </h2>
              <div className="card">
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">Product Name</h3>
                      <p className="text-gray-900 text-lg">{product.name}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">Category</h3>
                      <span className="badge badge-emerald">
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">Company</h3>
                      <p className="text-gray-900 flex items-center space-x-2">
                        <Building className="h-5 w-5 text-gray-600" />
                        <span>{product.company}</span>
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">Submission Date</h3>
                      <p className="text-gray-900">
                        {new Date(product.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {product.description && (
                      <div className="md:col-span-2">
                        <h3 className="font-medium text-gray-700 mb-1">Description</h3>
                        <p className="text-gray-900">{product.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {answers.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-emerald-600" />
                  <span>Detailed Information</span>
                </h2>
                <div className="space-y-4">
                  {answers.map((answer) => (
                    <div key={answer.id} className="card">
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-2">
                          {answer.question_text}
                        </h3>
                        <p className="text-gray-700">{answer.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-8"></div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link to="/submit" className="btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center">
                <Plus className="h-5 w-5" />
                <span>Submit Another Product</span>
              </Link>
              <Link to="/" className="text-gray-600 hover:text-gray-900 hover:bg-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 w-full sm:w-auto justify-center">
                <ChevronLeft className="h-5 w-5" />
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
