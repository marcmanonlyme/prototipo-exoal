import React from 'react';

interface Props {
  message: string;
}

const ErrorBanner: React.FC<Props> = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    {message}
  </div>
);

export default ErrorBanner;
