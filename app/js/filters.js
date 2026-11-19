// Filtering and the spoiler rule. Kinds are the guide's own: story, side,
// collectibles, activities, crime, world — plus the missable flag as a filter
// of its own, since a trophy can be both story and missable. The official
// list holds no online trophies, so there is no online filter to offer.

export function blankFilters() {
  return { query: '', kind: 'all', grade: 'all', hideEarned: false };
}

export const KIND_FILTERS = [
  ['all', 'All'],
  ['story', 'Story'],
  ['missable', 'Missable'],
  ['collectibles', 'Collectibles'],
  ['activities', 'Activities'],
  ['crime', 'Crime'],
  ['side', 'Side & strangers'],
  ['world', 'World'],
];

export function applyFilters(trophies, filters, state) {
  const query = filters.query.trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (filters.kind === 'missable' && !trophy.missable) return false;
    if (filters.kind !== 'all' && filters.kind !== 'missable' && trophy.kind !== filters.kind) return false;
    if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
    if (filters.hideEarned && state.earned[trophy.id]) return false;
    if (query) {
      const haystack = (trophy.name + ' ' + trophy.description + ' ' + trophy.guide).toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

// Spoiler-free hides the name and description of story trophies until they
// are earned, so a reader who has not finished the story sees no plot beats.
export function isSpoilerHidden(trophy, state) {
  return state.spoilers && trophy.kind === 'story' && !state.earned[trophy.id];
}

export function displayName(trophy, state) {
  return isSpoilerHidden(trophy, state) ? 'Hidden trophy — earn it to reveal' : trophy.name;
}

export function displayDescription(trophy, state) {
  return isSpoilerHidden(trophy, state) ? 'A story trophy. Its name and description stay hidden until you earn it.' : trophy.description;
}
