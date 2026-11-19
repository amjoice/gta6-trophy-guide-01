// Leonida Platinum — boot. Loads the trophy data, wires the toolbar, the
// four views and the detail pane, and re-renders on every change of state.
// One page, no router library: the tab is the view, and the detail pane
// opens beside the list it was picked from.

import { loadTrophyData, sortTrophies } from './data.js';
import { KIND_FILTERS, applyFilters, blankFilters } from './filters.js';
import { renderChecklist } from './checklist.js';
import { renderDetail } from './detail.js';
import { renderRoadmap } from './roadmap.js';
import { renderMissables } from './missables.js';
import { renderSources } from './sources.js';
import {
  STORAGE_KEY,
  blankState,
  earnedCount,
  exportFileName,
  loadState,
  parseImported,
  saveState,
} from './store.js';

const state = loadState();
const filters = blankFilters();
let doc = null;
let trophies = [];
let selectedId = null;
let currentView = 'tracker';

const listEl = document.getElementById('trophyList');
const listMeta = document.getElementById('listMeta');
const emptyNote = document.getElementById('emptyNote');
const detailPane = document.getElementById('detailPane');

function renderProgress() {
  const earned = earnedCount(state);
  const total = trophies.length;
  const percent = total ? Math.round((earned / total) * 100) : 0;
  document.getElementById('earnedCount').textContent = String(earned);
  document.getElementById('progressFill').style.width = percent + '%';
  const bar = document.getElementById('progressBar');
  bar.setAttribute('aria-valuenow', String(earned));
  bar.setAttribute('aria-valuemax', String(total));
  document.getElementById('progressLine').textContent = percent + '% to the platinum';
  const grades = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const trophy of trophies) {
    if (state.earned[trophy.id]) grades[trophy.grade] += 1;
  }
  const totals = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const trophy of trophies) totals[trophy.grade] += 1;
  document.getElementById('gradeCounts').textContent =
    'Platinum ' + grades.platinum + '/' + totals.platinum +
    ' · Gold ' + grades.gold + '/' + totals.gold +
    ' · Silver ' + grades.silver + '/' + totals.silver +
    ' · Bronze ' + grades.bronze + '/' + totals.bronze;
}

function renderTracker() {
  const shown = applyFilters(trophies, filters, state);
  renderChecklist(listEl, shown, state, {
    selectedId,
    onChange: renderAll,
    onSelect: (id) => selectTrophy(id),
  });
  listMeta.textContent = 'Showing ' + shown.length + ' of ' + trophies.length + ' trophies' +
    (earnedCount(state) ? ' · ' + earnedCount(state) + ' earned' : '');
  emptyNote.hidden = shown.length > 0;
}

function renderRoadmapView() {
  renderRoadmap(document.getElementById('roadmapStages'), trophies, state, {
    onSelect: (id) => selectTrophy(id),
  });
}

function renderMissablesView() {
  renderMissables(document.getElementById('missableSections'), trophies, state, {
    onSelect: (id) => selectTrophy(id),
  });
}

function selectTrophy(id) {
  selectedId = id;
  const trophy = trophies.find((entry) => entry.id === id);
  if (!trophy) return;
  showView('tracker');
  renderDetail(detailPane, trophy, doc, state, {
    onChange: renderAll,
    onClose: () => {
      selectedId = null;
      document.body.classList.remove('has-detail');
      renderTracker();
    },
  });
  renderTracker();
}

function showView(view) {
  currentView = view;
  for (const tab of document.querySelectorAll('.tab')) {
    tab.classList.toggle('active', tab.dataset.view === view);
  }
  for (const section of document.querySelectorAll('.view')) {
    section.classList.toggle('active', section.id === 'view-' + view);
  }
  if (view === 'roadmap') renderRoadmapView();
  if (view === 'missables') renderMissablesView();
  if (view === 'sources') renderSources(document.getElementById('sourcesBody'), doc);
}

function renderAll() {
  renderProgress();
  if (currentView === 'tracker') renderTracker();
  if (currentView === 'roadmap') renderRoadmapView();
  if (currentView === 'missables') renderMissablesView();
  if (selectedId != null) {
    const trophy = trophies.find((entry) => entry.id === selectedId);
    if (trophy && !detailPane.hidden) {
      renderDetail(detailPane, trophy, doc, state, {
        onChange: renderAll,
        onClose: () => {
          selectedId = null;
          document.body.classList.remove('has-detail');
          renderTracker();
        },
      });
    }
  }
}

function buildKindChips() {
  const holder = document.getElementById('kindChips');
  holder.replaceChildren();
  for (const [value, label] of KIND_FILTERS) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip' + (filters.kind === value ? ' active' : '');
    chip.textContent = label;
    chip.setAttribute('aria-pressed', String(filters.kind === value));
    chip.addEventListener('click', () => {
      filters.kind = value;
      buildKindChips();
      renderTracker();
    });
    holder.append(chip);
  }
}

function wireToolbar() {
  document.getElementById('search').addEventListener('input', (event) => {
    filters.query = event.target.value;
    renderTracker();
  });
  document.getElementById('gradeFilter').addEventListener('change', (event) => {
    filters.grade = event.target.value;
    renderTracker();
  });
  const spoilerToggle = document.getElementById('spoilerToggle');
  spoilerToggle.checked = state.spoilers === true;
  spoilerToggle.addEventListener('change', () => {
    state.spoilers = spoilerToggle.checked;
    saveState(state);
    renderAll();
  });
  document.getElementById('hideEarnedToggle').addEventListener('change', (event) => {
    filters.hideEarned = event.target.checked;
    renderTracker();
  });
  document.getElementById('exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = exportFileName();
    link.click();
    URL.revokeObjectURL(url);
  });
  document.getElementById('importFile').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const imported = parseImported(await file.text());
      Object.assign(state, imported);
      saveState(state);
      renderAll();
    } catch {
      alert('That file is not a Leonida Platinum progress export.');
    }
    event.target.value = '';
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!confirm('Clear every tick, count and the spoiler setting?')) return;
    const fresh = blankState();
    Object.assign(state, fresh);
    saveState(state);
    selectedId = null;
    detailPane.hidden = true;
    detailPane.replaceChildren();
    document.body.classList.remove('has-detail');
    renderAll();
  });
  for (const tab of document.querySelectorAll('.tab')) {
    tab.addEventListener('click', () => showView(tab.dataset.view));
  }
}

async function boot() {
  doc = await loadTrophyData();
  trophies = sortTrophies(doc.trophies);
  buildKindChips();
  wireToolbar();
  renderAll();
}

boot().catch((error) => {
  listMeta.textContent = 'The trophy list could not be loaded: ' + error.message;
});
