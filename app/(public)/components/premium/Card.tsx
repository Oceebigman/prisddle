'use client';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function PremiumCard({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`premium-card p-6 animate-[scale-in_0.5s_ease-out] ${className}`}
    >
      {children}
    </div>
  );
}
