// The tracker: one row per trophy, with its medal, official name and
// description, grade and kind tags, missable and overlook flags, and —
// for the trophies PlayStation tracks a count for — a counter toward the
// PSN target that ticks the trophy off when it reaches it.

import { gradeLabel, kindLabel, trophyCountText } from './data.js';
import { displayDescription, displayName, isSpoilerHidden } from './filters.js';
import { getCount, isEarned, setCount, setEarned } from './store.js';

export function renderChecklist(listEl, trophies, state, hooks) {
  listEl.replaceChildren();
  for (const trophy of trophies) {
    const earned = isEarned(state, trophy.id);
    const hidden = isSpoilerHidden(trophy, state);
    const row = document.createElement('li');
    row.className = 'trophy-row' + (earned ? ' earned' : '') + (hooks.selectedId === trophy.id ? ' selected' : '');
    row.dataset.trophyId = trophy.id;

    const box = document.createElement('button');
    box.type = 'button';
    box.className = 'checkbox';
    box.setAttribute('role', 'checkbox');
    box.setAttribute('aria-checked', String(earned));
    box.setAttribute('aria-label', (earned ? 'Mark not earned: ' : 'Mark earned: ') + trophy.name);
    box.textContent = earned ? '✓' : '';
    box.addEventListener('click', (event) => {
      event.stopPropagation();
      setEarned(state, trophy.id, !earned);
      hooks.onChange();
    });

    const medal = document.createElement('span');
    medal.className = 'medal ' + trophy.grade;
    medal.title = gradeLabel(trophy.grade);

    const main = document.createElement('div');
    main.className = 'trophy-main';

    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = displayName(trophy, state);

    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = displayDescription(trophy, state);

    const tags = document.createElement('div');
    tags.className = 'trophy-tags';
    if (!hidden) {
      tags.append(tag('grade-' + trophy.grade, gradeLabel(trophy.grade)));
      tags.append(tag('kind', kindLabel(trophy.kind)));
      if (trophy.missable) tags.append(tag('missable', 'Missable'));
      if (trophy.overlook) tags.append(tag('overlook', 'Easy to overlook'));
    }

    main.append(name, desc, tags);

    const targetText = trophyCountText(trophy);
    if (targetText && !hidden) {
      const target = document.createElement('div');
      target.className = 'trophy-target';
      const current = getCount(state, trophy.id);
      target.append(document.createTextNode(targetText + ' — you have '));
      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'count-input';
      input.min = '0';
      input.max = String(trophy.target);
      input.value = String(current);
      input.setAttribute('aria-label', 'Your progress toward ' + trophy.name);
      input.addEventListener('click', (event) => event.stopPropagation());
      input.addEventListener('change', () => {
        setCount(state, trophy, Number(input.value));
        hooks.onChange();
      });
      target.append(input);
      target.append(document.createTextNode(' so far'));
      main.append(target);
    }

    row.append(box, medal, main);
    row.addEventListener('click', () => hooks.onSelect(trophy.id));
    listEl.append(row);
  }
}

function tag(className, text) {
  const el = document.createElement('span');
  el.className = 'tag ' + className;
  el.textContent = text;
  return el;
}
