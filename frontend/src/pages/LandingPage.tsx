import { Link } from 'react-router-dom';
import { DocumentIcon, ChartIcon, ShieldIcon, PlusIcon, ArrowRightIcon, EyeIcon } from '../components/Icons';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl mb-6">
            Product Transparency
            <span className="block text-emerald-600 mt-2">Made Simple</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed px-4">
            Create comprehensive transparency reports for your products.
            Collect detailed information through our smart forms and generate
            professional PDF reports instantly.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <Link
              to="/submit"
              className="btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Start Product Submission</span>
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              to="/products"
              className="btn-secondary flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <EyeIcon className="h-5 w-5" />
              <span>Browse Products</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16 md:mb-20">
          <div className="card p-6 text-center hover-lift-card">
            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-emerald-50 border border-emerald-200 mx-auto mb-4">
              <DocumentIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Smart Forms</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Dynamic multi-step forms that adapt based on your product category
            </p>
          </div>

          <div className="card p-6 text-center hover-lift-card">
            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-emerald-50 border border-emerald-200 mx-auto mb-4">
              <ChartIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailed Reports</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Generate comprehensive PDF reports with all product information
            </p>
          </div>

          <div className="card p-6 text-center hover-lift-card">
            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-emerald-50 border border-emerald-200 mx-auto mb-4">
              <ShieldIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Secure Storage</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your product data is securely stored and easily accessible
            </p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="card p-6 text-center hover-lift-card">
              <div className="bg-emerald-50 border border-emerald-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Fill the Form</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Complete our smart multi-step form with your product details
              </p>
            </div>

            <div className="card p-6 text-center hover-lift-card">
              <div className="bg-emerald-50 border border-emerald-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Review Information</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Check your submitted information in a structured format
              </p>
            </div>

            <div className="card p-6 text-center hover-lift-card">
              <div className="bg-emerald-50 border border-emerald-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Download Report</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Generate and download your professional PDF transparency report
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
