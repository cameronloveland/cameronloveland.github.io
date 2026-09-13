// Shared project vocabulary and ordering, so the hero, the cards and the
// timeline never drift apart on what a section is called.
export const sectionLabels = { games: 'Game', web: 'Web', 'mobile-apps': 'Mobile app', experiments: 'Experiment' } as const;
export type Section = keyof typeof sectionLabels;
export const sectionLabel = (section: string): string => sectionLabels[section as Section] ?? section;

// Sorts by a hand-picked id order; ids not in the list follow, alphabetically by title.
export function sortByOrder<T extends { id: string; data: { title: string } }>(projects: T[], order: readonly string[]): T[] {
  const rank = (id: string) => { const i = order.indexOf(id); return i === -1 ? order.length : i; };
  return [...projects].sort((a, b) => rank(a.id) - rank(b.id) || a.data.title.localeCompare(b.data.title));
}

// The hero's featured set: these five, in this order, and only those with a
// picture. The gallery can grow without the reel growing with it.
export const featuredOrder = ['antikythera', 'strength-path', 'cosmic-drift', 'stickfight', 'hud-portfolio'];
export const featured = <T extends { id: string; data: { title: string; image?: string } }>(projects: T[]): T[] =>
  sortByOrder(projects.filter(p => p.data.image && featuredOrder.includes(p.id)), featuredOrder);

// Instrument geometry the maker's mark shares with the hero: bodies sit
// evenly from bodyA to bodyB percent of the arc's width, so one step is this
// share of the width, and the mark turns its body by the same share of a turn.
export const arcBodies = { a: 9, b: 91 } as const;
export const bodyStep = (count: number): number => count > 1 ? (arcBodies.b - arcBodies.a) / (count - 1) : 0;
