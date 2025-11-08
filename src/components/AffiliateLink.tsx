'use client';

interface AffiliateLinkProps {
  url: string;
  label: string;
  provider: string;
  className?: string;
  variant?: 'button' | 'link' | 'badge';
}

/**
 * Affiliate Link Component
 * 
 * Displays affiliate links with clear labeling for transparency
 */
export function AffiliateLink({
  url,
  label,
  provider,
  className = '',
  variant = 'link',
}: AffiliateLinkProps) {
  const baseClasses = 'inline-flex items-center gap-2 transition-colors';
  
  const variantClasses = {
    button: 'px-4 py-2 bg-sky text-offwhite rounded-lg hover:bg-sky-dark font-medium',
    link: 'text-sky hover:text-sky-dark font-medium underline',
    badge: 'px-3 py-1.5 bg-sage-light text-forest rounded-full hover:bg-sage text-sm font-medium',
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      title={`Affiliate link to ${provider}`}
    >
      <span>{label}</span>
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
      <span className="text-xs opacity-70" title="Affiliate link">
        ↗
      </span>
    </a>
  );
}

