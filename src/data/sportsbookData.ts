export type SportId = 'soccer' | 'tennis' | 'basketball' | 'baseball' | 'american_football' | 'esports';

export type MarketGroupId =
  | 'popular'
  | 'goalscorers'
  | 'goals'
  | 'halves'
  | 'handicaps'
  | 'corners_cards'
  // Sport-specific market groups for non-soccer sports
  | 'sets'
  | 'games'
  | 'quarters'
  | 'innings'
  | 'maps'
  | 'player_props'
  | 'totals'
  | 'all';

export interface OddOption {
  id: string;
  label: string;
  shortLabel?: string;
  odds: number;
  previousOdds?: number;
  drift?: 'up' | 'down' | null;
  suspended?: boolean;
}

export interface MatchMarket {
  id: string;
  name: string;
  group: MarketGroupId[];
  suspended?: boolean;
  columns?: 2 | 3;
  options: OddOption[];
}

export interface MatchFixture {
  id: string;
  sport: SportId;
  country: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  shortCode: string;
  isLive: boolean;
  clock?: string;
  kickoffTime?: string;
  kickoffDate?: string;
  homeScore?: number;
  awayScore?: number;
  suspended?: boolean;
  extraMarketsCount: number;
  featured?: boolean;
  mainOdds: OddOption[];
  doubleChanceOdds?: OddOption[];
  totalGoalsOdds?: OddOption[];
  bttsOdds?: OddOption[];
  markets: MatchMarket[];
}

export interface SlipSelection {
  selectionId: string;
  matchId: string;
  matchTitle: string;
  marketId: string;
  marketName: string;
  optionLabel: string;
  odds: number;
  originalOdds: number;
  oddsChanged: boolean;
  suspended: boolean;
  stake: string;
  isLive: boolean;
  scoreSummary?: string;
}

export interface PlacedBet {
  id: string;
  betRef: string;
  placedAt: string;
  PlacedDateGroup: 'Today' | 'Last 7 days' | 'Last 30 days';
  sport: SportId;
  matchId: string;
  matchTitle: string;
  selectionLabel: string;
  marketName: string;
  odds: number;
  stake: number;
  potentialReturn: number;
  status: 'Open' | 'Won' | 'Lost' | 'Cashed Out';
  isLive?: boolean;
  liveClock?: string;
  liveScore?: string;
  cashOutAmount?: number;
  cashOutDirection?: 'up' | 'down' | null;
  settledReturn?: number;
}

export interface LiveEventNotification {
  id: string;
  matchId: string;
  sport: SportId;
  competition: string;
  badge: string;
  badgeColor: 'emerald' | 'amber' | 'rose' | 'cyan';
  title: string;
  subtitle: string;
  clock: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  featuredOddLabel?: string;
  featuredOddValue?: number;
}

export const SPORT_LABELS: Record<SportId, string> = {
  soccer: 'Soccer',
  tennis: 'Tennis',
  basketball: 'Basketball',
  baseball: 'Baseball',
  american_football: 'American Football',
  esports: 'Esports',
};

// Sport-aware market tabs so non-soccer sports never show "Goalscorers" or "Corners & cards"
export const SPORT_MARKET_TABS: Record<
  SportId,
  { id: MarketGroupId; label: string }[]
> = {
  soccer: [
    { id: 'popular', label: 'Popular' },
    { id: 'goals', label: 'Goals' },
    { id: 'halves', label: 'Halves' },
    { id: 'handicaps', label: 'Handicaps' },
    { id: 'goalscorers', label: 'Goalscorers' },
    { id: 'corners_cards', label: 'Corners & cards' },
    { id: 'all', label: 'All markets' },
  ],
  tennis: [
    { id: 'popular', label: 'Popular' },
    { id: 'sets', label: 'Sets' },
    { id: 'games', label: 'Games' },
    { id: 'handicaps', label: 'Handicaps' },
    { id: 'player_props', label: 'Player Aces & Props' },
    { id: 'all', label: 'All markets' },
  ],
  basketball: [
    { id: 'popular', label: 'Popular' },
    { id: 'quarters', label: 'Quarters & Halves' },
    { id: 'handicaps', label: 'Point Spread' },
    { id: 'totals', label: 'Total Points' },
    { id: 'player_props', label: 'Player Props' },
    { id: 'all', label: 'All markets' },
  ],
  baseball: [
    { id: 'popular', label: 'Popular' },
    { id: 'innings', label: 'Innings' },
    { id: 'handicaps', label: 'Run Line' },
    { id: 'totals', label: 'Total Runs' },
    { id: 'player_props', label: 'Player Hits & HRs' },
    { id: 'all', label: 'All markets' },
  ],
  american_football: [
    { id: 'popular', label: 'Popular' },
    { id: 'player_props', label: 'TD Scorers & Props' },
    { id: 'quarters', label: 'Quarters & Halves' },
    { id: 'handicaps', label: 'Spread' },
    { id: 'totals', label: 'Total Points' },
    { id: 'all', label: 'All markets' },
  ],
  esports: [
    { id: 'popular', label: 'Popular' },
    { id: 'maps', label: 'Maps' },
    { id: 'totals', label: 'Rounds & Totals' },
    { id: 'handicaps', label: 'Map Handicap' },
    { id: 'player_props', label: 'Player Kills' },
    { id: 'all', label: 'All markets' },
  ],
};

// Helper to build all 6 required market groups for any football fixture
function buildSoccerMarkets(params: {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeShort: string;
  awayShort: string;
  odds1x2: [number, number, number];
  scorers: { name: string; team: string; anytime: number; first: number }[];
  isLive?: boolean;
  score?: [number, number];
  suspended?: boolean;
}): {
  mainOdds: OddOption[];
  doubleChanceOdds: OddOption[];
  totalGoalsOdds: OddOption[];
  bttsOdds: OddOption[];
  markets: MatchMarket[];
} {
  const { id, homeTeam, awayTeam, homeShort, awayShort, odds1x2, scorers, isLive, score, suspended } =
    params;
  const [o1, ox, o2] = odds1x2;

  const dc1x = Math.max(1.03, Number(((1 / (1 / o1 + 1 / ox)) * 0.94).toFixed(2)));
  const dc12 = Math.max(1.12, Number(((1 / (1 / o1 + 1 / o2)) * 0.94).toFixed(2)));
  const dcx2 = Math.max(1.22, Number(((1 / (1 / ox + 1 / o2)) * 0.94).toFixed(2)));

  const mainOdds: OddOption[] = [
    { id: `${id}-1x2-1`, label: homeTeam, shortLabel: homeShort, odds: o1, suspended },
    { id: `${id}-1x2-x`, label: 'Draw', shortLabel: 'Draw', odds: ox, suspended },
    { id: `${id}-1x2-2`, label: awayTeam, shortLabel: awayShort, odds: o2, suspended },
  ];

  const doubleChanceOdds: OddOption[] = [
    {
      id: `${id}-dc-1x`,
      label: `${homeTeam} or draw`,
      shortLabel: `${homeShort}/Draw`,
      odds: id === 'ars-bha' ? 1.03 : dc1x,
      suspended,
    },
    {
      id: `${id}-dc-12`,
      label: `${homeTeam} or ${awayTeam}`,
      shortLabel: `${homeShort}/${awayShort}`,
      odds: id === 'ars-bha' ? 1.18 : dc12,
      suspended,
    },
    {
      id: `${id}-dc-x2`,
      label: `Draw or ${awayTeam}`,
      shortLabel: `Draw/${awayShort}`,
      odds: id === 'ars-bha' ? 3.30 : dcx2,
      suspended,
    },
  ];

  const totalGoalsOdds: OddOption[] = [
    {
      id: `${id}-tg-o25`,
      label: 'Over 2.5',
      shortLabel: 'Over 2.5',
      odds: id === 'ars-bha' ? 2.73 : 1.85,
      suspended,
    },
    {
      id: `${id}-tg-u25`,
      label: 'Under 2.5',
      shortLabel: 'Under 2.5',
      odds: id === 'ars-bha' ? 1.44 : 1.95,
      suspended,
    },
  ];

  const bttsOdds: OddOption[] = [
    { id: `${id}-btts-y`, label: 'Yes', shortLabel: 'BTTS Yes', odds: 1.92, suspended },
    { id: `${id}-btts-n`, label: 'No', shortLabel: 'BTTS No', odds: 1.82, suspended },
  ];

  const scoreStr = isLive && score ? ` (Live ${score[0]}-${score[1]})` : '';

  const markets: MatchMarket[] = [
    {
      id: `mkt-${id}-1x2`,
      name: 'Match result',
      group: ['popular', 'all'],
      suspended,
      columns: 3,
      options: mainOdds,
    },
    {
      id: `mkt-${id}-dc`,
      name: 'Double chance',
      group: ['popular', 'all'],
      suspended,
      columns: 3,
      options: doubleChanceOdds,
    },
    {
      id: `mkt-${id}-tg`,
      name: 'Total goals',
      group: ['popular', 'goals', 'all'],
      suspended,
      columns: 2,
      options: [
        { id: `${id}-tg-o15`, label: 'Over 1.5', odds: 1.36, suspended },
        { id: `${id}-tg-u15`, label: 'Under 1.5', odds: 3.05, suspended },
        ...totalGoalsOdds,
        { id: `${id}-tg-o35`, label: 'Over 3.5', odds: 3.45, suspended },
        { id: `${id}-tg-u35`, label: 'Under 3.5', odds: 1.30, suspended },
      ],
    },
    {
      id: `mkt-${id}-btts`,
      name: 'Both teams to score',
      group: ['popular', 'goals', 'all'],
      suspended,
      columns: 2,
      options: bttsOdds,
    },
    {
      id: `mkt-${id}-next-goal`,
      name: isLive ? 'Next goal' : 'First team to score',
      group: ['popular', 'goals', 'all'],
      suspended,
      columns: 3,
      options: [
        { id: `${id}-ng-1`, label: homeTeam, shortLabel: homeShort, odds: Number((o1 * 1.15).toFixed(2)), suspended },
        { id: `${id}-ng-none`, label: 'No goal', shortLabel: 'No goal', odds: isLive ? 3.20 : 9.50, suspended },
        { id: `${id}-ng-2`, label: awayTeam, shortLabel: awayShort, odds: Number(Math.min(4.8, o2 * 0.65 + 1.1).toFixed(2)), suspended },
      ],
    },
    {
      id: `mkt-${id}-anytime-scorer`,
      name: 'Anytime goalscorer',
      group: ['popular', 'goalscorers', 'all'],
      suspended,
      columns: 3,
      options: scorers.map((s, idx) => ({
        id: `${id}-ags-${idx}`,
        label: `${s.name} (${s.team})`,
        shortLabel: s.name,
        odds: s.anytime,
        suspended,
      })),
    },
    {
      id: `mkt-${id}-first-scorer`,
      name: isLive ? 'Last goalscorer' : 'First goalscorer',
      group: ['goalscorers', 'all'],
      suspended,
      columns: 3,
      options: scorers.map((s, idx) => ({
        id: `${id}-fgs-${idx}`,
        label: `${s.name} (${s.team})`,
        shortLabel: s.name,
        odds: s.first,
        suspended,
      })),
    },
    {
      id: `mkt-${id}-ah`,
      name: `Asian handicap${scoreStr}`,
      group: ['popular', 'handicaps', 'all'],
      suspended,
      columns: 2,
      options: [
        { id: `${id}-ah-m05-1`, label: `${homeShort} -0.5`, odds: Number(Math.max(1.45, o1).toFixed(2)), suspended },
        { id: `${id}-ah-p05-2`, label: `${awayShort} +0.5`, odds: Number(Math.max(1.55, dcx2).toFixed(2)), suspended },
        { id: `${id}-ah-m15-1`, label: `${homeShort} -1.5`, odds: Number((o1 * 1.62).toFixed(2)), suspended },
        { id: `${id}-ah-p15-2`, label: `${awayShort} +1.5`, odds: 1.52, suspended },
      ],
    },
    {
      id: `mkt-${id}-eh`,
      name: '3-Way handicap (-1)',
      group: ['handicaps', 'all'],
      suspended,
      columns: 3,
      options: [
        { id: `${id}-eh-1`, label: `${homeShort} (-1)`, odds: Number((o1 * 1.65).toFixed(2)), suspended },
        { id: `${id}-eh-x`, label: `Tie (${homeShort} -1)`, odds: 3.40, suspended },
        { id: `${id}-eh-2`, label: `${awayShort} (+1)`, odds: dcx2, suspended },
      ],
    },
    {
      id: `mkt-${id}-half-res`,
      name: isLive ? '2nd half result' : '1st half result',
      group: ['popular', 'halves', 'all'],
      suspended,
      columns: 3,
      options: [
        { id: `${id}-hf-1`, label: homeTeam, shortLabel: homeShort, odds: Number((o1 * 1.35).toFixed(2)), suspended },
        { id: `${id}-hf-x`, label: 'Draw', shortLabel: 'Draw', odds: 2.25, suspended },
        { id: `${id}-hf-2`, label: awayTeam, shortLabel: awayShort, odds: Number(Math.min(5.5, o2 * 0.75 + 1.2).toFixed(2)), suspended },
      ],
    },
    {
      id: `mkt-${id}-half-goals`,
      name: isLive ? '2nd half total goals' : '1st half total goals',
      group: ['halves', 'goals', 'all'],
      suspended,
      columns: 2,
      options: [
        { id: `${id}-hfg-o05`, label: 'Over 0.5', odds: 1.38, suspended },
        { id: `${id}-hfg-u05`, label: 'Under 0.5', odds: 2.95, suspended },
        { id: `${id}-hfg-o15`, label: 'Over 1.5', odds: 2.75, suspended },
        { id: `${id}-hfg-u15`, label: 'Under 1.5', odds: 1.42, suspended },
      ],
    },
    {
      id: `mkt-${id}-corners`,
      name: 'Total corners',
      group: ['popular', 'corners_cards', 'all'],
      suspended,
      columns: 2,
      options: [
        { id: `${id}-cor-o85`, label: 'Over 8.5 Corners', odds: 1.55, suspended },
        { id: `${id}-cor-u85`, label: 'Under 8.5 Corners', odds: 2.35, suspended },
        { id: `${id}-cor-o95`, label: 'Over 9.5 Corners', odds: 1.88, suspended },
        { id: `${id}-cor-u95`, label: 'Under 9.5 Corners', odds: 1.88, suspended },
        { id: `${id}-cor-o105`, label: 'Over 10.5 Corners', odds: 2.45, suspended },
        { id: `${id}-cor-u105`, label: 'Under 10.5 Corners', odds: 1.52, suspended },
      ],
    },
    {
      id: `mkt-${id}-cards`,
      name: 'Total bookings (Yellow/Red cards)',
      group: ['popular', 'corners_cards', 'all'],
      suspended,
      columns: 2,
      options: [
        { id: `${id}-crd-o35`, label: 'Over 3.5 Cards', odds: 1.68, suspended },
        { id: `${id}-crd-u35`, label: 'Under 3.5 Cards', odds: 2.12, suspended },
        { id: `${id}-crd-o45`, label: 'Over 4.5 Cards', odds: 2.50, suspended },
        { id: `${id}-crd-u45`, label: 'Under 4.5 Cards', odds: 1.50, suspended },
      ],
    },
  ];

  return { mainOdds, doubleChanceOdds, totalGoalsOdds, bttsOdds, markets };
}

// Helper to build complete Tennis markets (Sets, Games, Handicaps, Player Props)
function buildTennisMarkets(params: {
  id: string;
  p1: string;
  p2: string;
  p1Short: string;
  p2Short: string;
  o1: number;
  o2: number;
  currentSet: string;
}): { mainOdds: OddOption[]; markets: MatchMarket[] } {
  const { id, p1, p2, p1Short, p2Short, o1, o2, currentSet } = params;
  const mainOdds: OddOption[] = [
    { id: `${id}-win-1`, label: p1, shortLabel: p1Short, odds: o1 },
    { id: `${id}-win-2`, label: p2, shortLabel: p2Short, odds: o2 },
  ];

  const markets: MatchMarket[] = [
    {
      id: `mkt-${id}-win`,
      name: 'Match winner',
      group: ['popular', 'all'],
      columns: 2,
      options: mainOdds,
    },
    {
      id: `mkt-${id}-set-win`,
      name: `${currentSet} winner`,
      group: ['popular', 'sets', 'all'],
      columns: 2,
      options: [
        { id: `${id}-set-1`, label: p1, shortLabel: p1Short, odds: Number((o1 * 1.05).toFixed(2)) },
        { id: `${id}-set-2`, label: p2, shortLabel: p2Short, odds: Number((o2 * 0.96).toFixed(2)) },
      ],
    },
    {
      id: `mkt-${id}-set-betting`,
      name: 'Set betting (Best of 3)',
      group: ['popular', 'sets', 'all'],
      columns: 2,
      options: [
        { id: `${id}-sb-20`, label: `${p1Short} 2-0`, odds: Number((o1 * 1.45).toFixed(2)) },
        { id: `${id}-sb-02`, label: `${p2Short} 2-0`, odds: Number((o2 * 1.65).toFixed(2)) },
        { id: `${id}-sb-21`, label: `${p1Short} 2-1`, odds: 3.40 },
        { id: `${id}-sb-12`, label: `${p2Short} 2-1`, odds: 3.90 },
      ],
    },
    {
      id: `mkt-${id}-tot-games`,
      name: 'Total games in match',
      group: ['popular', 'games', 'all'],
      columns: 2,
      options: [
        { id: `${id}-tg-o215`, label: 'Over 21.5 Games', odds: 1.82 },
        { id: `${id}-tg-u215`, label: 'Under 21.5 Games', odds: 1.98 },
        { id: `${id}-tg-o235`, label: 'Over 23.5 Games', odds: 2.25 },
        { id: `${id}-tg-u235`, label: 'Under 23.5 Games', odds: 1.62 },
      ],
    },
    {
      id: `mkt-${id}-game-hcp`,
      name: 'Game handicap',
      group: ['popular', 'handicaps', 'all'],
      columns: 2,
      options: [
        { id: `${id}-gh-1`, label: `${p1Short} -2.5 Games`, odds: 1.90 },
        { id: `${id}-gh-2`, label: `${p2Short} +2.5 Games`, odds: 1.90 },
        { id: `${id}-gh-3`, label: `${p1Short} -3.5 Games`, odds: 2.40 },
        { id: `${id}-gh-4`, label: `${p2Short} +3.5 Games`, odds: 1.55 },
      ],
    },
    {
      id: `mkt-${id}-aces`,
      name: 'Player total aces',
      group: ['player_props', 'all'],
      columns: 2,
      options: [
        { id: `${id}-ace-1`, label: `${p1Short} Over 8.5 Aces`, odds: 1.85 },
        { id: `${id}-ace-2`, label: `${p1Short} Under 8.5 Aces`, odds: 1.95 },
        { id: `${id}-ace-3`, label: `${p2Short} Over 9.5 Aces`, odds: 1.88 },
        { id: `${id}-ace-4`, label: `${p2Short} Under 9.5 Aces`, odds: 1.92 },
      ],
    },
  ];

  return { mainOdds, markets };
}

export const INITIAL_MATCHES: MatchFixture[] = [
  {
    id: 'ars-bha',
    sport: 'soccer',
    country: 'England',
    competition: 'Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Brighton & Hove Albion',
    shortCode: 'ARS - BHA',
    isLive: true,
    clock: "52'",
    homeScore: 1,
    awayScore: 0,
    suspended: false,
    extraMarketsCount: 115,
    featured: true,
    ...buildSoccerMarkets({
      id: 'ars-bha',
      homeTeam: 'Arsenal',
      awayTeam: 'Brighton & Hove Albion',
      homeShort: 'Arsenal',
      awayShort: 'Brighton',
      odds1x2: [1.30, 4.60, 11.00],
      isLive: true,
      score: [1, 0],
      scorers: [
        { name: 'Bukayo Saka', team: 'ARS', anytime: 2.60, first: 4.20 },
        { name: 'Kai Havertz', team: 'ARS', anytime: 2.85, first: 4.60 },
        { name: 'Gabriel Martinelli', team: 'ARS', anytime: 3.40, first: 5.50 },
        { name: 'Martin Ødegaard', team: 'ARS', anytime: 4.10, first: 6.80 },
        { name: 'Danny Welbeck', team: 'BHA', anytime: 4.80, first: 8.00 },
        { name: 'Kaoru Mitoma', team: 'BHA', anytime: 5.50, first: 9.20 },
      ],
    }),
  },
  {
    id: 'avl-ful',
    sport: 'soccer',
    country: 'England',
    competition: 'Premier League',
    homeTeam: 'Aston Villa',
    awayTeam: 'Fulham',
    shortCode: 'AVL - FUL',
    isLive: true,
    clock: 'HT',
    homeScore: 0,
    awayScore: 0,
    suspended: false,
    extraMarketsCount: 64,
    featured: false,
    ...buildSoccerMarkets({
      id: 'avl-ful',
      homeTeam: 'Aston Villa',
      awayTeam: 'Fulham',
      homeShort: 'Aston Villa',
      awayShort: 'Fulham',
      odds1x2: [2.25, 2.90, 3.60],
      isLive: true,
      score: [0, 0],
      scorers: [
        { name: 'Ollie Watkins', team: 'AVL', anytime: 2.35, first: 4.50 },
        { name: 'Morgan Rogers', team: 'AVL', anytime: 3.60, first: 6.50 },
        { name: 'Leon Bailey', team: 'AVL', anytime: 3.90, first: 7.20 },
        { name: 'Raúl Jiménez', team: 'FUL', anytime: 3.25, first: 6.00 },
        { name: 'Alex Iwobi', team: 'FUL', anytime: 4.60, first: 8.50 },
        { name: 'Emile Smith Rowe', team: 'FUL', anytime: 4.90, first: 9.00 },
      ],
    }),
  },
  {
    id: 'new-eve',
    sport: 'soccer',
    country: 'England',
    competition: 'Premier League',
    homeTeam: 'Newcastle United',
    awayTeam: 'Everton',
    shortCode: 'NEW - EVE',
    isLive: true,
    clock: "58'",
    homeScore: 2,
    awayScore: 1,
    suspended: true,
    extraMarketsCount: 52,
    featured: false,
    ...buildSoccerMarkets({
      id: 'new-eve',
      homeTeam: 'Newcastle United',
      awayTeam: 'Everton',
      homeShort: 'Newcastle',
      awayShort: 'Everton',
      odds1x2: [1.42, 4.50, 8.50],
      isLive: true,
      score: [2, 1],
      suspended: true,
      scorers: [
        { name: 'Alexander Isak', team: 'NEW', anytime: 2.10, first: 3.90 },
        { name: 'Anthony Gordon', team: 'NEW', anytime: 2.95, first: 5.40 },
        { name: 'Bruno Guimarães', team: 'NEW', anytime: 4.40, first: 8.20 },
        { name: 'Dominic Calvert-Lewin', team: 'EVE', anytime: 3.80, first: 7.00 },
        { name: 'Iliman Ndiaye', team: 'EVE', anytime: 4.50, first: 8.50 },
        { name: 'Dwight McNeil', team: 'EVE', anytime: 5.20, first: 9.80 },
      ],
    }),
  },
  {
    id: 'liv-mun',
    sport: 'soccer',
    country: 'England',
    competition: 'Premier League',
    homeTeam: 'Liverpool',
    awayTeam: 'Manchester United',
    shortCode: 'LIV - MUN',
    isLive: false,
    kickoffTime: '16:30',
    kickoffDate: 'Sun, Oct 18',
    suspended: false,
    extraMarketsCount: 94,
    featured: true,
    ...buildSoccerMarkets({
      id: 'liv-mun',
      homeTeam: 'Liverpool',
      awayTeam: 'Manchester United',
      homeShort: 'Liverpool',
      awayShort: 'Man Utd',
      odds1x2: [1.65, 4.00, 4.33],
      scorers: [
        { name: 'Mohamed Salah', team: 'LIV', anytime: 1.95, first: 3.60 },
        { name: 'Luis Díaz', team: 'LIV', anytime: 2.65, first: 5.10 },
        { name: 'Diogo Jota', team: 'LIV', anytime: 2.50, first: 4.80 },
        { name: 'Bruno Fernandes', team: 'MUN', anytime: 3.60, first: 7.20 },
        { name: 'Marcus Rashford', team: 'MUN', anytime: 3.85, first: 7.50 },
        { name: 'Rasmus Højlund', team: 'MUN', anytime: 3.50, first: 6.90 },
      ],
    }),
  },
  {
    id: 'mci-tot',
    sport: 'soccer',
    country: 'England',
    competition: 'Premier League',
    homeTeam: 'Manchester City',
    awayTeam: 'Tottenham Hotspur',
    shortCode: 'MCI - TOT',
    isLive: false,
    kickoffTime: '14:00',
    kickoffDate: 'Sun, Oct 18',
    suspended: false,
    extraMarketsCount: 98,
    featured: true,
    ...buildSoccerMarkets({
      id: 'mci-tot',
      homeTeam: 'Manchester City',
      awayTeam: 'Tottenham Hotspur',
      homeShort: 'Man City',
      awayShort: 'Spurs',
      odds1x2: [1.50, 4.50, 5.25],
      scorers: [
        { name: 'Erling Haaland', team: 'MCI', anytime: 1.58, first: 2.90 },
        { name: 'Phil Foden', team: 'MCI', anytime: 2.60, first: 5.20 },
        { name: 'Kevin De Bruyne', team: 'MCI', anytime: 3.20, first: 6.40 },
        { name: 'Son Heung-min', team: 'TOT', anytime: 3.10, first: 6.20 },
        { name: 'Dominic Solanke', team: 'TOT', anytime: 3.40, first: 6.80 },
        { name: 'James Maddison', team: 'TOT', anytime: 4.50, first: 8.90 },
      ],
    }),
  },
  {
    id: 'ars-int',
    sport: 'soccer',
    country: 'Europe',
    competition: 'Champions League',
    homeTeam: 'Arsenal',
    awayTeam: 'Inter',
    shortCode: 'ARS - INT',
    isLive: false,
    kickoffTime: '20:00',
    kickoffDate: 'Tue, Oct 20',
    suspended: false,
    extraMarketsCount: 88,
    featured: false,
    ...buildSoccerMarkets({
      id: 'ars-int',
      homeTeam: 'Arsenal',
      awayTeam: 'Inter',
      homeShort: 'Arsenal',
      awayShort: 'Inter',
      odds1x2: [1.95, 3.50, 4.00],
      scorers: [
        { name: 'Bukayo Saka', team: 'ARS', anytime: 2.50, first: 4.80 },
        { name: 'Kai Havertz', team: 'ARS', anytime: 2.75, first: 5.20 },
        { name: 'Lautaro Martínez', team: 'INT', anytime: 2.95, first: 5.80 },
        { name: 'Marcus Thuram', team: 'INT', anytime: 3.30, first: 6.40 },
        { name: 'Hakan Çalhanoğlu', team: 'INT', anytime: 4.50, first: 8.80 },
        { name: 'Declan Rice', team: 'ARS', anytime: 5.80, first: 11.00 },
      ],
    }),
  },
  {
    id: 'rma-bay',
    sport: 'soccer',
    country: 'Europe',
    competition: 'Champions League',
    homeTeam: 'Real Madrid',
    awayTeam: 'Bayern Munich',
    shortCode: 'RMA - BAY',
    isLive: false,
    kickoffTime: '20:00',
    kickoffDate: 'Tue, Oct 20',
    suspended: false,
    extraMarketsCount: 104,
    featured: true,
    ...buildSoccerMarkets({
      id: 'rma-bay',
      homeTeam: 'Real Madrid',
      awayTeam: 'Bayern Munich',
      homeShort: 'Real Madrid',
      awayShort: 'Bayern',
      odds1x2: [2.20, 3.70, 2.90],
      scorers: [
        { name: 'Kylian Mbappé', team: 'RMA', anytime: 1.95, first: 3.75 },
        { name: 'Vinícius Júnior', team: 'RMA', anytime: 2.30, first: 4.40 },
        { name: 'Jude Bellingham', team: 'RMA', anytime: 3.10, first: 6.00 },
        { name: 'Harry Kane', team: 'BAY', anytime: 2.05, first: 3.90 },
        { name: 'Jamal Musiala', team: 'BAY', anytime: 3.25, first: 6.30 },
        { name: 'Michael Olise', team: 'BAY', anytime: 3.70, first: 7.10 },
      ],
    }),
  },
  {
    id: 'bar-psg',
    sport: 'soccer',
    country: 'Europe',
    competition: 'Champions League',
    homeTeam: 'Barcelona',
    awayTeam: 'Paris Saint-Germain',
    shortCode: 'BAR - PSG',
    isLive: false,
    kickoffTime: '20:00',
    kickoffDate: 'Wed, Oct 21',
    suspended: false,
    extraMarketsCount: 92,
    featured: false,
    ...buildSoccerMarkets({
      id: 'bar-psg',
      homeTeam: 'Barcelona',
      awayTeam: 'Paris Saint-Germain',
      homeShort: 'Barcelona',
      awayShort: 'PSG',
      odds1x2: [2.05, 3.80, 3.30],
      scorers: [
        { name: 'Robert Lewandowski', team: 'BAR', anytime: 1.90, first: 3.60 },
        { name: 'Lamine Yamal', team: 'BAR', anytime: 2.85, first: 5.50 },
        { name: 'Raphinha', team: 'BAR', anytime: 2.70, first: 5.20 },
        { name: 'Ousmane Dembélé', team: 'PSG', anytime: 3.15, first: 6.10 },
        { name: 'Bradley Barcola', team: 'PSG', anytime: 3.25, first: 6.40 },
        { name: 'Gonçalo Ramos', team: 'PSG', anytime: 3.10, first: 6.00 },
      ],
    }),
  },
  {
    id: 'atm-sev',
    sport: 'soccer',
    country: 'Spain',
    competition: 'LaLiga',
    homeTeam: 'Atlético Madrid',
    awayTeam: 'Sevilla',
    shortCode: 'ATM - SEV',
    isLive: true,
    clock: "37'",
    homeScore: 1,
    awayScore: 0,
    suspended: true,
    extraMarketsCount: 58,
    featured: false,
    ...buildSoccerMarkets({
      id: 'atm-sev',
      homeTeam: 'Atlético Madrid',
      awayTeam: 'Sevilla',
      homeShort: 'Atlético',
      awayShort: 'Sevilla',
      odds1x2: [1.36, 4.40, 9.00],
      isLive: true,
      score: [1, 0],
      suspended: true,
      scorers: [
        { name: 'Antoine Griezmann', team: 'ATM', anytime: 2.40, first: 4.50 },
        { name: 'Julián Álvarez', team: 'ATM', anytime: 2.55, first: 4.80 },
        { name: 'Alexander Sørloth', team: 'ATM', anytime: 2.60, first: 4.90 },
        { name: 'Dodi Lukébakio', team: 'SEV', anytime: 4.50, first: 8.80 },
        { name: 'Isaac Romero', team: 'SEV', anytime: 4.80, first: 9.20 },
        { name: 'Saúl Ñíguez', team: 'SEV', anytime: 6.50, first: 12.00 },
      ],
    }),
  },
  {
    id: 'rma-vil',
    sport: 'soccer',
    country: 'Spain',
    competition: 'LaLiga',
    homeTeam: 'Real Madrid',
    awayTeam: 'Villarreal',
    shortCode: 'RMA - VIL',
    isLive: false,
    kickoffTime: '21:00',
    kickoffDate: 'Sat, Oct 17',
    suspended: false,
    extraMarketsCount: 82,
    featured: false,
    ...buildSoccerMarkets({
      id: 'rma-vil',
      homeTeam: 'Real Madrid',
      awayTeam: 'Villarreal',
      homeShort: 'Real Madrid',
      awayShort: 'Villarreal',
      odds1x2: [1.45, 4.75, 6.50],
      scorers: [
        { name: 'Kylian Mbappé', team: 'RMA', anytime: 1.72, first: 3.20 },
        { name: 'Vinícius Júnior', team: 'RMA', anytime: 2.05, first: 3.90 },
        { name: 'Rodrygo', team: 'RMA', anytime: 2.55, first: 4.80 },
        { name: 'Ayoze Pérez', team: 'VIL', anytime: 3.80, first: 7.40 },
        { name: 'Gerard Moreno', team: 'VIL', anytime: 3.95, first: 7.80 },
        { name: 'Álex Baena', team: 'VIL', anytime: 5.20, first: 10.00 },
      ],
    }),
  },
  {
    id: 'juv-rom',
    sport: 'soccer',
    country: 'Italy',
    competition: 'Serie A',
    homeTeam: 'Juventus',
    awayTeam: 'Roma',
    shortCode: 'JUV - ROM',
    isLive: true,
    clock: "49'",
    homeScore: 1,
    awayScore: 1,
    suspended: false,
    extraMarketsCount: 74,
    featured: false,
    ...buildSoccerMarkets({
      id: 'juv-rom',
      homeTeam: 'Juventus',
      awayTeam: 'Roma',
      homeShort: 'Juventus',
      awayShort: 'Roma',
      odds1x2: [2.40, 3.10, 3.20],
      isLive: true,
      score: [1, 1],
      scorers: [
        { name: 'Dušan Vlahović', team: 'JUV', anytime: 2.50, first: 4.70 },
        { name: 'Kenan Yıldız', team: 'JUV', anytime: 3.60, first: 6.80 },
        { name: 'Teun Koopmeiners', team: 'JUV', anytime: 4.10, first: 7.90 },
        { name: 'Artem Dovbyk', team: 'ROM', anytime: 2.95, first: 5.60 },
        { name: 'Paulo Dybala', team: 'ROM', anytime: 3.40, first: 6.50 },
        { name: 'Lorenzo Pellegrini', team: 'ROM', anytime: 4.80, first: 9.20 },
      ],
    }),
  },
  {
    id: 'nap-mil',
    sport: 'soccer',
    country: 'Italy',
    competition: 'Serie A',
    homeTeam: 'Napoli',
    awayTeam: 'AC Milan',
    shortCode: 'NAP - MIL',
    isLive: false,
    kickoffTime: '17:00',
    kickoffDate: 'Sun, Oct 18',
    suspended: false,
    extraMarketsCount: 86,
    featured: false,
    ...buildSoccerMarkets({
      id: 'nap-mil',
      homeTeam: 'Napoli',
      awayTeam: 'AC Milan',
      homeShort: 'Napoli',
      awayShort: 'Milan',
      odds1x2: [2.15, 3.40, 3.35],
      scorers: [
        { name: 'Romelu Lukaku', team: 'NAP', anytime: 2.40, first: 4.60 },
        { name: 'Khvicha Kvaratskhelia', team: 'NAP', anytime: 2.75, first: 5.30 },
        { name: 'Scott McTominay', team: 'NAP', anytime: 4.30, first: 8.40 },
        { name: 'Rafael Leão', team: 'MIL', anytime: 3.10, first: 6.00 },
        { name: 'Christian Pulisic', team: 'MIL', anytime: 3.25, first: 6.30 },
        { name: 'Álvaro Morata', team: 'MIL', anytime: 2.95, first: 5.80 },
      ],
    }),
  },
  {
    id: 'b04-bvb',
    sport: 'soccer',
    country: 'Germany',
    competition: 'Bundesliga',
    homeTeam: 'Bayer Leverkusen',
    awayTeam: 'Borussia Dortmund',
    shortCode: 'B04 - BVB',
    isLive: true,
    clock: "64'",
    homeScore: 2,
    awayScore: 1,
    suspended: false,
    extraMarketsCount: 79,
    featured: false,
    ...buildSoccerMarkets({
      id: 'b04-bvb',
      homeTeam: 'Bayer Leverkusen',
      awayTeam: 'Borussia Dortmund',
      homeShort: 'Leverkusen',
      awayShort: 'Dortmund',
      odds1x2: [1.55, 4.20, 5.80],
      isLive: true,
      score: [2, 1],
      scorers: [
        { name: 'Florian Wirtz', team: 'B04', anytime: 2.65, first: 5.10 },
        { name: 'Victor Boniface', team: 'B04', anytime: 2.20, first: 4.10 },
        { name: 'Alejandro Grimaldo', team: 'B04', anytime: 4.10, first: 7.90 },
        { name: 'Serhou Guirassy', team: 'BVB', anytime: 2.80, first: 5.40 },
        { name: 'Karim Adeyemi', team: 'BVB', anytime: 3.90, first: 7.50 },
        { name: 'Julian Brandt', team: 'BVB', anytime: 4.60, first: 8.80 },
      ],
    }),
  },
  {
    id: 'bay-rbl',
    sport: 'soccer',
    country: 'Germany',
    competition: 'Bundesliga',
    homeTeam: 'Bayern Munich',
    awayTeam: 'RB Leipzig',
    shortCode: 'BAY - RBL',
    isLive: false,
    kickoffTime: '18:30',
    kickoffDate: 'Sat, Oct 17',
    suspended: false,
    extraMarketsCount: 84,
    featured: false,
    ...buildSoccerMarkets({
      id: 'bay-rbl',
      homeTeam: 'Bayern Munich',
      awayTeam: 'RB Leipzig',
      homeShort: 'Bayern',
      awayShort: 'Leipzig',
      odds1x2: [1.60, 4.30, 4.90],
      scorers: [
        { name: 'Harry Kane', team: 'BAY', anytime: 1.68, first: 3.10 },
        { name: 'Jamal Musiala', team: 'BAY', anytime: 2.75, first: 5.30 },
        { name: 'Serge Gnabry', team: 'BAY', anytime: 2.95, first: 5.80 },
        { name: 'Loïs Openda', team: 'RBL', anytime: 3.10, first: 6.10 },
        { name: 'Benjamin Šeško', team: 'RBL', anytime: 3.40, first: 6.60 },
        { name: 'Xavi Simons', team: 'RBL', anytime: 3.95, first: 7.60 },
      ],
    }),
  },
  // Tennis Live Matches (3) with full Tennis Market Groups
  {
    id: 'alc-sin',
    sport: 'tennis',
    country: 'ATP Tour',
    competition: 'ATP Masters 1000',
    homeTeam: 'Carlos Alcaraz',
    awayTeam: 'Jannik Sinner',
    shortCode: 'ALC - SIN',
    isLive: true,
    clock: 'Set 2',
    homeScore: 1,
    awayScore: 0,
    suspended: false,
    extraMarketsCount: 24,
    featured: false,
    ...buildTennisMarkets({
      id: 'alc-sin',
      p1: 'Carlos Alcaraz',
      p2: 'Jannik Sinner',
      p1Short: 'Alcaraz',
      p2Short: 'Sinner',
      o1: 1.68,
      o2: 2.18,
      currentSet: 'Set 2',
    }),
  },
  {
    id: 'djo-med',
    sport: 'tennis',
    country: 'ATP Tour',
    competition: 'ATP Masters 1000',
    homeTeam: 'Novak Djokovic',
    awayTeam: 'Daniil Medvedev',
    shortCode: 'DJO - MED',
    isLive: true,
    clock: 'Set 3',
    homeScore: 1,
    awayScore: 1,
    suspended: false,
    extraMarketsCount: 19,
    featured: false,
    ...buildTennisMarkets({
      id: 'djo-med',
      p1: 'Novak Djokovic',
      p2: 'Daniil Medvedev',
      p1Short: 'Djokovic',
      p2Short: 'Medvedev',
      o1: 1.85,
      o2: 1.95,
      currentSet: 'Set 3',
    }),
  },
  {
    id: 'sab-swi',
    sport: 'tennis',
    country: 'WTA Tour',
    competition: 'WTA Finals',
    homeTeam: 'Aryna Sabalenka',
    awayTeam: 'Iga Swiatek',
    shortCode: 'SAB - SWI',
    isLive: true,
    clock: 'Set 1',
    homeScore: 0,
    awayScore: 0,
    suspended: false,
    extraMarketsCount: 16,
    featured: false,
    ...buildTennisMarkets({
      id: 'sab-swi',
      p1: 'Aryna Sabalenka',
      p2: 'Iga Swiatek',
      p1Short: 'Sabalenka',
      p2Short: 'Swiatek',
      o1: 1.90,
      o2: 1.90,
      currentSet: 'Set 1',
    }),
  },
  // Basketball Live Match (NBA) with Basketball Market Groups
  {
    id: 'lal-bos',
    sport: 'basketball',
    country: 'USA',
    competition: 'NBA',
    homeTeam: 'LA Lakers',
    awayTeam: 'Boston Celtics',
    shortCode: 'LAL - BOS',
    isLive: true,
    clock: 'Q3 04:12',
    homeScore: 84,
    awayScore: 89,
    suspended: false,
    extraMarketsCount: 28,
    featured: false,
    mainOdds: [
      { id: 'lal-bos-1', label: 'LA Lakers', shortLabel: 'Lakers', odds: 2.35 },
      { id: 'lal-bos-2', label: 'Boston Celtics', shortLabel: 'Celtics', odds: 1.60 },
    ],
    markets: [
      {
        id: 'mkt-lal-bos-ml',
        name: 'Moneyline (Incl. OT)',
        group: ['popular', 'all'],
        columns: 2,
        options: [
          { id: 'lal-bos-1', label: 'LA Lakers', odds: 2.35 },
          { id: 'lal-bos-2', label: 'Boston Celtics', odds: 1.60 },
        ],
      },
      {
        id: 'mkt-lal-bos-sp',
        name: 'Point spread',
        group: ['popular', 'handicaps', 'all'],
        columns: 2,
        options: [
          { id: 'lal-bos-sp-1', label: 'LA Lakers +4.5', odds: 1.91 },
          { id: 'lal-bos-sp-2', label: 'Boston Celtics -4.5', odds: 1.91 },
          { id: 'lal-bos-sp-3', label: 'LA Lakers +6.5', odds: 1.65 },
          { id: 'lal-bos-sp-4', label: 'Boston Celtics -6.5', odds: 2.20 },
        ],
      },
      {
        id: 'mkt-lal-bos-tot',
        name: 'Total points (Over/Under)',
        group: ['popular', 'totals', 'all'],
        columns: 2,
        options: [
          { id: 'lal-bos-tot-o', label: 'Over 228.5 Points', odds: 1.88 },
          { id: 'lal-bos-tot-u', label: 'Under 228.5 Points', odds: 1.92 },
          { id: 'lal-bos-tot-o2', label: 'Over 232.5 Points', odds: 2.15 },
          { id: 'lal-bos-tot-u2', label: 'Under 232.5 Points', odds: 1.70 },
        ],
      },
      {
        id: 'mkt-lal-bos-q3',
        name: '3rd quarter winner',
        group: ['quarters', 'all'],
        columns: 2,
        options: [
          { id: 'lal-bos-q3-1', label: 'LA Lakers', odds: 2.10 },
          { id: 'lal-bos-q3-2', label: 'Boston Celtics', odds: 1.72 },
        ],
      },
      {
        id: 'mkt-lal-bos-pts',
        name: 'Player points (Over/Under)',
        group: ['popular', 'player_props', 'all'],
        columns: 2,
        options: [
          { id: 'lal-bos-pp-lbj', label: 'LeBron James Over 26.5 Pts', odds: 1.85 },
          { id: 'lal-bos-pp-jt', label: 'Jayson Tatum Over 28.5 Pts', odds: 1.88 },
          { id: 'lal-bos-pp-ad', label: 'Anthony Davis Over 24.5 Pts', odds: 1.90 },
          { id: 'lal-bos-pp-jb', label: 'Jaylen Brown Over 23.5 Pts', odds: 1.86 },
        ],
      },
    ],
  },
  // Baseball Live Match (MLB) with Baseball Market Groups
  {
    id: 'nyy-lad',
    sport: 'baseball',
    country: 'USA',
    competition: 'MLB',
    homeTeam: 'NY Yankees',
    awayTeam: 'LA Dodgers',
    shortCode: 'NYY - LAD',
    isLive: true,
    clock: 'Top 7th',
    homeScore: 3,
    awayScore: 2,
    suspended: false,
    extraMarketsCount: 15,
    featured: false,
    mainOdds: [
      { id: 'nyy-lad-1', label: 'NY Yankees', shortLabel: 'Yankees', odds: 1.52 },
      { id: 'nyy-lad-2', label: 'LA Dodgers', shortLabel: 'Dodgers', odds: 2.55 },
    ],
    markets: [
      {
        id: 'mkt-nyy-lad-ml',
        name: 'Moneyline',
        group: ['popular', 'all'],
        columns: 2,
        options: [
          { id: 'nyy-lad-1', label: 'NY Yankees', odds: 1.52 },
          { id: 'nyy-lad-2', label: 'LA Dodgers', odds: 2.55 },
        ],
      },
      {
        id: 'mkt-nyy-lad-rl',
        name: 'Run line',
        group: ['popular', 'handicaps', 'all'],
        columns: 2,
        options: [
          { id: 'nyy-lad-rl-1', label: 'NY Yankees -1.5 Runs', odds: 2.25 },
          { id: 'nyy-lad-rl-2', label: 'LA Dodgers +1.5 Runs', odds: 1.65 },
        ],
      },
      {
        id: 'mkt-nyy-lad-tot',
        name: 'Total runs',
        group: ['popular', 'totals', 'all'],
        columns: 2,
        options: [
          { id: 'nyy-lad-tr-o', label: 'Over 7.5 Runs', odds: 1.85 },
          { id: 'nyy-lad-tr-u', label: 'Under 7.5 Runs', odds: 1.95 },
        ],
      },
      {
        id: 'mkt-nyy-lad-inn',
        name: '7th inning result',
        group: ['innings', 'all'],
        columns: 3,
        options: [
          { id: 'nyy-lad-i7-1', label: 'NY Yankees', odds: 3.40 },
          { id: 'nyy-lad-i7-x', label: 'Tie (0-0)', odds: 1.62 },
          { id: 'nyy-lad-i7-2', label: 'LA Dodgers', odds: 3.80 },
        ],
      },
      {
        id: 'mkt-nyy-lad-props',
        name: 'Player home runs & hits',
        group: ['player_props', 'all'],
        columns: 2,
        options: [
          { id: 'nyy-lad-hr-judge', label: 'Aaron Judge 2+ Total Bases', odds: 1.95 },
          { id: 'nyy-lad-hr-ohtani', label: 'Shohei Ohtani 2+ Total Bases', odds: 1.88 },
          { id: 'nyy-lad-hr-soto', label: 'Juan Soto Over 1.5 Hits+Walks', odds: 1.78 },
          { id: 'nyy-lad-hr-betts', label: 'Mookie Betts Over 1.5 Hits+Walks', odds: 1.82 },
        ],
      },
    ],
  },
  // American Football Live Match (NFL)
  {
    id: 'kc-bal',
    sport: 'american_football',
    country: 'USA',
    competition: 'NFL',
    homeTeam: 'Kansas City Chiefs',
    awayTeam: 'Baltimore Ravens',
    shortCode: 'KC - BAL',
    isLive: true,
    clock: 'Q2 08:45',
    homeScore: 14,
    awayScore: 10,
    suspended: false,
    extraMarketsCount: 22,
    featured: false,
    mainOdds: [
      { id: 'kc-bal-1', label: 'Kansas City Chiefs', shortLabel: 'Chiefs', odds: 1.62 },
      { id: 'kc-bal-2', label: 'Baltimore Ravens', shortLabel: 'Ravens', odds: 2.30 },
    ],
    markets: [
      {
        id: 'mkt-kc-bal-ml',
        name: 'Moneyline',
        group: ['popular', 'all'],
        columns: 2,
        options: [
          { id: 'kc-bal-1', label: 'Kansas City Chiefs', odds: 1.62 },
          { id: 'kc-bal-2', label: 'Baltimore Ravens', odds: 2.30 },
        ],
      },
      {
        id: 'mkt-kc-bal-sp',
        name: 'Point spread',
        group: ['popular', 'handicaps', 'all'],
        columns: 2,
        options: [
          { id: 'kc-bal-sp-1', label: 'Chiefs -3.5', odds: 1.92 },
          { id: 'kc-bal-sp-2', label: 'Ravens +3.5', odds: 1.88 },
        ],
      },
      {
        id: 'mkt-kc-bal-tot',
        name: 'Total points',
        group: ['popular', 'totals', 'all'],
        columns: 2,
        options: [
          { id: 'kc-bal-tot-o', label: 'Over 48.5 Points', odds: 1.90 },
          { id: 'kc-bal-tot-u', label: 'Under 48.5 Points', odds: 1.90 },
        ],
      },
      {
        id: 'mkt-kc-bal-1h',
        name: '1st half winner',
        group: ['quarters', 'all'],
        columns: 2,
        options: [
          { id: 'kc-bal-1h-1', label: 'Kansas City Chiefs', odds: 1.48 },
          { id: 'kc-bal-1h-2', label: 'Baltimore Ravens', odds: 2.65 },
        ],
      },
      {
        id: 'mkt-kc-bal-td',
        name: 'Anytime touchdown scorer',
        group: ['popular', 'player_props', 'all'],
        columns: 2,
        options: [
          { id: 'kc-bal-td-kelce', label: 'Travis Kelce (KC)', odds: 1.95 },
          { id: 'kc-bal-td-henry', label: 'Derrick Henry (BAL)', odds: 1.75 },
          { id: 'kc-bal-td-lamar', label: 'Lamar Jackson (BAL)', odds: 2.40 },
          { id: 'kc-bal-td-worthy', label: 'Xavier Worthy (KC)', odds: 2.85 },
        ],
      },
    ],
  },
  // Esports Live Match (CS2)
  {
    id: 'tl-g2',
    sport: 'esports',
    country: 'Global',
    competition: 'CS2 Major',
    homeTeam: 'Team Liquid',
    awayTeam: 'G2 Esports',
    shortCode: 'TL - G2',
    isLive: true,
    clock: 'Map 2',
    homeScore: 1,
    awayScore: 0,
    suspended: false,
    extraMarketsCount: 12,
    featured: false,
    mainOdds: [
      { id: 'tl-g2-1', label: 'Team Liquid', shortLabel: 'Liquid', odds: 1.75 },
      { id: 'tl-g2-2', label: 'G2 Esports', shortLabel: 'G2', odds: 2.05 },
    ],
    markets: [
      {
        id: 'mkt-tl-g2-win',
        name: 'Match winner (Best of 3)',
        group: ['popular', 'all'],
        columns: 2,
        options: [
          { id: 'tl-g2-1', label: 'Team Liquid', odds: 1.75 },
          { id: 'tl-g2-2', label: 'G2 Esports', odds: 2.05 },
        ],
      },
      {
        id: 'mkt-tl-g2-m2',
        name: 'Map 2 winner (Mirage)',
        group: ['popular', 'maps', 'all'],
        columns: 2,
        options: [
          { id: 'tl-g2-m2-1', label: 'Team Liquid', odds: 2.15 },
          { id: 'tl-g2-m2-2', label: 'G2 Esports', odds: 1.68 },
        ],
      },
      {
        id: 'mkt-tl-g2-hcp',
        name: 'Map handicap',
        group: ['handicaps', 'all'],
        columns: 2,
        options: [
          { id: 'tl-g2-hc-1', label: 'Team Liquid -1.5 Maps', odds: 2.45 },
          { id: 'tl-g2-hc-2', label: 'G2 Esports +1.5 Maps', odds: 1.52 },
        ],
      },
      {
        id: 'mkt-tl-g2-rounds',
        name: 'Map 2 total rounds',
        group: ['totals', 'all'],
        columns: 2,
        options: [
          { id: 'tl-g2-rd-o', label: 'Over 21.5 Rounds', odds: 1.85 },
          { id: 'tl-g2-rd-u', label: 'Under 21.5 Rounds', odds: 1.95 },
        ],
      },
      {
        id: 'mkt-tl-g2-kills',
        name: 'Map 2 player kills (Over/Under)',
        group: ['player_props', 'all'],
        columns: 2,
        options: [
          { id: 'tl-g2-k-niko', label: 'NiKo (G2) Over 16.5 Kills', odds: 1.85 },
          { id: 'tl-g2-k-monesy', label: 'm0NESY (G2) Over 17.5 Kills', odds: 1.80 },
          { id: 'tl-g2-k-twistzz', label: 'Twistzz (TL) Over 15.5 Kills', odds: 1.88 },
          { id: 'tl-g2-k-naf', label: 'NAF (TL) Over 14.5 Kills', odds: 1.90 },
        ],
      },
    ],
  },
];

export const INITIAL_MY_BETS: PlacedBet[] = [
  {
    id: 'bet-open-1',
    betRef: 'HB-90482A',
    placedAt: 'Oct 17\n14:58',
    PlacedDateGroup: 'Today',
    sport: 'soccer',
    matchId: 'ars-bha',
    matchTitle: 'Arsenal v Brighton & Hove Albion',
    selectionLabel: 'Arsenal',
    marketName: 'Match result',
    odds: 1.80,
    stake: 20.0,
    potentialReturn: 36.0,
    status: 'Open',
    isLive: true,
    liveClock: "52'",
    liveScore: '1–0',
    cashOutAmount: 29.40,
  },
  {
    id: 'bet-settled-1',
    betRef: 'HB-89104C',
    placedAt: 'Oct 16\n21:15',
    PlacedDateGroup: 'Last 7 days',
    sport: 'soccer',
    matchId: 'rma-bay',
    matchTitle: 'Real Madrid v Celta Vigo',
    selectionLabel: 'Real Madrid',
    marketName: 'Match result',
    odds: 1.55,
    stake: 50.0,
    potentialReturn: 77.50,
    status: 'Won',
    settledReturn: 77.50,
  },
  {
    id: 'bet-settled-2',
    betRef: 'HB-88412F',
    placedAt: 'Oct 15\n19:40',
    PlacedDateGroup: 'Last 7 days',
    sport: 'soccer',
    matchId: 'bar-psg',
    matchTitle: 'Barcelona v Sevilla',
    selectionLabel: 'Over 2.5',
    marketName: 'Total goals',
    odds: 1.72,
    stake: 25.0,
    potentialReturn: 43.0,
    status: 'Won',
    settledReturn: 43.0,
  },
  {
    id: 'bet-settled-3',
    betRef: 'HB-87390B',
    placedAt: 'Oct 14\n20:05',
    PlacedDateGroup: 'Last 7 days',
    sport: 'soccer',
    matchId: 'juv-rom',
    matchTitle: 'Inter v AC Milan',
    selectionLabel: 'Draw',
    marketName: 'Match result',
    odds: 3.40,
    stake: 15.0,
    potentialReturn: 51.0,
    status: 'Lost',
    settledReturn: 0,
  },
  {
    id: 'bet-settled-4',
    betRef: 'HB-86011E',
    placedAt: 'Oct 12\n16:00',
    PlacedDateGroup: 'Last 7 days',
    sport: 'tennis',
    matchId: 'alc-sin',
    matchTitle: 'Carlos Alcaraz v Taylor Fritz',
    selectionLabel: 'Carlos Alcaraz',
    marketName: 'Match winner',
    odds: 1.40,
    stake: 40.0,
    potentialReturn: 56.0,
    status: 'Cashed Out',
    settledReturn: 51.20,
  },
  {
    id: 'bet-settled-5',
    betRef: 'HB-84920D',
    placedAt: 'Oct 10\n18:30',
    PlacedDateGroup: 'Last 30 days',
    sport: 'soccer',
    matchId: 'b04-bvb',
    matchTitle: 'Bayern Munich v Stuttgart',
    selectionLabel: 'Bayern Munich -1.5',
    marketName: 'Asian handicap',
    odds: 2.05,
    stake: 30.0,
    potentialReturn: 61.50,
    status: 'Won',
    settledReturn: 61.50,
  },
  {
    id: 'bet-settled-6',
    betRef: 'HB-83105A',
    placedAt: 'Oct 08\n22:00',
    PlacedDateGroup: 'Last 30 days',
    sport: 'basketball',
    matchId: 'lal-bos',
    matchTitle: 'Boston Celtics v Knicks',
    selectionLabel: 'Boston Celtics',
    marketName: 'Moneyline',
    odds: 1.62,
    stake: 35.0,
    potentialReturn: 56.70,
    status: 'Won',
    settledReturn: 56.70,
  },
  {
    id: 'bet-settled-7',
    betRef: 'HB-81944C',
    placedAt: 'Oct 05\n15:00',
    PlacedDateGroup: 'Last 30 days',
    sport: 'soccer',
    matchId: 'ars-bha',
    matchTitle: 'Arsenal v Chelsea',
    selectionLabel: 'Bukayo Saka (ARS)',
    marketName: 'Anytime goalscorer',
    odds: 2.75,
    stake: 10.0,
    potentialReturn: 27.50,
    status: 'Lost',
    settledReturn: 0,
  },
];

export const SAMPLE_LIVE_EVENTS: LiveEventNotification[] = [
  {
    id: 'ev-goal-ars',
    matchId: 'ars-bha',
    sport: 'soccer',
    competition: 'Premier League',
    badge: 'GOAL!',
    badgeColor: 'emerald',
    title: 'Bukayo Saka scores for Arsenal!',
    subtitle: 'Assisted by Martin Ødegaard · Live odds & Cash Out updated',
    clock: "54'",
    homeTeam: 'Arsenal',
    awayTeam: 'Brighton & Hove Albion',
    homeScore: 2,
    awayScore: 0,
    featuredOddLabel: 'Arsenal Over 2.5',
    featuredOddValue: 1.95,
  },
  {
    id: 'ev-tennis-break',
    matchId: 'djo-med',
    sport: 'tennis',
    competition: 'ATP Masters 1000',
    badge: 'BREAK OF SERVE',
    badgeColor: 'cyan',
    title: 'Djokovic breaks Medvedev in Set 3!',
    subtitle: 'Djokovic now serving at 4-2 in the deciding set',
    clock: 'Set 3',
    homeTeam: 'Novak Djokovic',
    awayTeam: 'Daniil Medvedev',
    homeScore: 1,
    awayScore: 1,
    featuredOddLabel: 'Djokovic Match Winner',
    featuredOddValue: 1.38,
  },
  {
    id: 'ev-nba-run',
    matchId: 'lal-bos',
    sport: 'basketball',
    competition: 'NBA',
    badge: '10-0 RUN',
    badgeColor: 'amber',
    title: 'LeBron James hits back-to-back threes!',
    subtitle: 'LA Lakers take a 1-point lead in Q3 · Timeout Boston',
    clock: 'Q3 02:18',
    homeTeam: 'LA Lakers',
    awayTeam: 'Boston Celtics',
    homeScore: 90,
    awayScore: 89,
    featuredOddLabel: 'LA Lakers Moneyline',
    featuredOddValue: 1.85,
  },
  {
    id: 'ev-var-check',
    matchId: 'juv-rom',
    sport: 'soccer',
    competition: 'Serie A',
    badge: 'PENALTY AWARDED',
    badgeColor: 'rose',
    title: 'Penalty to Juventus! Dušan Vlahović steps up',
    subtitle: 'Next Goal & Match Result odds shifting rapidly',
    clock: "51'",
    homeTeam: 'Juventus',
    awayTeam: 'Roma',
    homeScore: 2,
    awayScore: 1,
    featuredOddLabel: 'Juventus Match Winner',
    featuredOddValue: 1.52,
  },
];
