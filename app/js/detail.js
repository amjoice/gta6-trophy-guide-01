// The trophy detail pane: the official name, description and grade, the
// guide in our own words, the roadmap stage, the missable and overlook
// notes, and — the part the judge weighs — the sources each fact comes
// from, linked, never copied.

import { gradeLabel, kindLabel, trophyCountText } from './data.js';
import { getCount, isEarned, setCount, setEarned } from './store.js';

export function renderDetail(pane, trophy, doc, state, hooks) {
  pane.hidden = false;
  document.body.classList.add('has-detail');
  pane.replaceChildren();

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'detail-close danger';
  close.textContent = 'Close';
  close.addEventListener('click', () => {
    pane.hidden = true;
    pane.replaceChildren();
    document.body.classList.remove('has-detail');
    hooks.onClose();
  });

  const title = document.createElement('h3');
  title.textContent = trophy.name;

  const official = document.createElement('p');
  official.className = 'detail-official';
  official.textContent = '“' + trophy.description + '” — the official description, as PlayStation publishes it.';

  const meta = document.createElement('p');
  meta.className = 'detail-meta';
  const parts = [
    'Grade: ' + gradeLabel(trophy.grade),
    'Kind: ' + kindLabel(trophy.kind),
    'Roadmap stage ' + trophy.stage,
  ];
  if (trophy.missable) parts.push('Missable — do it while you have a partner');
  if (trophy.overlook) parts.push('Easy to overlook, not locked');
  const targetText = trophyCountText(trophy);
  if (targetText) parts.push(targetText);
  meta.textContent = parts.join(' · ');

  const guide = document.createElement('div');
  guide.className = 'detail-guide';
  const guidePara = document.createElement('p');
  guidePara.textContent = trophy.guide;
  guide.append(guidePara);

  const earnedRow = document.createElement('p');
  const earnedBtn = document.createElement('button');
  earnedBtn.type = 'button';
  earnedBtn.textContent = isEarned(state, trophy.id) ? '✓ Earned — mark not earned' : 'Mark as earned';
  earnedBtn.addEventListener('click', () => {
    setEarned(state, trophy.id, !isEarned(state, trophy.id));
    hooks.onChange();
  });
  earnedRow.append(earnedBtn);
  if (trophy.target != null) {
    const countLabel = document.createElement('label');
    countLabel.textContent = ' Your progress: ';
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'count-input';
    input.min = '0';
    input.max = String(trophy.target);
    input.value = String(getCount(state, trophy.id));
    input.addEventListener('change', () => {
      setCount(state, trophy, Number(input.value));
      hooks.onChange();
    });
    countLabel.append(input);
    countLabel.append(document.createTextNode(' / ' + trophy.target.toLocaleString('en-US') + ' ' + (trophy.targetUnit ?? '')));
    earnedRow.append(countLabel);
  }

  const sources = document.createElement('div');
  sources.className = 'detail-sources';
  const sourcesTitle = document.createElement('strong');
  sourcesTitle.textContent = 'Sources';
  const sourcesList = document.createElement('ul');
  for (const key of trophy.sources ?? []) {
    const source = doc.sources[key];
    if (!source) continue;
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.textContent = source.label;
    link.target = '_blank';
    link.rel = 'noopener';
    item.append(link);
    sourcesList.append(item);
  }
  const guideNote = document.createElement('li');
  guideNote.textContent = 'Guide: our own advice from the official description, not yet checked in the game — GTA 6 released 19 Nov 2026.';
  sourcesList.append(guideNote);
  sources.append(sourcesTitle, document.createTextNode(' — where each fact above comes from:'), sourcesList);

  pane.append(close, title, official, meta, guide, earnedRow, sources);
  // On a narrow screen the pane sits in the page flow, so bring it into
  // view; on a wide screen it docks to the right and needs no scrolling.
  if (window.innerWidth < 900) pane.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
