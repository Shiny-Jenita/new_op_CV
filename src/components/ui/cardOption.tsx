import React from 'react';
import { Loader2 } from 'lucide-react';

interface CardOptionProps {
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const CardOption: React.FC<CardOptionProps> = ({ title, description, onClick, disabled = false, loading = false }) => (
  <div
    className={`relative border border-sky-700 shadow-lg rounded-lg p-6 transition-all duration-200 \
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl'}`}
    onClick={() => {
      if (!disabled && !loading) {
        onClick();
      }
    }}
  >
    {loading && (
      <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center rounded-lg">
        <Loader2 className="animate-spin text-sky-700" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-sky-700 flex items-center">
      {title}
    </h3>
    <p className="text-gray-500 text-sm mt-2">{description}</p>
  </div>
);

export default CardOption;
