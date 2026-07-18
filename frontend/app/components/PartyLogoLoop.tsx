'use client';

import { memo, useMemo } from 'react';
import LogoLoop from './LogoLoop';
import type { LogoItem } from './LogoLoop';
import type { PoliticalParty } from '@/types/parties';
import LogoItemComponent from './LogoItem';

interface PartyLogoLoopProps {
  parties?: PoliticalParty[]; // ← Made optional
  speed?: number;
  direction?: 'left' | 'right';
  height?: number;
  gap?: number;
  fadeOut?: boolean;
  paddingBottom?: number | string;
  onPartyInteraction?: (partyId: string) => void;
  className?: string;
}

const PartyLogoLoop = memo(({
  parties = [], // ← Default empty array
  speed = 60,
  direction = 'left',
  height = 50,
  gap = 35,
  fadeOut = false,
  paddingBottom = 0,
  onPartyInteraction,
  className = '',
}: PartyLogoLoopProps) => {
  const logoItems: LogoItem[] = useMemo(() => {
    if (!parties || parties.length === 0) {
      return [];
    }
    return parties.map((party) => ({
      node: (
        <LogoItemComponent 
          key={party.id} 
          party={party} 
          onInteraction={onPartyInteraction}
        />
      ),
      href: party.website || undefined,
      title: party.name,
      ariaLabel: `${party.name} logo`,
    }));
  }, [parties, onPartyInteraction]);

  if (logoItems.length === 0) {
    return null;
  }

  return (
    <LogoLoop
      logos={logoItems}
      speed={speed}
      direction={direction}
      logoHeight={height}
      gap={gap}
      fadeOut={fadeOut}
      fadeOutColor="#020202"
      scaleOnHover={true}
      paddingBottom={paddingBottom}
      className={className}
    />
  );
});

PartyLogoLoop.displayName = 'PartyLogoLoop';

export default PartyLogoLoop;
