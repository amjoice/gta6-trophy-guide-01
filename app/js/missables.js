// The missables page. Two lists, kept apart on purpose: the trophies that
// can genuinely pass you by, and the ones that are only easy to overlook.
// Both are built from the official descriptions — a trophy is called
// missable only when its description ties it to a partner or a story
// moment that may not come back.

export function renderMissables(container, trophies, state, hooks) {
  container.replaceChildren();

  const missable = trophies.filter((trophy) => trophy.missable);
  const overlooked = trophies.filter((trophy) => trophy.overlook);

  const warn = document.createElement('div');
  warn.className = 'missable-note';
  const warnTitle = document.createElement('h3');
  warnTitle.textContent = 'Missable — do these before the story moves on';
  const warnText = document.createElement('p');
  warnText.textContent = 'Three trophies need a partner beside you, and partner time is limited to story segments. There is no sign in the official descriptions that any other trophy can be missed: story missions and chapters are progress markers, and the collectibles, activities and crime trophies are all available in the open world after the story.';
  warn.append(warnTitle, warnText);
  container.append(warn);

  const missableList = document.createElement('ul');
  missableList.className = 'stage-list';
  for (const trophy of missable) {
    missableList.append(missableRow(trophy, state, hooks));
  }
  container.append(missableList);

  const overlookTitle = document.createElement('h3');
  overlookTitle.textContent = 'Easy to overlook — not locked, but rare';
  const overlookText = document.createElement('p');
  overlookText.className = 'view-intro';
  overlookText.textContent = 'These six are not missable — the places and the moves are always available — but nothing in the story sends you to them, so they are the ones players finish last. Do them whenever you are nearby.';
  container.append(overlookTitle, overlookText);

  const overlookList = document.createElement('ul');
  overlookList.className = 'stage-list';
  for (const trophy of overlooked) {
    overlookList.append(missableRow(trophy, state, hooks));
  }
  container.append(overlookList);
}

function missableRow(trophy, state, hooks) {
  const item = document.createElement('li');
  const mark = document.createElement('span');
  mark.className = 'earned-mark';
  mark.textContent = state.earned[trophy.id] ? '✓' : '○';
  const name = document.createElement('span');
  name.textContent = trophy.name + ' — ' + trophy.description;
  item.append(mark, name);
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => hooks.onSelect(trophy.id));
  return item;
}
