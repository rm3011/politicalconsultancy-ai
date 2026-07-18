'use client';

import { memo, useCallback } from 'react';
import LogoLoop from './LogoLoop';
import LogoItem from './LogoItem';
import type { PoliticalParty } from '@/types/parties';
import type { LogoItem as LogoLoopItem } from './LogoLoop';

interface PartyLogoLoopProps {
  parties: readonly PoliticalParty[] | PoliticalParty[]; // Allow both readonly and mutable
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  height?: number;
  gap?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  onPartyInteraction?: (partyId: string) => void;
  className?: string;
}

const PartyLogoLoop = memo(({
  parties,
  speed = 80,
  direction = 'left',
  height = 60,
  gap = 40,
  fadeOut = true,
  fadeOutColor = '#020202',
  onPartyInteraction,
  className,
}: PartyLogoLoopProps) => {
  const handleInteraction = useCallback((partyId: string) => {
    onPartyInteraction?.(partyId);
  }, [onPartyInteraction]);

  // Convert PoliticalParty[] to LogoItem[]
  const logoItems: LogoLoopItem[] = parties.map((party) => ({
    node: (
      <LogoItem 
        party={party} 
        onInteraction={handleInteraction}
      />
    ),
    href: party.website || undefined,
    title: party.name,
    ariaLabel: `${party.name} - ${party.fullName || party.name}`
  }));

  if (!parties || parties.length === 0) {
    return null;
  }

  return (
    <LogoLoop
      logos={logoItems}
      speed={speed}
      direction={direction}
      logoHeight={height}
      gap={gap}
      pauseOnHover={true}
      scaleOnHover={true}
      fadeOut={fadeOut}
      fadeOutColor={fadeOutColor}
      ariaLabel="Political parties logos"
      className={className}
    />
  );
});

PartyLogoLoop.displayName = 'PartyLogoLoop';

export default PartyLogoLoop;