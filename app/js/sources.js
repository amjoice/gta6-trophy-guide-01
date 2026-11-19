// The Sources view: where every fact in this guide comes from, what the
// guide does not know yet, and how progress is kept. Honest about the
// game's age: GTA 6 released 19 Nov 2026, so no guide has been checked
// in the game, and this one says so instead of inventing walkthroughs.

export function renderSources(container, doc) {
  container.replaceChildren();

  const intro = document.createElement('p');
  intro.textContent = 'This guide is built from the official trophy list and nothing else it has not checked. The game released on 19 Nov 2026, a day before this guide was written, so the community guides that usually pin down exact locations are still being written. Where the official description does not pin down a place or a step, the guide says so and gives the general strategy instead of inventing one.';
  container.append(intro);

  const listTitle = document.createElement('h3');
  listTitle.textContent = 'Sources';
  const list = document.createElement('ul');
  list.className = 'sources-list';
  for (const source of Object.values(doc.sources)) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.textContent = source.label;
    link.target = '_blank';
    link.rel = 'noopener';
    item.append(link);
    list.append(item);
  }
  container.append(listTitle, list);

  const what = document.createElement('h3');
  what.textContent = 'What each source is used for';
  const whatList = document.createElement('ul');
  whatList.className = 'sources-list';
  const items = [
    'Exophase: every trophy’s official name, description and grade, as PlayStation publishes them.',
    'PSNProfiles: the progress counts PlayStation tracks for the count trophies — 42 Shooting Range challenges, 14 Top Fun locations, 9 activity types, 8 stranger strands, 18 meditation spots, 52 areas, 9 gangs, 500 choices and 8 garage properties.',
    'Our own advice: every guide paragraph is written for this entry from the official description. It is not copied from any guide, wiki, video or forum post, and it is labelled as not yet checked in the game wherever it goes beyond the description.',
  ];
  for (const text of items) {
    const item = document.createElement('li');
    item.textContent = text;
    whatList.append(item);
  }
  container.append(what, whatList);

  const keeping = document.createElement('h3');
  keeping.textContent = 'How your progress is kept';
  const keepingText = document.createElement('p');
  keepingText.textContent = 'Ticks, counts and the spoiler setting live in this browser’s local storage under one key, and nowhere else. Export writes them to a JSON file you own; import reads that file back. Nothing is sent anywhere: the guide loads no file but its own, makes no network request, and shows no Rockstar logo or official artwork.';
  container.append(keeping, keepingText);
}
