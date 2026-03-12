import React from 'react';

interface Props {
  message?: string;
}

const LoadingSpinner: React.FC<Props> = ({ message = 'Cargando...' }) => (
  <div className="text-center py-8">{message}</div>
);

export default LoadingSpinner;
