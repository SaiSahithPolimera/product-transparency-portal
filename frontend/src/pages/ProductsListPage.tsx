import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../services/api';
import type { ProductsResponse } from '../types';
import { useAuth } from '../contexts/AuthContext';
import {
  PackageIcon,
  FilterIcon,
  SearchIcon,
  CalendarIcon,
  BuildingIcon,
  UserIcon,
  EyeIcon,
  DownloadIcon,
  LoadingSpinner,
  LoadingSpinnerLg,
  PlusIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XIcon,
  InfoIcon as AlertTriangleIcon
} from '../components/Icons';

interface ErrorNotificationProps {
  message: string;
  onClose: () => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full">
      <div className="bg-red-50 border border-red-300 rounded-lg p-4 shadow-xl flex items-start space-x-3">
        <AlertTriangleIcon className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-800">
            Download Error
          </p>
          <p className="text-sm text-red-700 mt-1">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 -mr-2 rounded-md text-red-500 hover:bg-red-100 transition-colors flex-shrink-0"
          aria-label="Close notification"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};


const ProductsListPage: React.FC = () => {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    category: '',
    company: ''
  });
  const [downloadingPDF, setDownloadingPDF] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productApi.getAllProducts({
        page: filters.page,
        limit: 12,
        ...(filters.category && { category: filters.category }),
        ...(filters.company && { company: filters.company })
      });
      setData(response);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const downloadPDF = async (productId: string, productName: string) => {
    setError(null);
    setDownloadingPDF(productId);
    try {
      const pdfBlob = await productApi.generatePDF(productId);

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${productName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError(
        'Failed to generate PDF. Please ensure the product details are valid and complete, then try again. If the issue persists, contact support.'
      );
    } finally {
      setDownloadingPDF(null);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'food', label: 'Food & Beverages' },
    { value: 'non-food', label: 'Non-Food Products' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing & Textiles' },
    { value: 'cosmetics', label: 'Cosmetics & Personal Care' }
  ];

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card p-8">
          <div className="flex items-center justify-center">
            <LoadingSpinnerLg className="h-8 w-8 text-emerald-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-3">
            <PackageIcon className="h-8 w-8 text-emerald-600" />
            <span>Product Transparency Reports</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto px-4">
            Browse all submitted product transparency reports and download detailed PDF summaries.
          </p>
        </div>

        <div className="card mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-gray-900 flex items-center space-x-2 text-lg font-semibold">
              <FilterIcon className="h-5 w-5 text-emerald-600" />
              <span>Filters</span>
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="form-input"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Company</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={filters.company}
                    onChange={(e) => handleFilterChange('company', e.target.value)}
                    placeholder="Search by company name"
                    className="form-input pl-10"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setFilters({ page: 1, category: '', company: '' })}
                  className="btn-secondary w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {data && data.products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data.products.map((product) => (
                <div key={product.id} className="card hover-lift-card flex flex-col">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-4 gap-2">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <PackageIcon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                        <h3 className="text-gray-900 text-lg font-semibold truncate">{product.name}</h3>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600 text-sm flex-shrink-0">
                        <CalendarIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">{new Date(product.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="badge badge-emerald">
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 flex-1 flex flex-col space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-700 text-sm">
                        <BuildingIcon className="h-5 w-5 text-gray-600 flex-shrink-0" />
                        <span className="truncate">{product.company}</span>
                      </div>
                      {product.user_email && isAuthenticated && (
                        <div className="flex items-center space-x-2 text-gray-600 text-sm">
                          <UserIcon className="h-5 w-5 flex-shrink-0" />
                          <span className="truncate">{product.user_email}</span>
                        </div>
                      )}
                    </div>

                    {product.description && (
                      <p className="text-gray-600 text-sm line-clamp-3 flex-1">
                        {product.description}
                      </p>
                    )}

                    <div className="flex space-x-2 pt-2">
                      <Link to={`/report/${product.id}`} className="flex-1 btn-primary text-center flex items-center justify-center space-x-2 text-sm py-2">
                        <EyeIcon className="h-5 w-5" />
                        <span>View Report</span>
                      </Link>
                      <button
                        onClick={() => downloadPDF(product.id.toString(), product.name)}
                        disabled={downloadingPDF === product.id.toString()}
                        className="btn-secondary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        title="Download PDF"
                      >
                        {downloadingPDF === product.id.toString() ? (
                          <LoadingSpinner className="h-5 w-5 text-emerald-600 animate-spin" />
                        ) : (
                          <DownloadIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {data.pagination.totalPages > 1 && (
              <div className="card">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600 text-center sm:text-left">
                      Showing page {data.pagination.currentPage} of {data.pagination.totalPages}
                      ({data.pagination.totalProducts} total products)
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => handlePageChange(data.pagination.currentPage - 1)}
                        disabled={!data.pagination.hasPrev}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span>Previous</span>
                      </button>

                      {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, data.pagination.currentPage - 2) + i;
                        if (pageNum > data.pagination.totalPages) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={pageNum === data.pagination.currentPage
                              ? "btn-primary"
                              : "btn-secondary"
                            }
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(data.pagination.currentPage + 1)}
                        disabled={!data.pagination.hasNext}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <span>Next</span>
                        <ArrowRightIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="card">
            <div className="text-center py-12 px-4 sm:px-8">
              <div className="flex justify-center mb-4">
                <PackageIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                {filters.category || filters.company
                  ? 'Try adjusting your filters or clearing them to see more results.'
                  : 'No products have been submitted yet.'
                }
              </p>
              <Link to="/submit" className="btn-primary inline-flex items-center space-x-2">
                <PlusIcon className="h-5 w-5" />
                <span>Submit First Product</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      <ErrorNotification
        message={error || ''}
        onClose={() => setError(null)}
      />
    </div>
  );
};

export default ProductsListPage;