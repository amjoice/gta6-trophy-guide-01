// Loads the official trophy list with our guides and exposes it with helpers.
// The data file is fetched at run time from this app's own files (data/trophies.json);
// the app makes no network request anywhere else.

export async function loadTrophyData() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('Could not load data/trophies.json');
  const doc = await response.json();
  return doc;
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function kindLabel(kind) {
  const labels = {
    platinum: 'Platinum',
    story: 'Story',
    side: 'Side & strangers',
    collectibles: 'Collectibles',
    activities: 'Activities',
    crime: 'Crime',
    world: 'World',
  };
  return labels[kind] ?? kind;
}

export function trophyCountText(trophy) {
  if (trophy.target == null) return null;
  const unit = trophy.targetUnit ?? '';
  return 'PSN target: ' + trophy.target.toLocaleString('en-US') + (unit ? ' ' + unit : '');
}

export function sortTrophies(trophies) {
  const order = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
  return [...trophies].sort((a, b) => {
    const byGrade = (order[a.grade] ?? 9) - (order[b.grade] ?? 9);
    return byGrade !== 0 ? byGrade : a.id - b.id;
  });
}
