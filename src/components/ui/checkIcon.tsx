import { FC } from 'react';

interface CheckIconProps {
  className?: string;
  fillColor?: string;
  strokeColor?: string;
  size?: number;
}

const CheckIcon: FC<CheckIconProps> = ({
  className = '',
  fillColor = '#0369a1',
  strokeColor = 'white',
  size = 24
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Check icon"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" fill={fillColor} />
      <path
        d="M6 12.3137L9.31373 15.6275L18 7"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckIcon;
