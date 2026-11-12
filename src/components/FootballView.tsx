import React, { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react';
import { MatchFixture, OddOption } from '../data/sportsbookData';
import { LeagueBadge } from './BrandAssets';
import { DesktopMatchRow, FeaturedMatchCard } from './MatchComponents';

interface FootballViewProps {
  matches: MatchFixture[];
  selectedOptionIds: Set<string>;
  onToggleOdd: (match: MatchFixture, marketName: string, option: OddOption) => void;
  onOpenMatch: (matchId: string) => void;
  onBack: () => void;
  followedTeams: string[];
  followedCompetitions: string[];
  onToggleFollowTeam: (team: string) => void;
  onToggleFollowCompetition: (comp: string) => void;
  initialCompetition?: string;
}

const REQUIRED_COMPETITIONS = [
  'Premier League',
  'Champions League',
  'LaLiga',
  'Serie A',
  'Bundesliga',
];

export const FootballView: React.FC<FootballViewProps> = ({
  matches,
  selectedOptionIds,
  onToggleOdd,
  onOpenMatch,
  onBack,
  followedTeams,
  followedCompetitions,
  onToggleFollowTeam,
  onToggleFollowCompetition,
  initialCompetition = 'all',
}) => {
  const [subTab, setSubTab] = useState<'live_upcoming' | 'all'>('live_upcoming');
  const [selectedCompetition, setSelectedCompetition] =
    useState<string>(initialCompetition);
  const [marketType, setMarketType] = useState<'1x2' | 'dc' | 'tg'>('1x2');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedCompetition(initialCompetition);
  }, [initialCompetition]);

  const soccerMatches = matches.filter((m) => m.sport === 'soccer');

  const filteredMatches = soccerMatches.filter((m) => {
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

  const liveCount = soccerMatches.filter((m) => m.isLive).length;

  const competitionsToRender =
    selectedCompetition === 'all'
      ? REQUIRED_COMPETITIONS
      : [selectedCompetition];

  return (
    <div className="space-y-4 pb-10">
      {/* Top Bar (matches desk-football.webp & phone-football.webp) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-[#0C1E26] border border-[#173340] hover:border-[#2CE5FF]/50 flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors"
            aria-label="Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0C1E26] border border-[#173340] text-xs font-bold text-white">
            <span>Soccer</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
          </div>

          <span className="hidden @sm:inline text-xs text-[#94A3B8]">
            5 competitions · {liveCount} live
          </span>
        </div>

        {/* Market Switcher (Desktop & Mobile) */}
        <div className="flex items-center gap-2">
          <span className="hidden @md:inline-flex items-center gap-1.5 text-xs text-[#94A3B8]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Market</span>
          </span>
          <select
            value={marketType}
            onChange={(e) => setMarketType(e.target.value as '1x2' | 'dc' | 'tg')}
            className="h-9 px-3 rounded-xl bg-[#0C1E26] border border-[#173340] text-xs font-semibold text-white focus:outline-none focus:border-[#2CE5FF]"
          >
            <option value="1x2">Match result</option>
            <option value="dc">Double chance</option>
            <option value="tg">Total goals</option>
          </select>
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

      {/* Tabs + All competitions dropdown (matches desk-football.webp) */}
      <div className="flex flex-col @sm:flex-row items-stretch @sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#0C1E26] border border-[#173340] flex-1">
          <button
            type="button"
            onClick={() => setSubTab('live_upcoming')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'live_upcoming'
                ? 'bg-[#133240] text-white border border-[#1E495C]'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <span>Live & Upcoming</span>
            <span className="font-mono-num text-[11px] text-[#2CE5FF] font-bold">
              {liveCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('all')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'all'
                ? 'bg-[#133240] text-white border border-[#1E495C]'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <span>All Soccer</span>
            <span className="font-mono-num text-[11px] text-[#64748B]">
              {soccerMatches.length}
            </span>
          </button>
        </div>

        <select
          value={selectedCompetition}
          onChange={(e) => setSelectedCompetition(e.target.value)}
          className="h-11 px-3.5 rounded-xl bg-[#0C1E26] border border-[#173340] text-xs font-semibold text-white focus:outline-none focus:border-[#2CE5FF] @sm:w-52"
        >
          <option value="all">All competitions (5)</option>
          {REQUIRED_COMPETITIONS.map((comp) => (
            <option key={comp} value={comp}>
              {comp}
            </option>
          ))}
        </select>
      </div>

      {/* 5 Competitions Sections: Premier League, Champions League, LaLiga, Serie A, Bundesliga */}
      <div className="space-y-4">
        {competitionsToRender.map((competition) => {
          const compMatches = filteredMatches.filter(
            (m) => m.competition === competition
          );
          if (compMatches.length === 0) return null;

          const isCompFollowed = followedCompetitions.includes(competition);
          const marketHeaderLabel =
            marketType === 'dc'
              ? 'Double chance'
              : marketType === 'tg'
              ? 'Total goals'
              : 'Match result';

          return (
            <div
              key={competition}
              className="rounded-xl bg-[#0C1E26] border border-[#173340] overflow-hidden"
            >
              {/* Competition Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#16303D]">
                <div className="flex items-center gap-2">
                  <LeagueBadge competition={competition} />
                  <h3 className="text-xs font-bold text-white">{competition}</h3>
                  <span className="hidden @sm:inline text-[11px] text-[#64748B] font-mono-num">
                    {compMatches.length} matches
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleFollowCompetition(competition)}
                    className="text-[#64748B] hover:text-[#FACC15] transition-colors ml-1"
                    title={
                      isCompFollowed
                        ? `Unfollow ${competition}`
                        : `Follow ${competition}`
                    }
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
                    {marketHeaderLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCompetition((prev) =>
                        prev === competition ? 'all' : competition
                      )
                    }
                    className="text-xs font-semibold text-[#94A3B8] hover:text-white flex items-center gap-0.5"
                  >
                    <span>
                      {selectedCompetition === competition
                        ? 'Show all leagues'
                        : `View all ${compMatches.length}`}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Desktop Rows */}
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
                      isStarred={followedTeams.includes(match.homeTeam)}
                      onToggleStar={onToggleFollowTeam}
                      activeMarketType={marketType}
                    />
                  </div>
                ))}
              </div>

              {/* Mobile Horizontal Cards (matches phone-football.webp) */}
              <div className="flex @md:hidden gap-3 p-3 overflow-x-auto no-scrollbar">
                {compMatches.map((match) => (
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
          );
        })}
      </div>
    </div>
  );
};
