import { useId } from 'react';
import type { PortfolioCredential } from '../data/portfolioData';

export function CredentialImage({ credential }: { credential: PortfolioCredential }) {
  const clip = useId();
  const alt = `${credential.title} ${credential.artworkKind === 'badge' || credential.type === 'Badge' ? 'digital badge' : 'certificate'}`;
  if (credential.id === 'mapua-ai-literacy-responsible-use-badge') {
    // Mask only the empty outer canvas; retain every printed logo, label and
    // the badge's own white areas. The original PNG remains unchanged.
    return <svg className="credential-badge-cutout" viewBox="0 0 798 668" width="798" height="668" role="img" aria-label={alt}>
      <defs><clipPath id={clip}>
        <circle cx="430" cy="371" r="297" />
        <circle cx="419" cy="116" r="113" />
        <rect x="73" y="309" width="691" height="122" rx="61" />
      </clipPath></defs>
      <image href={credential.image} width="798" height="668" clipPath={`url(#${clip})`} />
    </svg>;
  }
  return <img src={credential.image} alt={alt} width={credential.imageWidth ?? 600} height={credential.imageHeight ?? 600} loading="lazy" decoding="async" />;
}
