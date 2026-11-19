// Progress saved in the browser: earned trophies, counts toward PSN targets,
// and the spoiler setting. One localStorage key, one JSON document, so the
// whole state exports and imports as a single file the reader owns.

export const STORAGE_KEY = 'leonida-platinum-v1';

export function blankState() {
  return { earned: {}, counts: {}, spoilers: false, version: 1 };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return blankState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return blankState();
    return {
      earned: parsed.earned && typeof parsed.earned === 'object' ? parsed.earned : {},
      counts: parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {},
      spoilers: parsed.spoilers === true,
      version: 1,
    };
  } catch {
    return blankState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function isEarned(state, id) {
  return state.earned[id] === true;
}

export function setEarned(state, id, earned) {
  if (earned) state.earned[id] = true;
  else delete state.earned[id];
  saveState(state);
}

export function earnedCount(state) {
  return Object.keys(state.earned).length;
}

export function getCount(state, id) {
  const value = state.counts[id];
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function setCount(state, trophy, value) {
  const clamped = Math.max(0, Math.min(trophy.target ?? 0, Math.floor(value) || 0));
  if (clamped > 0) state.counts[trophy.id] = clamped;
  else delete state.counts[trophy.id];
  if (trophy.target != null && clamped >= trophy.target) state.earned[trophy.id] = true;
  saveState(state);
}

export function exportFileName() {
  const date = new Date().toISOString().slice(0, 10);
  return 'leonida-platinum-progress-' + date + '.json';
}

export function parseImported(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') throw new Error('Not a progress file');
  const earned = parsed.earned && typeof parsed.earned === 'object' ? parsed.earned : {};
  const counts = parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {};
  const clean = blankState();
  for (const [key, value] of Object.entries(earned)) {
    if (value === true) clean.earned[key] = true;
  }
  for (const [key, value] of Object.entries(counts)) {
    if (Number.isFinite(value) && value > 0) clean.counts[key] = Math.floor(value);
  }
  if (parsed.spoilers === true) clean.spoilers = true;
  return clean;
}
