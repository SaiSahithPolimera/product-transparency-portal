import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, LogOutIcon, PackageIcon } from './Icons';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center">
              <PackageIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 hidden md:block">
              Product Transparency
            </h1>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/')
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Home
            </Link>

            <Link
              to="/products"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/products')
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Products
            </Link>

            <Link
              to="/submit"
              className="bg-emerald-500 text-white rounded-xl hover:bg-emerald-400 hover:ease-linear text-sm py-2 px-4 ml-2 transform-none"
            >
              Submit
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <UserIcon className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user?.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  title="Logout"
                >
                  <LogOutIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;