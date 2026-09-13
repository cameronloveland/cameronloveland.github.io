// The words a visitor reads on a project's links. The primary action is named
// by what the visitor gets: games are played, sites and app pages are visited,
// experiments are opened. The hero pill, the cards and the timeline all call
// ctaLabel so one action keeps one name across the page.
export function ctaLabel(section: string): string {
  if (section === 'games') return 'Play now';
  if (section === 'web') return 'Open website';
  if (section === 'mobile-apps') return 'Visit website';
  return 'Open project';
}

export function linkLabel(label: string, section: string): string {
  const key = label.trim().toLowerCase();
  if (key === 'live site' || key === 'preview') return ctaLabel(section);
  if (key === 'github') return 'GitHub';
  if (key === 'devpost') return 'Devpost';
  if (key === 'google play') return 'Google Play';
  if (key === 'app store') return 'App Store';
  return label;
}
