import React, { useEffect, useState } from 'react';
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Flame,
  Gamepad2,
  Search,
  Star,
  Tv,
  X,
} from 'lucide-react';
import { MatchFixture, OddOption, SportId } from '../data/sportsbookData';
import { LeagueBadge } from './BrandAssets';
import {
  AmericanFootballIcon,
  BasketballIcon,
  DesktopMatchRow,
  FeaturedMatchCard,
  SoccerBallIcon,
  TennisBallIcon,
} from './MatchComponents';

interface LiveViewProps {
  matches: MatchFixture[];
  selectedOptionIds: Set<string>;
  onToggleOdd: (match: MatchFixture, marketName: string, option: OddOption) => void;
  onOpenMatch: (matchId: string) => void;
  onBack: () => void;
  onNavigateFootball: () => void;
  followedCompetitions: string[];
  onToggleFollowCompetition: (comp: string) => void;
  nothingLiveSimulated: boolean;
  onToggleNothingLive: () => void;
  initialSportFilter?: 'all' | SportId;
}

const LIVE_SPORT_FILTERS: { id: 'all' | SportId; label: string; count: number }[] = [
  { id: 'all', label: 'All', count: 13 },
  { id: 'soccer', label: 'Soccer', count: 6 },
  { id: 'tennis', label: 'Tennis', count: 3 },
  { id: 'basketball', label: 'Basketball', count: 1 },
  { id: 'baseball', label: 'Baseball', count: 1 },
  { id: 'american_football', label: 'American Football', count: 1 },
  { id: 'esports', label: 'Esports', count: 1 },
];

export const LiveView: React.FC<LiveViewProps> = ({
  matches,
  selectedOptionIds,
  onToggleOdd,
  onOpenMatch,
  onBack,
  onNavigateFootball,
  followedCompetitions,
  onToggleFollowCompetition,
  nothingLiveSimulated,
  onToggleNothingLive,
  initialSportFilter = 'all',
}) => {
  const [selectedSport, setSelectedSport] = useState<'all' | SportId>(
    initialSportFilter
  );
  const [selectedCompetition, setSelectedCompetition] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedSport(initialSportFilter);
    setSelectedCompetition('all');
  }, [initialSportFilter]);

  const liveMatches = nothingLiveSimulated
    ? []
    : matches.filter((m) => {
        if (!m.isLive) return false;
        if (selectedSport !== 'all' && m.sport !== selectedSport) return false;
        if (selectedCompetition !== 'all' && m.competition !== selectedCompetition)
          return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            m.homeTeam.toLowerCase().includes(q) ||
            m.awayTeam.toLowerCase().includes(q) ||
            m.competition.toLowerCase().includes(q)
          );
        }
        return true;
      });

  const startingSoonMatches = matches.filter((m) => !m.isLive);

  // Available competitions for filter
  const availableCompetitions: string[] = Array.from(
    new Set<string>(
      matches
        .filter(
          (m) =>
            m.isLive && (selectedSport === 'all' || m.sport === selectedSport)
        )
        .map((m) => m.competition)
    )
  );

  // Group live matches by competition
  const groupedByCompetition = liveMatches.reduce<Record<string, MatchFixture[]>>(
    (acc, match) => {
      if (!acc[match.competition]) acc[match.competition] = [];
      acc[match.competition].push(match);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-4 pb-10">
      {/* Top Header Row (matches desk-live.webp & phone-live.webp) */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-[#0C1E26] border border-[#173340] hover:border-[#2CE5FF]/50 flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors"
            aria-label="Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-3.5 py-2 rounded-xl bg-[#0C1E26] border border-[#173340] text-xs font-bold text-white">
            Live now
          </div>
        </div>

        {/* Competition filter + "Nothing live" empty state simulator toggle */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCompetition}
            onChange={(e) => setSelectedCompetition(e.target.value)}
            className="h-9 px-3 rounded-xl bg-[#0C1E26] border border-[#173340] text-xs font-semibold text-[#E2E8F0] focus:outline-none focus:border-[#2CE5FF]"
          >
            <option value="all">All competitions</option>
            {availableCompetitions.map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onToggleNothingLive}
            className={`px-3 py-2 rounded-xl text-[11px] font-semibold border transition-colors ${
              nothingLiveSimulated
                ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#FCD34D]'
                : 'bg-[#0C1E26] border-[#173340] text-[#94A3B8] hover:text-white'
            }`}
            title="Contest Requirement: Nothing live -> show Starting soon"
          >
            {nothingLiveSimulated
              ? 'Showing: Nothing Live (Fallback)'
              : 'Test "Nothing Live" State'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search teams, players or leagues"
          className="w-full h-11 pl-10 pr-9 rounded-xl bg-[#0C1E26] border border-[#173340] focus:border-[#2CE5FF] focus:outline-none text-xs text-white placeholder-[#64748B]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sport Filter Tabs (matches desk-live.webp: All 13, Soccer 6, Tennis 3, Basketball 1...) */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#0C1E26] border border-[#173340] overflow-x-auto no-scrollbar">
        {LIVE_SPORT_FILTERS.map((sport) => {
          const isActive = selectedSport === sport.id;
          return (
            <button
              key={sport.id}
              type="button"
              onClick={() => {
                setSelectedSport(sport.id);
                setSelectedCompetition('all');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-[#133240] text-white border border-[#1E495C]'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#102631]'
              }`}
            >
              {sport.id === 'all' && <Tv className="w-3.5 h-3.5 text-[#2CE5FF]" />}
              {sport.id === 'soccer' && <SoccerBallIcon className="w-3.5 h-3.5" />}
              {sport.id === 'tennis' && <TennisBallIcon className="w-3.5 h-3.5" />}
              {sport.id === 'basketball' && (
                <BasketballIcon className="w-3.5 h-3.5" />
              )}
              {sport.id === 'american_football' && (
                <AmericanFootballIcon className="w-3.5 h-3.5" />
              )}
              {sport.id === 'esports' && <Gamepad2 className="w-3.5 h-3.5" />}
              <span>{sport.label}</span>
              <span
                className={`font-mono-num text-[11px] ${
                  isActive ? 'text-[#2CE5FF] font-bold' : 'text-[#64748B]'
                }`}
              >
                {nothingLiveSimulated ? 0 : sport.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Contest Requirement: "Nothing live: show Starting soon" */}
      {liveMatches.length === 0 ? (
        <div className="space-y-4">
          <div className="rounded-xl bg-[#0C1E26] border border-[#173340] p-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#132B36] text-[#2CE5FF] flex items-center justify-center mx-auto">
              <CalendarClock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Nothing live right now
            </h3>
            <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
              There are no matches currently in play for your filter. Check out the upcoming fixtures starting soon below.
            </p>
            {nothingLiveSimulated && (
              <button
                type="button"
                onClick={onToggleNothingLive}
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#133240] text-[#2CE5FF] text-xs font-semibold hover:bg-[#194152]"
              >
                Restore 13 Live Matches
              </button>
            )}
          </div>

          {/* Starting Soon Fallback List */}
          <div className="rounded-xl bg-[#0C1E26] border border-[#173340] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#16303D]">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-[#2CE5FF]" />
                <span className="text-xs font-bold text-white">Starting soon</span>
                <span className="text-[11px] text-[#64748B] font-mono-num">
                  {startingSoonMatches.length} matches
                </span>
              </div>
              <span className="hidden @md:inline text-[11px] text-[#94A3B8] mr-44">
                Match result
              </span>
            </div>
            {startingSoonMatches.map((match, idx) => (
              <div key={match.id} className={idx === 0 ? '[&>div]:border-t-0' : ''}>
                <DesktopMatchRow
                  match={match}
                  selectedOptionIds={selectedOptionIds}
                  onToggleOdd={onToggleOdd}
                  onOpenMatch={onOpenMatch}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Grouped Live Competitions (matches desk-live.webp & phone-live.webp) */
        <div className="space-y-4">
          {Object.entries(groupedByCompetition).map(([competition, compMatches]) => {
            const isCompFollowed = followedCompetitions.includes(competition);
            return (
              <div
                key={competition}
                className="rounded-xl bg-[#0C1E26] border border-[#173340] overflow-hidden"
              >
                {/* Competition Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#16303D]">
                  <div className="flex items-center gap-2">
                    <LeagueBadge competition={competition} />
                    <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
                    <h3 className="text-xs font-bold text-white">{competition}</h3>
                    <span className="text-[11px] text-[#64748B] font-mono-num">
                      {compMatches.length}{' '}
                      {compMatches.length === 1 ? 'match' : 'matches'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleFollowCompetition(competition)}
                      className="text-[#64748B] hover:text-[#FACC15] transition-colors ml-1"
                      title={`Follow ${competition}`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          isCompFollowed ? 'fill-[#FACC15] text-[#FACC15]' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-16">
                    <span className="hidden @md:inline text-[11px] text-[#94A3B8]">
                      Match result
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (compMatches[0]?.sport === 'soccer') {
                          onNavigateFootball();
                        } else {
                          setSelectedSport(compMatches[0]?.sport || 'all');
                        }
                      }}
                      className="text-xs font-semibold text-[#94A3B8] hover:text-white flex items-center gap-0.5"
                    >
                      <span>View all</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Desktop Table Rows */}
                <div className="hidden @md:block">
                  {compMatches.map((match, idx) => (
                    <div
                      key={match.id}
                      className={idx === 0 ? '[&>div]:border-t-0' : ''}
                    >
                      <DesktopMatchRow
                        match={match}
                        selectedOptionIds={selectedOptionIds}
                        onToggleOdd={onToggleOdd}
                        onOpenMatch={onOpenMatch}
                      />
                    </div>
                  ))}
                </div>

                {/* Mobile Horizontal Cards (matches phone-live.webp) */}
                <div className="flex @md:hidden gap-3 p-3 overflow-x-auto no-scrollbar">
                  {compMatches.map((match) => (
                    <FeaturedMatchCard
                      key={match.id}
                      match={match}
                      selectedOptionIds={selectedOptionIds}
                      onToggleOdd={onToggleOdd}
                      onOpenMatch={onOpenMatch}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
