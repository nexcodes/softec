import Image from 'next/image';
import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  textClassName?: string;
}

const Logo: React.FC<LogoProps> = ({
  size = 40,
  showText = true,
  className = '',
  textClassName = 'text-2xl font-bold',
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src='/logo.png'
        alt='Nigheban.pk Logo'
        width={size}
        height={size}
        className='mr-2 invert'
      />
      {showText && <span className={textClassName}>Nigheban.pk</span>}
    </div>
  );
};

export default Logo;
