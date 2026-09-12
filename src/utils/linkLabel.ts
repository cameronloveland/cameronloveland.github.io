// Turns a link's data label ("live site", "github") into the words a visitor
// should read. Games are played, everything else is opened; the verbs match
// the hero's "Open project" pill so one action keeps one name across the page.
export function linkLabel(label: string, section: string): string {
  const key = label.trim().toLowerCase();
  if (key === 'live site') return section === 'games' ? 'Play project' : 'Open project';
  if (key === 'preview') return 'Open preview';
  if (key === 'github') return 'GitHub';
  if (key === 'devpost') return 'Devpost';
  return label;
}
