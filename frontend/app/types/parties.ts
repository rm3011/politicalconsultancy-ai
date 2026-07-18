// frontend/app/types/parties.ts
export interface PoliticalParty {
  id: string;
  name: string;
  fullName: string;
  imagePath: string;
  color?: string;
  founded?: number;
  website?: string;
}

export interface PartyLogoItem {
  node: React.ReactNode;
  title: string;
  href: string;
  ariaLabel: string;
}