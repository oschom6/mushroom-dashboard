import { seedGrows } from '../data/seedData';

const STORAGE_KEY = 'mushroom_dashboard_grows_v2';

const statusMap = {
  harvested: 'Harvested',
  failed: 'Contaminated',
  colonizing: 'Growing',
  fruiting: 'Growing',
  active: 'Growing',
};


const chamberOptions = new Set([
  'SGFC (Shotgun Fruiting Chamber)',
  'Dub Tub',
  'Martha Tent',
  'Monotub',
  'Agar Plate',
  'Other',
]);

const geneticsMap = {
  'grain spawn': 'Grain Spawn',
  'liquid culture': 'Liquid Culture',
  spore: 'Spore',
  'spore print': 'Spore',
  agar: 'Agar',
  'agar culture': 'Agar',
};

const normalizeGrow = (grow) => ({
  ...grow,
  grainType: grow.grainType || '',
  grainAmount: grow.grainAmount || '',
  grainAmountUnit: grow.grainAmountUnit || 'grams',
  spawnAmount: grow.spawnAmount || '',
  spawnAmountUnit: grow.spawnAmountUnit || 'grams',
  fruitingChamberType: chamberOptions.has(grow.fruitingChamberType) ? grow.fruitingChamberType : 'Monotub',
  spawnToBulkDate: grow.spawnToBulkDate || '',
  status: statusMap[(grow.status || '').toLowerCase()] || grow.status || 'Growing',
  geneticsSource: geneticsMap[(grow.geneticsSource || '').toLowerCase()] || grow.geneticsSource || 'Grain Spawn',
});

export const loadGrows = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedGrows));
    return seedGrows;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeGrow) : seedGrows;
  } catch {
    return seedGrows;
  }
};

export const saveGrows = (grows) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(grows));
};

export const createId = (prefix = 'id') =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
