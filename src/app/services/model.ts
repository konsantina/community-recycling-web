export type DropoffCreateDto = {
  userId: number;
  materialId: number;
  neighborhoodId: number;
  quantity: number;
  unit: number;
  location: string;
};

export interface LeaderboardEntry {
  userId: number;
  displayName: string;
  neighborhoodName: string;
  totalPoints: number;
}

export interface BadgeDto {
  id: number;
  name: string;
  description?: string | null;
  iconUrl?: string | null;
  unlocked: boolean;
  progress?: number | null;
  target?: number | null;
  ruleType: number;
}

