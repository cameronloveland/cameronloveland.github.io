// Turns a link's data label ("live site", "github") into the words a visitor
// should read. Games are played, everything else is opened.
export function linkLabel(label: string, section: string): string {
  const key = label.trim().toLowerCase();
  if (key === 'live site') return section === 'games' ? 'Play project' : 'Visit site';
  if (key === 'github') return 'GitHub';
  if (key === 'devpost') return 'Devpost';
  if (key === 'preview') return 'Preview';
  return label;
}
