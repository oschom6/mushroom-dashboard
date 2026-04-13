import { seedGrows } from '../data/seedData';

const STORAGE_KEY = 'mushroom_dashboard_grows_v1';

export const loadGrows = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedGrows));
    return seedGrows;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedGrows;
  } catch {
    return seedGrows;
  }
};

export const saveGrows = (grows) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(grows));
};

export const createId = (prefix = 'id') =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
