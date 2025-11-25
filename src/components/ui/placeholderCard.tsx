import React from 'react';
import type { LucideIcon } from 'lucide-react';

type PlaceholderProps = {
  Icon?: LucideIcon;
  title: string;
  description: string;
};

const PlaceholderCard: React.FC<PlaceholderProps> = ({
  Icon,
  title,
  description,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6">
      {Icon ? (
        <Icon className="w-12 h-12 text-gray-800" />
      ) : (
        <span className="text-gray-400 text-6xl">📜</span>
      )}
      <p className="text-gray-600 font-semibold text-lg mt-2">{title}</p>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
};

export default PlaceholderCard;
