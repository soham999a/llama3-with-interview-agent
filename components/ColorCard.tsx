import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ColorCardProps {
  title: string;
  color?: 'primary' | 'secondary' | 'dark' | 'yellow' | 'blue' | 'green' | 'peach';
  icon?: React.ReactNode;
  href: string;
  className?: string;
}

const ColorCard: React.FC<ColorCardProps> = ({ title, color = 'dark', icon, href, className }) => {
  // Color mapping using the EngineerHub palette colors
  const colorMap = {
    primary: 'bg-teal-500',
    secondary: 'bg-teal-400',
    dark: 'bg-gray-100',
    yellow: 'card-yellow',
    blue: 'card-blue',
    green: 'card-green',
    peach: 'card-peach',
  };

  // Text color mapping
  const textColorMap = {
    primary: 'text-white',
    secondary: 'text-white',
    dark: 'text-gray-800',
    yellow: 'text-gray-800',
    blue: 'text-gray-800',
    green: 'text-gray-800',
    peach: 'text-gray-800',
  };

  return (
    <Link href={href} className={`block ${className}`}>
      <div
        className={`${colorMap[color]} rounded-3xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full relative overflow-hidden`}
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="flex flex-col h-full relative z-10">
          <h3 className={`${textColorMap[color]} font-bold text-xl mb-4`}>{title}</h3>

          <div className="mt-auto">
            {icon && (
              <div className="flex justify-end">
                <div className="bg-teal-500/20 rounded-2xl p-4">
                  {icon}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ColorCard;
