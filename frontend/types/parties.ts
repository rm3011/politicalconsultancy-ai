export interface PoliticalParty {
  id: string;
  name: string;
  fullName: string;
  imagePath?: string;
  website?: string;
  color?: string;
  description?: string;
  founded?: string;
  leader?: string;
}

export type PoliticalParties = PoliticalParty[];
