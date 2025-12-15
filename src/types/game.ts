export type CharacterType = 'fox' | 'bunny' | 'sloth';

export type BiomeType = 'tundra' | 'rainforest' | 'sahara';

export type GameMode = 'home' | 'citizen' | 'zpd' | 'hustle';

export type ZPDStage = 'clues' | 'chase' | 'arrest';

export type RankType = 'meter-maid' | 'officer' | 'detective' | 'chief';

export interface PlayerStats {
  bucks: number;
  rank: RankType;
  rankProgress: number; // 0-100
  apartmentLevel: number; // 1-5
  totalFocusMinutes: number;
}

export interface TimerState {
  isActive: boolean;
  timeRemaining: number; // in seconds
  totalTime: number;
  mode: GameMode;
  biome?: BiomeType;
  zpdStage?: ZPDStage;
}

export interface FurnitureItem {
  id: string;
  name: string;
  cost: number;
  biome: BiomeType;
  owned: boolean;
}

export const RANK_LABELS: Record<RankType, string> = {
  'meter-maid': 'Meter Maid',
  'officer': 'Officer',
  'detective': 'Detective',
  'chief': 'Chief',
};

export const RANK_ORDER: RankType[] = ['meter-maid', 'officer', 'detective', 'chief'];
