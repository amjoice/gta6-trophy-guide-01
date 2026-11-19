// The roadmap to the platinum: five stages in order, built from the official
// descriptions — which story chapters and missions, which collectibles and
// counts. Stage 2 carries the warning that matters: the partner trophies
// are the only ones that can pass you by.

export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Stage 1 — Play the story',
    text: 'From the opening mission, Gone Fishing, through Chapters 1 to 4 to the final mission. The chapter trophies and the six named-mission trophies pop as you go. Nothing in this stage can be missed: the official descriptions tie these to completing missions and chapters, and none of them says a mission can only be done once.',
    ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  {
    stage: 2,
    title: 'Stage 2 — Partners and strangers',
    text: 'The five named side characters — Andy, Kenton, Billy, Randy and Tyrone — each have a final-mission trophy, plus Bret’s hunt and eight stranger strands. Do the partner trophies NOW: Hot Together, Retail Therapy and Personal Best need a partner beside you, and partner time is limited to story segments. If no partner segment is active, play the story until one is.',
    ids: [22, 23, 24, 25, 26, 27, 29, 33, 34, 47],
  },
  {
    stage: 3,
    title: 'Stage 3 — Activities and challenges',
    text: 'Sample all 9 activity types, then work the counted ones: 42 Shooting Range challenges to gold, 14 Top Fun drone races, 20 different races, 50 challenges, 250 stunts, 18 meditation spots, plus fishing against Cal, one arcade game and a frame at the Kolt & Associates bowling alley.',
    ids: [15, 16, 17, 18, 19, 20, 21, 28, 32, 46],
  },
  {
    stage: 4,
    title: 'Stage 4 — Collectibles and the map',
    text: 'Three collectible card sets, 100 WAiNK locations, 100 vehicles discovered, all 52 areas of Leonida explored, all 8 garage properties bought, and 10 vehicles registered to the Scooter Bros app. Sweep area by area and log counts in the tracker as you go.',
    ids: [30, 31, 35, 42, 54, 55],
  },
  {
    stage: 5,
    title: 'Stage 5 — Crime, money, odd moments and the platinum',
    text: 'The crime trophies (vaults, armored truck, jewelry store, gang operations, Rhino tanks, Combat Focus), the money trophies ($250,000 laundered, $100,000 spent), the odd moments that are easy to walk past (the Ocean Beach cocktail, the showroom smash, the VCIA departure, the strange event), the 500-choice grind, then 100% completion — and the platinum pops with it.',
    ids: [36, 37, 38, 39, 40, 41, 43, 44, 45, 48, 49, 50, 51, 52, 53, 14, 1],
  },
];

export function renderRoadmap(container, trophies, state, hooks) {
  const byId = new Map(trophies.map((trophy) => [trophy.id, trophy]));
  container.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const section = document.createElement('div');
    section.className = 'stage';
    const heading = document.createElement('h3');
    heading.textContent = stage.title;
    const text = document.createElement('p');
    text.textContent = stage.text;
    const list = document.createElement('ul');
    list.className = 'stage-list';
    let earnedInStage = 0;
    for (const id of stage.ids) {
      const trophy = byId.get(id);
      if (!trophy) continue;
      const earned = state.earned[id] === true;
      if (earned) earnedInStage += 1;
      const item = document.createElement('li');
      const mark = document.createElement('span');
      mark.className = 'earned-mark';
      mark.textContent = earned ? '✓' : '○';
      const name = document.createElement('span');
      name.textContent = trophy.name + (trophy.missable ? ' — missable' : '');
      const count = document.createElement('span');
      count.className = 'stage-count';
      count.textContent = trophy.grade;
      item.append(mark, name, count);
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => hooks.onSelect(trophy.id));
      list.append(item);
    }
    const stageCount = document.createElement('p');
    stageCount.className = 'detail-meta';
    stageCount.textContent = earnedInStage + ' of ' + stage.ids.length + ' earned in this stage';
    section.append(heading, text, list, stageCount);
    container.append(section);
  }
}
