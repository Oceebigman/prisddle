'use client';

export interface TitleProps {
  children: React.ReactNode;
  subtitle?: string;
  size?: 'lg' | 'xl' | '2xl';
}

export default function PremiumTitle({ children, subtitle, size = 'xl' }: TitleProps) {
  const sizeClasses = {
    lg: 'text-3xl',
    xl: 'text-4xl',
    '2xl': 'text-5xl',
  };

  return (
    <div className="text-center">
      <h1 className={`${sizeClasses[size]} font-black tracking-tight mb-2 animate-[slide-up_0.6s_ease-out]`}>
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          {children}
        </span>
      </h1>
      {subtitle && (
        <p className="text-[#202020]/75 text-lg animate-[slide-up_0.8s_ease-out]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
