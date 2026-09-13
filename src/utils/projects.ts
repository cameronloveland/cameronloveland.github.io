// Shared project vocabulary and ordering, so the hero, the cards and the
// timeline never drift apart on what a section is called.
export const sectionLabels = { games: 'Game', web: 'Interactive web', 'mobile-apps': 'Mobile app', experiments: 'Experiment' } as const;
export type Section = keyof typeof sectionLabels;
export const sectionLabel = (section: string): string => sectionLabels[section as Section] ?? section;

// Sorts by a hand-picked id order; ids not in the list follow, alphabetically by title.
export function sortByOrder<T extends { id: string; data: { title: string } }>(projects: T[], order: readonly string[]): T[] {
  const rank = (id: string) => { const i = order.indexOf(id); return i === -1 ? order.length : i; };
  return [...projects].sort((a, b) => rank(a.id) - rank(b.id) || a.data.title.localeCompare(b.data.title));
}
