export type CharacterType = 'fox' | 'bunny' | 'sloth';

export type BiomeType = 'tundra' | 'rainforest' | 'sahara';

export type GameMode = 'home' | 'citizen' | 'zpd' | 'hustle';

export type ZPDStage = 'clues' | 'chase' | 'arrest';

export type RankType = 'meter-maid' | 'officer' | 'detective' | 'chief';

export const RANK_LABELS = {
  'meter-maid': 'Meter Maid',
  'officer': 'Officer',
  'detective': 'Detective',
  'chief': 'Chief',
};

export const RANK_ORDER[] = ['meter-maid', 'officer', 'detective', 'chief'];
