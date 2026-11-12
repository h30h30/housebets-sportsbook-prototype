import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Flame,
  Gamepad2,
  Home,
  Search,
  Star,
  Trophy,
  Tv,
  User,
  X,
} from 'lucide-react';
import { MatchFixture, OddOption, SportId } from '../data/sportsbookData';
import { LeagueBadge, TeamCrest } from './BrandAssets';
import {
  AmericanFootballIcon,
  BasketballIcon,
  DesktopMatchRow,
  FeaturedMatchCard,
  OddsButton,
  SoccerBallIcon,
  TennisBallIcon,
} from './MatchComponents';

interface SportsHomeViewProps {
  matches: MatchFixture[];
  selectedOptionIds: Set<string>;
  onToggleOdd: (match: MatchFixture, marketName: string, option: OddOption) => void;
  onOpenMatch: (matchId: string) => void;
  onNavigatePage: (page: 'home' | 'live' | 'football' | 'match' | 'mybets') => void;
  followedTeams: string[];
  followedCompetitions: string[];
  onToggleFollowTeam: (team: string) => void;
  onToggleFollowCompetition: (comp: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCompetition?: (comp: string) => void;
}

const SPORT_TABS: { id: 'home' | 'live' | SportId; label: string; liveCount?: number }[] = [
  { id: 'home', label: 'Home' },
  { id: 'live', label: 'Live', liveCount: 13 },
  { id: 'soccer', label: 'Soccer' },
  { id: 'tennis', label: 'Tennis' },
  { id: 'basketball', label: 'Basketball' },
  { id: 'baseball', label: 'Baseball' },
  { id: 'american_football', label: 'American Football' },
  { id: 'esports', label: 'Esports' },
];

const TOP_COMPETITIONS = [
  { name: 'Premier League', country: 'England', count: 5 },
  { name: 'Champions League', country: 'Europe', count: 3 },
  { name: 'LaLiga', country: 'Spain', count: 2 },
  { name: 'Serie A', country: 'Italy', count: 2 },
  { name: 'Bundesliga', country: 'Germany', count: 2 },
];

const QUICK_SEARCH_SUGGESTIONS = [
  'Saka',
  'Haaland',
  'Mbappé',
  'Over 2.5',
  'Corners',
  'Arsenal',
  'Champions League',
];

export const SportsHomeView: React.FC<SportsHomeViewProps> = ({
  matches,
  selectedOptionIds,
  onToggleOdd,
  onOpenMatch,
  onNavigatePage,
  followedTeams,
  followedCompetitions,
  onToggleFollowTeam,
  onToggleFollowCompetition,
  searchQuery,
  onSearchChange,
  onOpenCompetition,
}) => {
  const [activeSportFilter, setActiveSportFilter] = useState<'all' | SportId>('all');
  const [featuredOffset, setFeaturedOffset] = useState(0);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Categorized search results for: 1) Competitions, 2) Teams/Fixtures, 3) Players (Goalscorers), 4) Markets
  const matchedCompetitions = normalizedQuery
    ? TOP_COMPETITIONS.filter(
        (c) =>
          c.name.toLowerCase().includes(normalizedQuery) ||
          c.country.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const matchedFixtures = normalizedQuery
    ? matches.filter(
        (m) =>
          m.homeTeam.toLowerCase().includes(normalizedQuery) ||
          m.awayTeam.toLowerCase().includes(normalizedQuery) ||
          m.competition.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const matchedPlayerProps: {
    match: MatchFixture;
    marketName: string;
    option: OddOption;
  }[] = [];

  const matchedMarketOptions: {
    match: MatchFixture;
    marketName: string;
    option: OddOption;
  }[] = [];

  if (normalizedQuery) {
    matches.forEach((m) => {
      m.markets.forEach((mkt) => {
        const isGoalscorerMarket = mkt.group.includes('goalscorers');
        mkt.options.forEach((opt) => {
          const matchesOption = opt.label.toLowerCase().includes(normalizedQuery);
          const matchesMarketName = mkt.name.toLowerCase().includes(normalizedQuery);

          if (isGoalscorerMarket && matchesOption) {
            matchedPlayerProps.push({
              match: m,
              marketName: mkt.name,
              option: opt,
            });
          } else if (!isGoalscorerMarket && (matchesOption || matchesMarketName)) {
            matchedMarketOptions.push({
              match: m,
              marketName: mkt.name,
              option: opt,
            });
          }
        });
      });
    });
  }

  const filteredMatches = matches.filter((m) => {
    if (activeSportFilter !== 'all' && m.sport !== activeSportFilter) return false;
    return true;
  });

  // Your matches: matches matching followed teams or competitions
  const yourMatches = filteredMatches.filter(
    (m) =>
      followedTeams.includes(m.homeTeam) ||
      followedTeams.includes(m.awayTeam) ||
      followedCompetitions.includes(m.competition)
  );

  const featuredMatches = filteredMatches.filter((m) => m.featured || m.isLive);
  const liveNowMatches = filteredMatches.filter((m) => m.isLive);
  const startingSoonMatches = filteredMatches.filter((m) => !m.isLive);

  return (
    <div className="space-y-5 pb-10">
      {/* Search Bar: Teams, players, competitions, markets */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search teams, players, competitions or markets (e.g. Saka, Corners, Over 2.5)"
            className="w-full h-11 pl-10 pr-9 rounded-xl bg-[#0C1E26] border border-[#173340] focus:border-[#2CE5FF] focus:outline-none text-xs text-white placeholder-[#64748B] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Search Chips for Instant Testing of Teams, Players, Competitions, Markets */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-[#64748B] shrink-0">Quick search:</span>
          {QUICK_SEARCH_SUGGESTIONS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() =>
                onSearchChange(searchQuery === term ? '' : term)
              }
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                searchQuery === term
                  ? 'bg-[#2CE5FF] text-[#061116] font-bold'
                  : 'bg-[#0C1E26] border border-[#173340] text-[#94A3B8] hover:text-white'
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* CATEGORIZED INSTANT-BET SEARCH RESULTS PANEL (When user searches) */}
      {normalizedQuery && (
        <div className="rounded-2xl bg-[#0C1E26] border border-[#2CE5FF]/40 p-4 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#16303D] pb-2.5">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#2CE5FF]" />
              <span className="text-xs font-bold text-white">
                Instant Search Results for "{searchQuery}"
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="text-xs font-semibold text-[#94A3B8] hover:text-white"
            >
              Clear search
            </button>
          </div>

          {/* 1. Player Goalscorer Markets (Tap to Bet directly!) */}
          {matchedPlayerProps.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#94A3B8] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#2CE5FF]" />
                <span>Players & Goalscorer Odds ({matchedPlayerProps.length})</span>
              </h3>
              <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-2.5">
                {matchedPlayerProps.slice(0, 9).map(({ match, marketName, option }) => (
                  <div
                    key={option.id}
                    className="p-2.5 rounded-xl bg-[#09181F] border border-[#16303D] flex flex-col justify-between gap-2"
                  >
                    <div
                      onClick={() => onOpenMatch(match.id)}
                      className="flex items-center justify-between text-[11px] text-[#94A3B8] hover:text-white cursor-pointer"
                    >
                      <span className="truncate">
                        {match.homeTeam} v {match.awayTeam}
                      </span>
                      <span className="text-[#2CE5FF] shrink-0">{marketName}</span>
                    </div>
                    <OddsButton
                      option={option}
                      isSelected={selectedOptionIds.has(option.id)}
                      onSelect={(o) => onToggleOdd(match, marketName, o)}
                      matchSuspended={match.suspended}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Markets (Over/Under, Corners, Cards, Handicaps) */}
          {matchedMarketOptions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#94A3B8]">
                Markets & Selections ({matchedMarketOptions.length})
              </h3>
              <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-2.5">
                {matchedMarketOptions.slice(0, 9).map(({ match, marketName, option }) => (
                  <div
                    key={option.id}
                    className="p-2.5 rounded-xl bg-[#09181F] border border-[#16303D] flex flex-col justify-between gap-2"
                  >
                    <div
                      onClick={() => onOpenMatch(match.id)}
                      className="flex items-center justify-between text-[11px] text-[#94A3B8] hover:text-white cursor-pointer"
                    >
                      <span className="truncate">
                        {match.homeTeam} v {match.awayTeam}
                      </span>
                      <span className="text-[#2CE5FF] shrink-0">{marketName}</span>
                    </div>
                    <OddsButton
                      option={option}
                      isSelected={selectedOptionIds.has(option.id)}
                      onSelect={(o) => onToggleOdd(match, marketName, o)}
                      matchSuspended={match.suspended}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Teams & Fixtures */}
          {matchedFixtures.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#94A3B8]">
                Teams & Matches ({matchedFixtures.length})
              </h3>
              <div className="rounded-xl bg-[#09181F] border border-[#16303D] overflow-hidden">
                {matchedFixtures.slice(0, 5).map((match, idx) => (
                  <div
                    key={match.id}
                    className={idx === 0 ? '[&>div]:border-t-0' : ''}
                  >
                    <DesktopMatchRow
                      match={match}
                      selectedOptionIds={selectedOptionIds}
                      onToggleOdd={onToggleOdd}
                      onOpenMatch={onOpenMatch}
                      isStarred={followedTeams.includes(match.homeTeam)}
                      onToggleStar={onToggleFollowTeam}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Competitions */}
          {matchedCompetitions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#94A3B8]">
                Competitions ({matchedCompetitions.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchedCompetitions.map((comp) => (
                  <button
                    key={comp.name}
                    type="button"
                    onClick={() =>
                      onOpenCompetition
                        ? onOpenCompetition(comp.name)
                        : onNavigatePage('football')
                    }
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#09181F] border border-[#16303D] hover:border-[#2CE5FF] text-xs font-bold text-white"
                  >
                    <LeagueBadge competition={comp.name} />
                    <span>{comp.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedPlayerProps.length === 0 &&
            matchedMarketOptions.length === 0 &&
            matchedFixtures.length === 0 &&
            matchedCompetitions.length === 0 && (
              <div className="py-6 text-center text-xs text-[#94A3B8]">
                No teams, players, competitions, or markets found matching "{searchQuery}".
              </div>
            )}
        </div>
      )}

      {/* Sports Navigation Bar (matches desk-home.webp & phone-home.webp) */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#0C1E26] border border-[#173340] overflow-x-auto no-scrollbar">
        {SPORT_TABS.map((tab) => {
          const isActive =
            (tab.id === 'home' && activeSportFilter === 'all') ||
            activeSportFilter === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.id === 'live') {
                  onNavigatePage('live');
                } else if (tab.id === 'soccer') {
                  onNavigatePage('football');
                } else if (tab.id === 'home') {
                  setActiveSportFilter('all');
                } else {
                  setActiveSportFilter(tab.id as SportId);
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-[#133240] text-white border border-[#1E495C]'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#102631]'
              }`}
            >
              {tab.id === 'home' && <Home className="w-3.5 h-3.5 text-[#2CE5FF]" />}
              {tab.id === 'live' && (
                <span className="relative flex items-center">
                  <Tv className="w-3.5 h-3.5 text-[#FB7185]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] absolute -top-0.5 -right-0.5" />
                </span>
              )}
              {tab.id === 'soccer' && <SoccerBallIcon className="w-3.5 h-3.5" />}
              {tab.id === 'tennis' && <TennisBallIcon className="w-3.5 h-3.5" />}
              {tab.id === 'basketball' && <BasketballIcon className="w-3.5 h-3.5" />}
              {tab.id === 'american_football' && (
                <AmericanFootballIcon className="w-3.5 h-3.5" />
              )}
              {tab.id === 'esports' && <Gamepad2 className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
              {tab.liveCount && (
                <span className="font-mono-num text-[11px] font-bold text-[#FB7185]">
                  {tab.liveCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Favourites Section (Pills with remove X & Your matches) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight">Favourites</h2>
          <span className="text-[11px] text-[#64748B]">
            Tap ★ on any team or competition to follow
          </span>
        </div>

        {/* Favourite Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {followedCompetitions.map((comp) => (
            <div
              key={comp}
              onClick={() =>
                onOpenCompetition
                  ? onOpenCompetition(comp)
                  : onNavigatePage('football')
              }
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0C1E26] border border-[#173340] hover:border-[#244E63] text-xs font-semibold text-white cursor-pointer transition-colors"
            >
              <Star className="w-3.5 h-3.5 fill-[#FACC15] text-[#FACC15]" />
              <span>{comp}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFollowCompetition(comp);
                }}
                className="text-[#64748B] hover:text-white ml-0.5"
                title={`Unfollow ${comp}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {followedTeams.map((team) => (
            <div
              key={team}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0C1E26] border border-[#173340] hover:border-[#244E63] text-xs font-semibold text-white transition-colors"
            >
              <TeamCrest team={team} size="sm" />
              <span>{team}</span>
              <button
                type="button"
                onClick={() => onToggleFollowTeam(team)}
                className="text-[#64748B] hover:text-white ml-0.5"
                title={`Unfollow ${team}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {followedCompetitions.length === 0 && followedTeams.length === 0 && (
            <button
              type="button"
              onClick={() => {
                onToggleFollowCompetition('Premier League');
                onToggleFollowTeam('Arsenal');
              }}
              className="text-xs text-[#2CE5FF] hover:underline"
            >
              + Restore default favourites (Premier League, Arsenal)
            </button>
          )}
        </div>

        {/* Your Matches Box */}
        {yourMatches.length > 0 && (
          <div className="rounded-xl bg-[#0C1E26] border border-[#173340] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#16303D]">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-white">Your matches</h3>
                <span className="text-[11px] text-[#64748B] font-mono-num">
                  {yourMatches.length} matches
                </span>
              </div>
              <span className="hidden @md:inline text-[11px] text-[#94A3B8] mr-44">
                Match result
              </span>
            </div>

            {/* Desktop Rows */}
            <div className="hidden @md:block">
              {yourMatches.slice(0, 3).map((match) => (
                <DesktopMatchRow
                  key={match.id}
                  match={match}
                  selectedOptionIds={selectedOptionIds}
                  onToggleOdd={onToggleOdd}
                  onOpenMatch={onOpenMatch}
                  isStarred={followedTeams.includes(match.homeTeam)}
                  onToggleStar={onToggleFollowTeam}
                />
              ))}
            </div>

            {/* Mobile Horizontal Cards (matches phone-home.webp) */}
            <div className="flex @md:hidden gap-3 p-3 overflow-x-auto no-scrollbar">
              {yourMatches.map((match) => (
                <FeaturedMatchCard
                  key={match.id}
                  match={match}
                  selectedOptionIds={selectedOptionIds}
                  onToggleOdd={onToggleOdd}
                  onOpenMatch={onOpenMatch}
                  isStarred={followedTeams.includes(match.homeTeam)}
                  onToggleStar={onToggleFollowTeam}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Featured Matches Carousel (matches desk-home.webp & phone-home.webp) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight">
            Featured matches
          </h2>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFeaturedOffset((prev) => Math.max(0, prev - 1))}
              className="p-1.5 rounded-lg bg-[#0C1E26] border border-[#173340] text-[#94A3B8] hover:text-white transition-colors"
              aria-label="Previous featured"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                setFeaturedOffset((prev) =>
                  prev + 1 < Math.max(1, featuredMatches.length - 2) ? prev + 1 : 0
                )
              }
              className="p-1.5 rounded-lg bg-[#0C1E26] border border-[#173340] text-[#94A3B8] hover:text-white transition-colors"
              aria-label="Next featured"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {featuredMatches.slice(featuredOffset, featuredOffset + 4).map((match) => (
            <FeaturedMatchCard
              key={match.id}
              match={match}
              selectedOptionIds={selectedOptionIds}
              onToggleOdd={onToggleOdd}
              onOpenMatch={onOpenMatch}
              isStarred={followedTeams.includes(match.homeTeam)}
              onToggleStar={onToggleFollowTeam}
            />
          ))}
        </div>
      </section>

      {/* Top Competitions Strip (Required by Sports Home brief) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#2CE5FF]" />
            <span>Top competitions</span>
          </h2>
          <button
            type="button"
            onClick={() => onNavigatePage('football')}
            className="text-xs font-semibold text-[#2CE5FF] hover:underline flex items-center gap-0.5"
          >
            <span>All competitions</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 @sm:grid-cols-3 @lg:grid-cols-5 gap-2.5">
          {TOP_COMPETITIONS.map((comp) => {
            const isFollowed = followedCompetitions.includes(comp.name);
            return (
              <div
                key={comp.name}
                onClick={() =>
                  onOpenCompetition
                    ? onOpenCompetition(comp.name)
                    : onNavigatePage('football')
                }
                className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-[#0C1E26] border border-[#173340] hover:border-[#2CE5FF]/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <LeagueBadge competition={comp.name} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {comp.name}
                    </div>
                    <div className="text-[10px] text-[#64748B] truncate">
                      {comp.country} · {comp.count} matches
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFollowCompetition(comp.name);
                  }}
                  className="text-[#64748B] hover:text-[#FACC15] shrink-0"
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      isFollowed ? 'fill-[#FACC15] text-[#FACC15]' : ''
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Now Section (Required by Sports Home brief) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
            <h2 className="text-sm font-bold text-white tracking-tight">Live now</h2>
            <span className="font-mono-num text-xs text-[#64748B]">
              {liveNowMatches.length} in play
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigatePage('live')}
            className="text-xs font-semibold text-[#2CE5FF] hover:underline flex items-center gap-0.5"
          >
            <span>View all live</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="rounded-xl bg-[#0C1E26] border border-[#173340] overflow-hidden">
          {liveNowMatches.slice(0, 4).map((match, idx) => (
            <div key={match.id} className={idx === 0 ? '[&>div]:border-t-0' : ''}>
              <DesktopMatchRow
                match={match}
                selectedOptionIds={selectedOptionIds}
                onToggleOdd={onToggleOdd}
                onOpenMatch={onOpenMatch}
                isStarred={followedTeams.includes(match.homeTeam)}
                onToggleStar={onToggleFollowTeam}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Starting Soon / Upcoming Events Section (matches desk-home.webp bottom & brief) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight">
            Starting soon
          </h2>
          <button
            type="button"
            onClick={() => onNavigatePage('football')}
            className="text-xs font-semibold text-[#2CE5FF] hover:underline flex items-center gap-0.5"
          >
            <span>Full schedule</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="rounded-xl bg-[#0C1E26] border border-[#173340] overflow-hidden">
          {startingSoonMatches.map((match, idx) => (
            <div key={match.id} className={idx === 0 ? '[&>div]:border-t-0' : ''}>
              <DesktopMatchRow
                match={match}
                selectedOptionIds={selectedOptionIds}
                onToggleOdd={onToggleOdd}
                onOpenMatch={onOpenMatch}
                isStarred={followedTeams.includes(match.homeTeam)}
                onToggleStar={onToggleFollowTeam}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
