/* eslint-disable react/prop-types */
import { Loader2 } from 'lucide-react';
import { BarLoader } from 'react-spinners';

const LoadingSpinner = ({ size = 'default', text = '', fullPage = false }) => {
  const sizes = {
    small: 'h-4 w-4',
    default: 'h-6 w-6',
    large: 'h-8 w-8',
  };

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className={`${sizes[size]} animate-spin mx-auto mb-4 text-[var(--primary-red)]`} />
          {text && <p className="text-[var(--neutral-600)] text-sm">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <Loader2 className={`${sizes[size]} animate-spin mx-auto mb-2 text-[var(--primary-red)]`} />
        {text && <p className="text-[var(--neutral-600)] text-sm">{text}</p>}
      </div>
    </div>
  );
};

const LoadingBar = ({ width = '100%', color = '#ec2e3a', className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      <BarLoader width={width} color={color} />
    </div>
  );
};

const LoadingCard = () => {
  return (
    <div className="wellfound-card animate-pulse">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-14"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

const LoadingGrid = ({ count = 6 }) => {
  return (
    <div className="wellfound-grid">
      {Array.from({ length: count }).map((_, index) => (
        <LoadingCard key={index} />
      ))}
    </div>
  );
};

export { LoadingSpinner, LoadingBar, LoadingCard, LoadingGrid };
