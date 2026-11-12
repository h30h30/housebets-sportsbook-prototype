import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Lock,
  MoreHorizontal,
  Search,
  Star,
  Unlock,
  X,
  Zap,
} from 'lucide-react';
import {
  MarketGroupId,
  MatchFixture,
  OddOption,
  SPORT_LABELS,
  SPORT_MARKET_TABS,
  SportId,
} from '../data/sportsbookData';
import { TeamCrest } from './BrandAssets';
import { OddsButton } from './MatchComponents';

interface MatchPageViewProps {
  match: MatchFixture;
  allMatches: MatchFixture[];
  selectedOptionIds: Set<string>;
  onToggleOdd: (match: MatchFixture, marketName: string, option: OddOption) => void;
  onSelectMatch: (matchId: string) => void;
  onBackToSportOrLeague: (sport: SportId, competition?: string) => void;
  followedTeams: string[];
  followedCompetitions: string[];
  onToggleFollowTeam: (team: string) => void;
  onToggleFollowCompetition: (comp: string) => void;
  onSimulateOddsMovement: () => void;
  onToggleMarketSuspend: (matchId: string, marketId: string) => void;
}

const SEARCH_PLACEHOLDERS: Record<SportId, string> = {
  soccer: 'Search markets or players (e.g. Saka, Corners, Handicap, Over 2.5)',
  tennis: 'Search markets or players (e.g. Djokovic, Alcaraz, Set betting, Aces)',
  basketball: 'Search markets or players (e.g. LeBron, Tatum, Point spread, Total points)',
  baseball: 'Search markets or players (e.g. Judge, Ohtani, Run line, Total runs)',
  american_football: 'Search markets or players (e.g. Kelce, Henry, Touchdown, Spread)',
  esports: 'Search markets or players (e.g. NiKo, m0NESY, Map 2, Rounds)',
};

export const MatchPageView: React.FC<MatchPageViewProps> = ({
  match,
  allMatches,
  selectedOptionIds,
  onToggleOdd,
  onSelectMatch,
  onBackToSportOrLeague,
  followedTeams,
  followedCompetitions,
  onToggleFollowTeam,
  onToggleFollowCompetition,
  onSimulateOddsMovement,
  onToggleMarketSuspend,
}) => {
  const [activeGroup, setActiveGroup] = useState<MarketGroupId>('popular');
  const [marketSearch, setMarketSearch] = useState('');
  const [collapsedMarkets, setCollapsedMarkets] = useState<Record<string, boolean>>({});
  const [isScoreboardScrolledOut, setIsScoreboardScrolledOut] = useState(false);
  const [leagueMenuOpen, setLeagueMenuOpen] = useState(false);
  const scoreboardRef = useRef<HTMLDivElement | null>(null);

  // Reset active market tab to 'popular' when switching to a match of a different sport
  useEffect(() => {
    setActiveGroup('popular');
    setMarketSearch('');
    setLeagueMenuOpen(false);
  }, [match.id, match.sport]);

  useEffect(() => {
    const el = scoreboardRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScoreboardScrolledOut(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [match.id]);

  const isHomeFollowed = followedTeams.includes(match.homeTeam);
  const isAwayFollowed = followedTeams.includes(match.awayTeam);
  const isCompFollowed = followedCompetitions.includes(match.competition);

  const toggleCollapse = (marketId: string) => {
    setCollapsedMarkets((prev) => ({ ...prev, [marketId]: !prev[marketId] }));
  };

  // Sport-specific market group tabs (Soccer gets Goalscorers/Corners, Tennis gets Sets/Games/Aces, MLB gets Innings/Run Line, etc.)
  const currentSportTabs = SPORT_MARKET_TABS[match.sport] || SPORT_MARKET_TABS.soccer;

  const getGroupCount = (groupId: MarketGroupId) => {
    if (groupId === 'all') return match.markets.length;
    return match.markets.filter((m) => m.group.includes(groupId)).length;
  };

  // Filter markets by active group and search input
  const visibleMarkets = match.markets.filter((mkt) => {
    const matchesGroup =
      activeGroup === 'all' || mkt.group.includes(activeGroup);
    if (!matchesGroup) return false;

    if (!marketSearch.trim()) return true;
    const q = marketSearch.toLowerCase();
    return (
      mkt.name.toLowerCase().includes(q) ||
      mkt.options.some((opt) => opt.label.toLowerCase().includes(q))
    );
  });

  // Matches in the current sport & competitions in the current sport for the breadcrumb navigator
  const sportMatches = allMatches.filter((m) => m.sport === match.sport);
  const sameLeagueMatches = sportMatches.filter(
    (m) => m.competition === match.competition
  );
  const switcherMatches =
    sameLeagueMatches.length > 1 ? sameLeagueMatches : sportMatches;
  const sportCompetitions = Array.from(
    new Set(sportMatches.map((m) => m.competition))
  );

  return (
    <div className="space-y-4 pb-10">
      {/* COMPACT STICKY MINI-SCOREBOARD WHEN SCROLLING DOWN */}
      {isScoreboardScrolledOut && (
        <div className="sticky top-0 z-20 -mx-3 @sm:-mx-6 @lg:-mx-8 px-4 py-2.5 bg-[#07141A]/95 backdrop-blur border-b border-[#173340] flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => onBackToSportOrLeague(match.sport, match.competition)}
              className="p-1 rounded-lg bg-[#0C1E26] border border-[#173340] text-[#94A3B8] hover:text-white"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1.5 min-w-0">
              <TeamCrest team={match.homeTeam} size="sm" />
              <span className="text-xs font-bold text-white truncate max-w-[80px] @sm:max-w-[150px]">
                {match.homeTeam}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#0C1E26] border border-[#173340] font-mono-num text-xs font-extrabold text-white">
              {match.isLive
                ? `${match.homeScore ?? 0} - ${match.awayScore ?? 0}`
                : 'vs'}
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-bold text-white truncate max-w-[80px] @sm:max-w-[150px]">
                {match.awayTeam}
              </span>
              <TeamCrest team={match.awayTeam} size="sm" />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {match.isLive ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-num font-extrabold bg-[#E11D48]/20 text-[#FB7185] border border-[#E11D48]/30">
                ● LIVE {match.clock}
              </span>
            ) : (
              <span className="font-mono-num text-[11px] text-[#94A3B8]">
                {match.kickoffTime}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Top Breadcrumb Bar (Sport-Aware: Sport / Tour or Country / Competition / Match) */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => onBackToSportOrLeague(match.sport, match.competition)}
            className="w-9 h-9 rounded-xl bg-[#0C1E26] border border-[#173340] hover:border-[#2CE5FF]/50 flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors shrink-0"
            aria-label="Back"
            title={`Back to ${SPORT_LABELS[match.sport]}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Desktop Breadcrumb Trail with Real Sport, Region, Competition, and Match Navigation */}
          <div className="hidden @sm:flex items-center bg-[#0C1E26] border border-[#173340] rounded-xl px-1.5 py-1 text-xs font-medium text-[#CBD5E1]">
            {/* 1. Sport Selector */}
            <select
              value={match.sport}
              onChange={(e) => {
                const nextSport = e.target.value as SportId;
                const firstMatchInSport = allMatches.find(
                  (m) => m.sport === nextSport
                );
                if (firstMatchInSport) {
                  onSelectMatch(firstMatchInSport.id);
                } else {
                  onBackToSportOrLeague(nextSport);
                }
              }}
              className="bg-transparent font-semibold text-[#CBD5E1] hover:text-white px-2 py-1 rounded-lg hover:bg-[#132B36] focus:outline-none cursor-pointer"
              title="Switch Sport"
            >
              {(Object.keys(SPORT_LABELS) as SportId[]).map((sp) => (
                <option key={sp} value={sp} className="bg-[#0C1E26] text-white">
                  {SPORT_LABELS[sp]}
                </option>
              ))}
            </select>

            <span className="text-[#1E3F4F] px-0.5">/</span>

            {/* 2. Country / Tour Button (navigates to that sport's league/live view) */}
            <button
              type="button"
              onClick={() => onBackToSportOrLeague(match.sport, match.competition)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[#132B36] hover:text-white transition-colors whitespace-nowrap"
              title={`View all ${match.country} ${SPORT_LABELS[match.sport]} matches`}
            >
              <span>{match.country}</span>
              <ChevronDown className="w-3 h-3 text-[#64748B]" />
            </button>

            <span className="text-[#1E3F4F] px-0.5">/</span>

            {/* 3. Competition Selector within current Sport */}
            <select
              value={match.competition}
              onChange={(e) => {
                const nextComp = e.target.value;
                const firstMatchInComp = sportMatches.find(
                  (m) => m.competition === nextComp
                );
                if (firstMatchInComp) {
                  onSelectMatch(firstMatchInComp.id);
                } else {
                  onBackToSportOrLeague(match.sport, nextComp);
                }
              }}
              className="bg-transparent font-semibold text-[#CBD5E1] hover:text-white px-2 py-1 rounded-lg hover:bg-[#132B36] focus:outline-none cursor-pointer"
              title="Switch Competition"
            >
              {sportCompetitions.map((comp) => (
                <option key={comp} value={comp} className="bg-[#0C1E26] text-white">
                  {comp}
                </option>
              ))}
            </select>

            <span className="text-[#1E3F4F] px-0.5">/</span>

            {/* 4. Match Selector */}
            <select
              value={match.id}
              onChange={(e) => onSelectMatch(e.target.value)}
              className="bg-transparent font-bold text-white px-2.5 py-1 rounded-lg hover:bg-[#132B36] focus:outline-none cursor-pointer"
            >
              {sportMatches.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#0C1E26] text-white">
                  {m.shortCode} ({m.homeTeam} v {m.awayTeam})
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Match Switcher Pill (matches phone-match.webp: ARS - BHA v) */}
          <div className="@sm:hidden flex items-center gap-1.5">
            <select
              value={match.id}
              onChange={(e) => onSelectMatch(e.target.value)}
              className="h-9 px-3 rounded-xl bg-[#0C1E26] border border-[#173340] text-xs font-bold text-white focus:outline-none"
            >
              {sportMatches.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#0C1E26] text-white">
                  {m.shortCode}
                </option>
              ))}
            </select>
          </div>

          {/* Three-Dots (•••) Same-League Match Switcher Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLeagueMenuOpen((prev) => !prev)}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
                leagueMenuOpen
                  ? 'bg-[#133240] border-[#2CE5FF] text-white'
                  : 'bg-[#0C1E26] border-[#173340] text-[#94A3B8] hover:text-white'
              }`}
              title={`More matches in ${match.competition}`}
              aria-label="Same league matches menu"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {leagueMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setLeagueMenuOpen(false)}
                />
                <div className="absolute left-0 top-11 z-40 w-72 rounded-2xl bg-[#0B1820] border border-[#1B3746] shadow-2xl overflow-hidden text-white">
                  <div className="px-3.5 py-2.5 bg-[#07141A] border-b border-[#16303D] flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2CE5FF]">
                      {match.competition} Matches
                    </span>
                    <span className="text-[10px] font-mono-num text-[#64748B]">
                      {switcherMatches.length} fixtures
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-[#142934]">
                    {switcherMatches.map((m) => {
                      const isCurrent = m.id === match.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            onSelectMatch(m.id);
                            setLeagueMenuOpen(false);
                          }}
                          className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-2 transition-colors ${
                            isCurrent
                              ? 'bg-[#133240]/80 text-white'
                              : 'hover:bg-[#10222C] text-[#CBD5E1]'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                              <TeamCrest team={m.homeTeam} size="sm" />
                              <span className="truncate">{m.homeTeam}</span>
                              <span className="text-[#64748B]">v</span>
                              <span className="truncate">{m.awayTeam}</span>
                            </div>
                            <div className="text-[10px] text-[#64748B] mt-0.5">
                              {m.competition}
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            {m.isLive ? (
                              <div className="space-y-0.5">
                                <div className="font-mono-num text-xs font-extrabold text-white">
                                  {m.homeScore ?? 0} - {m.awayScore ?? 0}
                                </div>
                                <div className="text-[10px] font-mono-num font-bold text-[#FB7185]">
                                  ● {m.clock}
                                </div>
                              </div>
                            ) : (
                              <span className="font-mono-num text-[11px] text-[#94A3B8]">
                                {m.kickoffTime}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Interactive Match State Simulator Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onSimulateOddsMovement}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0C1E26] border border-[#173340] hover:border-[#2CE5FF] text-[11px] font-semibold text-[#2CE5FF] transition-colors"
            title="Move live odds up/down and trigger Bet Slip odds change state"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Live Odds Drift</span>
          </button>
        </div>
      </div>

      {/* Live Scoreboard Banner (matches desk-match.webp & phone-match.webp) */}
      <div
        ref={scoreboardRef}
        className="relative rounded-2xl bg-[#0C1E26] border border-[#173340] p-4 @sm:p-6"
      >
        {/* Competition Kicker + Star */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => onBackToSportOrLeague(match.sport, match.competition)}
            className="@sm:hidden text-[#94A3B8] hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#94A3B8] mx-auto">
            {match.competition}
          </span>
          <button
            type="button"
            onClick={() => onToggleFollowCompetition(match.competition)}
            className="text-[#94A3B8] hover:text-[#FACC15] transition-colors"
            title={`Follow ${match.competition}`}
          >
            <Star
              className={`w-4 h-4 ${
                isCompFollowed ? 'fill-[#FACC15] text-[#FACC15]' : ''
              }`}
            />
          </button>
        </div>

        {/* Desktop & Mobile Scoreboard Grid */}
        <div className="grid grid-cols-3 items-center gap-2 @sm:gap-6">
          {/* Home Team */}
          <div className="flex flex-col @sm:flex-row items-center gap-2 @sm:gap-3.5 text-center @sm:text-left min-w-0">
            <TeamCrest team={match.homeTeam} size="lg" />
            <div className="flex flex-col items-center @sm:items-start gap-1.5 min-w-0 w-full">
              <h1 className="text-xs @sm:text-base font-extrabold text-white leading-tight truncate max-w-full">
                {match.homeTeam}
              </h1>
              <button
                type="button"
                onClick={() => onToggleFollowTeam(match.homeTeam)}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] @sm:text-[11px] font-semibold border transition-all ${
                  isHomeFollowed
                    ? 'bg-[#FACC15]/15 border-[#FACC15]/60 text-[#FACC15]'
                    : 'bg-[#112631] border-[#1D3B4A] text-[#94A3B8] hover:text-white'
                }`}
              >
                <Star
                  className={`w-3 h-3 ${
                    isHomeFollowed ? 'fill-[#FACC15] text-[#FACC15]' : ''
                  }`}
                />
                <span>{isHomeFollowed ? 'Following' : 'Follow'}</span>
              </button>
            </div>
          </div>

          {/* Center Score & Clock */}
          <div className="flex flex-col items-center justify-center">
            {match.isLive ? (
              <>
                <div className="flex items-center gap-1.5 @sm:gap-3">
                  <span className="w-10 h-11 @sm:w-12 @sm:h-12 rounded-xl bg-[#08151B] border border-[#142C38] flex items-center justify-center font-mono-num text-xl @sm:text-2xl font-extrabold text-white">
                    {match.homeScore ?? 0}
                  </span>
                  <span className="text-[#64748B] font-bold">-</span>
                  <span className="w-10 h-11 @sm:w-12 @sm:h-12 rounded-xl bg-[#08151B] border border-[#142C38] flex items-center justify-center font-mono-num text-xl @sm:text-2xl font-extrabold text-[#64748B]">
                    {match.awayScore ?? 0}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 @sm:gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-1.5 @sm:px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#E11D48]/20 text-[#FB7185] border border-[#E11D48]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FB7185]" />
                    LIVE
                  </span>
                  <span className="font-mono-num text-xs font-bold text-[#FB7185]">
                    {match.clock}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <span className="font-mono-num text-lg @sm:text-xl font-extrabold text-white">
                  {match.kickoffTime}
                </span>
                <span className="text-xs text-[#94A3B8] mt-1">
                  {match.kickoffDate}
                </span>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col @sm:flex-row-reverse items-center gap-2 @sm:gap-3.5 text-center @sm:text-right min-w-0">
            <TeamCrest team={match.awayTeam} size="lg" />
            <div className="flex flex-col items-center @sm:items-end gap-1.5 min-w-0 w-full">
              <h2 className="text-xs @sm:text-base font-extrabold text-white leading-tight truncate max-w-full">
                {match.awayTeam}
              </h2>
              <button
                type="button"
                onClick={() => onToggleFollowTeam(match.awayTeam)}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] @sm:text-[11px] font-semibold border transition-all ${
                  isAwayFollowed
                    ? 'bg-[#FACC15]/15 border-[#FACC15]/60 text-[#FACC15]'
                    : 'bg-[#112631] border-[#1D3B4A] text-[#94A3B8] hover:text-white'
                }`}
              >
                <Star
                  className={`w-3 h-3 ${
                    isAwayFollowed ? 'fill-[#FACC15] text-[#FACC15]' : ''
                  }`}
                />
                <span>{isAwayFollowed ? 'Following' : 'Follow'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sport-Aware Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={marketSearch}
          onChange={(e) => setMarketSearch(e.target.value)}
          placeholder={SEARCH_PLACEHOLDERS[match.sport] || SEARCH_PLACEHOLDERS.soccer}
          className="w-full h-11 pl-10 pr-9 rounded-xl bg-[#0C1E26] border border-[#173340] focus:border-[#2CE5FF] focus:outline-none text-xs text-white placeholder-[#64748B]"
        />
        {marketSearch && (
          <button
            type="button"
            onClick={() => setMarketSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sport-Aware Market Group Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#0C1E26] border border-[#173340] overflow-x-auto no-scrollbar">
        {currentSportTabs.map((tab) => {
          const isActive = activeGroup === tab.id;
          const count = getGroupCount(tab.id);
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveGroup(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-[#133240] text-white border border-[#1E495C]'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#102631]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`font-mono-num text-[11px] ${
                  isActive ? 'text-[#2CE5FF] font-bold' : 'text-[#64748B]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Market Accordions */}
      <div className="space-y-3">
        {visibleMarkets.map((market) => {
          const isCollapsed = !!collapsedMarkets[market.id];
          const isMarketSuspended = match.suspended || market.suspended;

          return (
            <div
              key={market.id}
              className="rounded-xl bg-[#0C1E26] border border-[#173340] overflow-hidden"
            >
              {/* Market Header */}
              <div
                onClick={() => toggleCollapse(market.id)}
                className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-[#102631]/50 transition-colors border-b border-[#16303D]"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-[13px] font-bold text-white">
                    {market.name}
                  </h3>
                  {isMarketSuspended && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#F59E0B]">
                      <Lock className="w-3 h-3" />
                      Suspended
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleMarketSuspend(match.id, market.id);
                    }}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border transition-colors ${
                      isMarketSuspended
                        ? 'bg-[#F59E0B]/15 border-[#F59E0B]/50 text-[#F59E0B]'
                        : 'bg-[#112631] border-[#1D3B4A] text-[#64748B] hover:text-white'
                    }`}
                    title="Toggle market suspension state"
                  >
                    {isMarketSuspended ? (
                      <>
                        <Unlock className="w-3 h-3" />
                        <span>Unsuspend</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Suspend</span>
                      </>
                    )}
                  </button>

                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </div>
              </div>

              {/* Market Options Grid */}
              {!isCollapsed && (
                <div className="p-3.5">
                  <div
                    className={`grid gap-2.5 ${
                      market.columns === 2 ? 'grid-cols-2' : 'grid-cols-3'
                    }`}
                  >
                    {market.options.map((opt) => (
                      <div key={opt.id}>
                        <div className="hidden @sm:block">
                          <OddsButton
                            option={opt}
                            isSelected={selectedOptionIds.has(opt.id)}
                            onSelect={(o) => onToggleOdd(match, market.name, o)}
                            matchSuspended={isMarketSuspended}
                          />
                        </div>
                        <div className="@sm:hidden">
                          <OddsButton
                            option={opt}
                            isSelected={selectedOptionIds.has(opt.id)}
                            onSelect={(o) => onToggleOdd(match, market.name, o)}
                            stacked
                            matchSuspended={isMarketSuspended}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {visibleMarkets.length === 0 && (
          <div className="rounded-xl bg-[#0C1E26] border border-[#173340] p-8 text-center">
            <p className="text-xs text-[#94A3B8]">
              No markets matching "{marketSearch}" in this tab.
            </p>
            <button
              type="button"
              onClick={() => {
                setMarketSearch('');
                setActiveGroup('all');
              }}
              className="mt-2 text-xs font-semibold text-[#2CE5FF] hover:underline"
            >
              Show all markets
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
