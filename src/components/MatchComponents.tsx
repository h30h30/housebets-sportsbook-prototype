import React from 'react';
import { Check, ChevronRight, Lock, Star, TrendingDown, TrendingUp } from 'lucide-react';
import { MatchFixture, OddOption } from '../data/sportsbookData';
import { TeamCrest } from './BrandAssets';

interface OddsButtonProps {
  option: OddOption;
  isSelected: boolean;
  onSelect: (option: OddOption) => void;
  compact?: boolean;
  stacked?: boolean;
  matchSuspended?: boolean;
}

export const OddsButton: React.FC<OddsButtonProps> = ({
  option,
  isSelected,
  onSelect,
  compact = false,
  stacked = false,
  matchSuspended = false,
}) => {
  const isSuspended = matchSuspended || option.suspended;

  if (isSuspended) {
    return (
      <button
        type="button"
        disabled
        className={`flex items-center justify-center gap-1.5 rounded-lg bg-[#10232D] border border-[#1B3847] text-[#F59E0B] opacity-85 cursor-not-allowed select-none ${
          compact ? 'px-2.5 py-2 text-xs' : 'px-3.5 py-2.5 text-xs'
        } w-full`}
      >
        <Lock className="w-3.5 h-3.5 shrink-0" />
        <span className="font-medium whitespace-nowrap">Suspended</span>
      </button>
    );
  }

  const flashClass =
    option.drift === 'up'
      ? 'odds-flash-up'
      : option.drift === 'down'
      ? 'odds-flash-down'
      : '';

  if (stacked) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(option);
        }}
        className={`group relative flex flex-col justify-between items-start rounded-lg px-3 py-2 text-left transition-all duration-150 select-none w-full min-w-0 border ${flashClass} ${
          isSelected
            ? 'bg-[#1290B8] border-[#38BDF8] text-white shadow-sm'
            : 'bg-[#142B36] hover:bg-[#1A3644] border-[#1D3B4A]/70 text-[#E2E8F0]'
        }`}
      >
        <div className="flex items-center justify-between w-full gap-1">
          <span
            className={`text-[11px] leading-tight truncate ${
              isSelected ? 'text-white font-medium' : 'text-[#94A3B8] group-hover:text-white'
            }`}
          >
            {option.shortLabel || option.label}
          </span>
          {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span
            className={`font-mono-num text-[13px] font-bold leading-none ${
              isSelected ? 'text-white' : 'text-[#2CE5FF]'
            }`}
          >
            {option.odds.toFixed(2)}
          </span>
          {option.drift === 'up' && (
            <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
          )}
          {option.drift === 'down' && (
            <TrendingDown className="w-3 h-3 text-rose-400 shrink-0" />
          )}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(option);
      }}
      className={`group relative flex items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-left transition-all duration-150 select-none w-full min-w-0 border ${flashClass} ${
        isSelected
          ? 'bg-[#1290B8] border-[#38BDF8] text-white shadow-sm'
          : 'bg-[#142B36] hover:bg-[#1A3644] border-[#1D3B4A]/70 text-[#E2E8F0]'
      }`}
    >
      <span
        className={`text-xs truncate ${
          isSelected ? 'text-white font-semibold' : 'text-[#CBD5E1] group-hover:text-white'
        }`}
      >
        {option.label}
      </span>
      <div className="flex items-center gap-1.5 shrink-0">
        {option.drift === 'up' && (
          <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
        )}
        {option.drift === 'down' && (
          <TrendingDown className="w-3 h-3 text-rose-400 shrink-0" />
        )}
        <span
          className={`font-mono-num text-xs font-bold ${
            isSelected ? 'text-white' : 'text-[#2CE5FF]'
          }`}
        >
          {option.odds.toFixed(2)}
        </span>
        {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 -mr-0.5" />}
      </div>
    </button>
  );
};

interface DesktopMatchRowProps {
  match: MatchFixture;
  selectedOptionIds: Set<string>;
  onToggleOdd: (match: MatchFixture, marketName: string, option: OddOption) => void;
  onOpenMatch: (matchId: string) => void;
  isStarred?: boolean;
  onToggleStar?: (teamOrMatch: string) => void;
  activeMarketType?: '1x2' | 'dc' | 'tg';
}

export const DesktopMatchRow: React.FC<DesktopMatchRowProps> = ({
  match,
  selectedOptionIds,
  onToggleOdd,
  onOpenMatch,
  isStarred = false,
  onToggleStar,
  activeMarketType = '1x2',
}) => {
  const oddsToRender =
    activeMarketType === 'dc' && match.doubleChanceOdds
      ? match.doubleChanceOdds
      : activeMarketType === 'tg' && match.totalGoalsOdds
      ? match.totalGoalsOdds
      : match.mainOdds;

  const marketLabel =
    activeMarketType === 'dc'
      ? 'Double chance'
      : activeMarketType === 'tg'
      ? 'Total goals'
      : 'Match result';

  return (
    <div
      onClick={() => onOpenMatch(match.id)}
      className="group flex flex-col @md:flex-row @md:items-center justify-between gap-3 px-3.5 @md:px-4 py-3 hover:bg-[#112631]/60 transition-colors cursor-pointer border-t border-[#16303D]"
    >
      {/* Left: Time / Live badge + Teams + Scores */}
      <div className="flex items-center justify-between @md:justify-start gap-3 flex-1 min-w-0">
        {/* Status column */}
        <div className="w-14 @md:w-16 shrink-0 flex flex-col items-start justify-center">
          {match.isLive ? (
            <>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold tracking-wider bg-[#E11D48] text-white leading-none">
                LIVE
              </span>
              <span className="font-mono-num text-[11px] text-[#CBD5E1] mt-1 font-medium">
                {match.clock}
              </span>
            </>
          ) : (
            <>
              <span className="font-mono-num text-xs font-semibold text-[#E2E8F0]">
                {match.kickoffTime}
              </span>
              <span className="text-[11px] text-[#64748B] mt-0.5 truncate max-w-full">
                {match.kickoffDate}
              </span>
            </>
          )}
        </div>

        {/* Teams */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <TeamCrest team={match.homeTeam} size="sm" />
            <span className="text-xs font-semibold text-white truncate">
              {match.homeTeam}
            </span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <TeamCrest team={match.awayTeam} size="sm" />
            <span className="text-xs font-semibold text-white truncate">
              {match.awayTeam}
            </span>
          </div>
        </div>

        {/* Favorite Star or Live Scores */}
        <div className="flex items-center gap-2.5 shrink-0 pr-1">
          {onToggleStar && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(match.homeTeam);
              }}
              className="p-1 rounded hover:bg-[#193544] text-[#64748B] hover:text-[#FACC15] transition-colors"
              title="Follow team"
            >
              <Star
                className={`w-4 h-4 ${
                  isStarred ? 'fill-[#FACC15] text-[#FACC15]' : ''
                }`}
              />
            </button>
          )}
          {match.isLive && (
            <div className="flex flex-col items-end gap-1.5 font-mono-num text-xs font-bold w-5">
              <span className="text-white">{match.homeScore ?? 0}</span>
              <span className="text-[#64748B]">{match.awayScore ?? 0}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Odds Columns + Extra Market Count */}
      <div className="flex items-center gap-2 w-full @md:w-[440px] @lg:w-[490px] shrink-0">
        {match.suspended ? (
          <div className="flex-1 flex items-center justify-center gap-2 h-[42px] rounded-lg bg-[#10232D] border border-[#1B3847] text-[#F59E0B] text-xs font-semibold select-none">
            <Lock className="w-3.5 h-3.5" />
            <span>Suspended</span>
          </div>
        ) : (
          <div
            className={`flex-1 grid gap-2 ${
              oddsToRender.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
            }`}
          >
            {oddsToRender.map((opt) => (
              <OddsButton
                key={opt.id}
                option={opt}
                isSelected={selectedOptionIds.has(opt.id)}
                onSelect={(o) => onToggleOdd(match, marketLabel, o)}
                stacked
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenMatch(match.id);
          }}
          className="w-12 @md:w-14 h-[42px] flex items-center justify-end gap-0.5 text-[11px] font-mono-num font-semibold text-[#94A3B8] hover:text-white transition-colors shrink-0"
        >
          <span>+{match.extraMarketsCount}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

interface FeaturedMatchCardProps {
  match: MatchFixture;
  selectedOptionIds: Set<string>;
  onToggleOdd: (match: MatchFixture, marketName: string, option: OddOption) => void;
  onOpenMatch: (matchId: string) => void;
  isStarred?: boolean;
  onToggleStar?: (team: string) => void;
}

export const FeaturedMatchCard: React.FC<FeaturedMatchCardProps> = ({
  match,
  selectedOptionIds,
  onToggleOdd,
  onOpenMatch,
  isStarred = false,
  onToggleStar,
}) => {
  return (
    <div
      onClick={() => onOpenMatch(match.id)}
      className="flex flex-col justify-between rounded-xl bg-[#0C1E26] border border-[#173340] hover:border-[#234B5E] p-3.5 transition-all cursor-pointer min-w-[265px] @sm:min-w-[290px] flex-1"
    >
      {/* Top Meta Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          {match.isLive ? (
            <>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#E11D48] text-white leading-none">
                LIVE
              </span>
              <span className="font-mono-num text-xs font-bold text-white">
                {match.clock}
              </span>
              <span className="text-[11px] text-[#64748B] truncate">
                · {match.competition}
              </span>
            </>
          ) : (
            <>
              <span className="text-[11px] text-[#94A3B8] truncate">
                {match.competition}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!match.isLive && (
            <span className="font-mono-num text-[11px] text-[#94A3B8]">
              {match.kickoffDate} · {match.kickoffTime}
            </span>
          )}
          {onToggleStar && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(match.homeTeam);
              }}
              className="text-[#64748B] hover:text-[#FACC15] transition-colors"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  isStarred ? 'fill-[#FACC15] text-[#FACC15]' : ''
                }`}
              />
            </button>
          )}
          <span className="font-mono-num text-[11px] text-[#94A3B8] flex items-center">
            +{match.extraMarketsCount}
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Teams + Score */}
      <div className="space-y-2 mb-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <TeamCrest team={match.homeTeam} size="sm" />
            <span className="text-xs font-bold text-white truncate">
              {match.homeTeam}
            </span>
          </div>
          {match.isLive && (
            <span className="font-mono-num text-xs font-bold text-white px-1.5 py-0.5 rounded bg-[#112631]">
              {match.homeScore ?? 0}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <TeamCrest team={match.awayTeam} size="sm" />
            <span className="text-xs font-bold text-white truncate">
              {match.awayTeam}
            </span>
          </div>
          {match.isLive && (
            <span className="font-mono-num text-xs font-bold text-[#94A3B8] px-1.5 py-0.5 rounded bg-[#112631]">
              {match.awayScore ?? 0}
            </span>
          )}
        </div>
      </div>

      {/* 1x2 Odds */}
      {match.suspended ? (
        <div className="flex items-center justify-center gap-1.5 h-[42px] rounded-lg bg-[#10232D] border border-[#1B3847] text-[#F59E0B] text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>Suspended</span>
        </div>
      ) : (
        <div
          className={`grid gap-1.5 ${
            match.mainOdds.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
          }`}
        >
          {match.mainOdds.map((opt) => (
            <OddsButton
              key={opt.id}
              option={opt}
              isSelected={selectedOptionIds.has(opt.id)}
              onSelect={(o) => onToggleOdd(match, 'Match result', o)}
              stacked
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Authentic Sport Ball Vector Icons (matching 24x24 Lucide stroke style)
export const SoccerBallIcon: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.85"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9.5" />
    <polygon
      points="12,7.6 16.2,10.6 14.6,15.4 9.4,15.4 7.8,10.6"
      fill="currentColor"
      fillOpacity="0.18"
    />
    <line x1="12" y1="7.6" x2="12" y2="2.6" />
    <line x1="16.2" y1="10.6" x2="21" y2="9.1" />
    <line x1="14.6" y1="15.4" x2="17.8" y2="19.6" />
    <line x1="9.4" y1="15.4" x2="6.2" y2="19.6" />
    <line x1="7.8" y1="10.6" x2="3" y2="9.1" />
  </svg>
);

export const TennisBallIcon: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.85"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9.5" />
    <path d="M5.3 5.3c3.5 3.5 3.5 9.9 0 13.4" />
    <path d="M18.7 5.3c-3.5 3.5-3.5 9.9 0 13.4" />
  </svg>
);

export const BasketballIcon: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.85"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9.5" />
    <line x1="2.5" y1="12" x2="21.5" y2="12" />
    <line x1="12" y1="2.5" x2="12" y2="21.5" />
    <path d="M5.5 5.1c3 4 3 9.8 0 13.8" />
    <path d="M18.5 5.1c-3 4-3 9.8 0 13.8" />
  </svg>
);

export const AmericanFootballIcon: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.85"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M19.8 4.2c-5.2-1.8-11 0.4-14.2 3.6S0.2 16.8 2 22c5.2 1.8 11-0.4 14.2-3.6s5.4-9 3.6-14.2z" />
    <line x1="8.8" y1="15.2" x2="15.2" y2="8.8" />
    <line x1="9.5" y1="11.5" x2="12.5" y2="14.5" />
    <line x1="11.5" y1="9.5" x2="14.5" y2="12.5" />
  </svg>
);

