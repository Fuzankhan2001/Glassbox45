import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  style?: React.CSSProperties;

}

export function GlassCard({ children, className = "", title, subtitle }: GlassCardProps) {
  return (
    <div 
      className={`backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-sm ${className}`}
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
