'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { PoliticalParty } from '@/types/parties';

interface LogoItemProps {
  party: PoliticalParty;
  onInteraction?: (partyId: string) => void;
  className?: string;
}

const LogoItem = memo(({ party, onInteraction, className = '' }: LogoItemProps) => {
  const handleClick = () => {
    onInteraction?.(party.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onInteraction?.(party.id);
    }
  };

  // Use a fallback if imagePath is undefined or empty
  const imageSrc = party.imagePath || '/logos-loop/placeholder-logo.svg';
  const partyName = party.name || 'Political Party';
  const partyFullName = party.fullName || partyName;

  return (
    <div 
      className={`flex flex-col items-center gap-3 group ${className}`}
      role="listitem"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => onInteraction?.(party.id)}
    >
      <div 
        className="relative w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-[#020202]/60 border border-red-500/10 overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:border-red-500/30 group-hover:shadow-2xl group-hover:shadow-red-500/5 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#020202] neuomorphic-flat"
        style={{ 
          transitionProperty: 'transform, border, box-shadow',
        }}
      >
        <Image
          src={imageSrc}
          alt={`${partyName} logo - ${partyFullName}`}
          fill
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/webp;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q=="
          sizes="(max-width: 768px) 56px, 80px"
          className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.src = '/images/placeholder-logo.svg';
          }}
        />
      </div>
      <span className="text-[10px] md:text-xs text-zinc-500 font-medium tracking-wide whitespace-nowrap group-hover:text-red-500 transition-all duration-300">
        {partyName}
      </span>
    </div>
  );
});

LogoItem.displayName = 'LogoItem';

export default LogoItem;  