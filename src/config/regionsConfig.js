// Region Background Images
import bunnyburrowBg from '@/assets/regions/bunnyburrow-bg.png';
import littleRodentiaBg from '@/assets/regions/little-rodentia-bg.png';
import savannaCentralBg from '@/assets/regions/savanna-central-bg.png';
import rainforestBg from '@/assets/regions/rainforest-bg.png';
import tundratownBg from '@/assets/regions/tundratown-bg.png';
import saharaSquareBg from '@/assets/regions/sahara-square-bg.png';
import nocturnalBg from '@/assets/regions/nocturnal-bg.png';
import meadowlandsBg from '@/assets/regions/meadowlands-bg.png';
import outbackIslandBg from '@/assets/regions/outback-island-bg.png';

// Character Sprites
import judySprite from '@/assets/characters/judy-sprite.png';
import nickSprite from '@/assets/characters/nick.png';
import slothSprite from '@/assets/characters/sloth-sprite.png';
import polarSprite from '@/assets/characters/polar.png';
import mouseSprite from '@/assets/characters/mouse-sprite.png';

// All 9 Zootopia Regions Configuration
export const REGIONS = [
  {
    id: 'bunnyburrow',
    name: 'Bunnyburrow',
    description: 'The peaceful countryside where it all begins',
    unlockLevel: 0, // UNLOCKED
    themeColors: {
      primary: '140 60% 45%',
      secondary: '35 70% 50%',
      glow: '140 70% 55%',
    },
    backgroundImage: bunnyburrowBg,
    characterSprite: judySprite,
    characterName: 'Judy',
    characterMessage: "Welcome to my hometown! Let's get focused!",
    icon: '🥕',
  },
  {
    id: 'little-rodentia',
    name: 'Little Rodentia',
    description: 'A tiny district with big ambitions',
    unlockLevel: 0, // UNLOCKED
    themeColors: {
      primary: '280 60% 55%',
      secondary: '300 50% 45%',
      glow: '280 70% 65%',
    },
    backgroundImage: littleRodentiaBg,
    characterSprite: mouseSprite,
    characterName: 'Pip',
    characterMessage: 'Small steps lead to big achievements!',
    icon: '🐭',
  },
  {
    id: 'savanna-central',
    name: 'Savanna Central',
    description: 'The bustling heart of Zootopia',
    unlockLevel: 0, // UNLOCKED
    themeColors: {
      primary: '45 80% 50%',
      secondary: '30 70% 45%',
      glow: '45 90% 60%',
    },
    backgroundImage: savannaCentralBg,
    characterSprite: nickSprite,
    characterName: 'Nick',
    characterMessage: "Downtown's calling. Time to hustle!",
    icon: '🦁',
  },
  {
    id: 'rainforest',
    name: 'Rainforest District',
    description: 'Lush, humid, and full of life',
    unlockLevel: 0, // UNLOCKED
    themeColors: {
      primary: '145 65% 45%',
      secondary: '160 50% 35%',
      glow: '145 80% 55%',
    },
    backgroundImage: rainforestBg,
    characterSprite: slothSprite,
    characterName: 'Flash',
    characterMessage: 'Take... your... time... but... stay... focused...',
    icon: '🌴',
  },
  {
    id: 'tundratown',
    name: 'Tundratown',
    description: 'The frozen north where cool heads prevail',
    unlockLevel: 0, // UNLOCKED
    themeColors: {
      primary: '195 85% 60%',
      secondary: '210 70% 50%',
      glow: '195 100% 70%',
    },
    backgroundImage: tundratownBg,
    characterSprite: polarSprite,
    characterName: 'Koslov',
    characterMessage: 'Stay frosty and focused!',
    icon: '❄️',
  },
  {
    id: 'sahara-square',
    name: 'Sahara Square',
    description: 'Where the heat is on and stakes are high',
    unlockLevel: 0, // UNLOCKED
    themeColors: {
      primary: '35 90% 55%',
      secondary: '25 80% 45%',
      glow: '40 100% 65%',
    },
    backgroundImage: saharaSquareBg,
    characterSprite: nickSprite,
    characterName: 'Nick',
    characterMessage: "The heat's on! Let's power through!",
    icon: '🏜️',
  },
  {
    id: 'nocturnal',
    name: 'Nocturnal District',
    description: 'Where night owls thrive',
    unlockLevel: 0, // UNLOCKED
    themeColors: {
      primary: '260 50% 35%',
      secondary: '280 40% 25%',
      glow: '260 60% 45%',
    },
    backgroundImage: nocturnalBg,
    characterSprite: judySprite,
    characterName: 'Judy',
    characterMessage: 'The night is young. Focus in the dark!',
    icon: '🦇',
  },
  {
    id: 'meadowlands',
    name: 'Meadowlands',
    description: 'Open fields and clear minds',
    unlockLevel: 0, // UNLOCKED
    themeColors: {
      primary: '100 50% 50%',
      secondary: '120 45% 40%',
      glow: '100 60% 60%',
    },
    backgroundImage: meadowlandsBg,
    characterSprite: judySprite,
    characterName: 'Judy',
    characterMessage: 'Clear skies, clear mind!',
    icon: '🌻',
  },
  {
    id: 'outback-island',
    name: 'Outback Island',
    description: 'The ultimate frontier for focus masters',
    unlockLevel: 0, // UNLOCKED
    themeColors: {
      primary: '20 70% 50%',
      secondary: '15 60% 40%',
      glow: '25 80% 60%',
    },
    backgroundImage: outbackIslandBg,
    characterSprite: nickSprite,
    characterName: 'Nick',
    characterMessage: "G'day mate! Ready for the ultimate focus?",
    icon: '🦘',
  },
];

export const CITIZEN_RANKS = [
  { id: 'newcomer', name: 'Newcomer', minMinutes: 0 },
  { id: 'resident', name: 'Resident', minMinutes: 100 },
  { id: 'local-hero', name: 'Local Hero', minMinutes: 500 },
  { id: 'mayor', name: 'Mayor', minMinutes: 1500 },
];

export function getRegionById(id) {
  return REGIONS.find(r => r.id === id);
}

export function getUnlockedRegions(totalFocusMinutes) {
  // Since all unlockLevels are 0, this will return everything
  return REGIONS.filter(r => totalFocusMinutes >= r.unlockLevel);
}

export function getCurrentRank(totalFocusMinutes) {
  return [...CITIZEN_RANKS].reverse().find(r => totalFocusMinutes >= r.minMinutes) || CITIZEN_RANKS[0];
}

export function getNextRegion(totalFocusMinutes) {
  return REGIONS.find(r => totalFocusMinutes < r.unlockLevel);
}