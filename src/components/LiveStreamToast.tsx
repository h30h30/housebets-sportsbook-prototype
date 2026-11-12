import React from 'react';
import { ArrowRight, Radio, X } from 'lucide-react';
import { LiveEventNotification } from '../data/sportsbookData';
import { HousebetsLogomark, TeamCrest } from './BrandAssets';

interface LiveStreamToastProps {
  event: LiveEventNotification | null;
  onClose: () => void;
  onOpenMatch: (matchId: string) => void;
  isPhoneFrame?: boolean;
}

export const LiveStreamToast: React.FC<LiveStreamToastProps> = ({
  event,
  onClose,
  onOpenMatch,
  isPhoneFrame = false,
}) => {
  if (!event) return null;

  const badgeColors = {
    emerald: 'bg-emerald-500 text-[#061116]',
    cyan: 'bg-[#2CE5FF] text-[#061116]',
    amber: 'bg-[#FACC15] text-[#061116]',
    rose: 'bg-[#E11D48] text-white',
  };

  const borderColors = {
    emerald: 'border-emerald-400/60',
    cyan: 'border-[#2CE5FF]/60',
    amber: 'border-[#FACC15]/60',
    rose: 'border-[#FB7185]/60',
  };

  return (
    <div
      className={`${
        isPhoneFrame
          ? 'absolute top-16 left-3 right-3 z-50'
          : 'fixed top-16 right-4 xl:right-[356px] z-50 w-[330px] sm:w-[360px]'
      } animate-in fade-in slide-in-from-top-3 duration-200`}
    >
      <div
        className={`rounded-2xl bg-[#08171E]/95 backdrop-blur-md border-2 ${
          borderColors[event.badgeColor]
        } shadow-2xl overflow-hidden text-white`}
      >
        {/* Top Broadcast Bar */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#0C212B] border-b border-[#173645]">
          <div className="flex items-center gap-2 min-w-0">
            <HousebetsLogomark className="w-3.5 h-3.5" />
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
                badgeColors[event.badgeColor]
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>{event.badge}</span>
            </span>
            <span className="text-[11px] font-semibold text-[#94A3B8] truncate">
              {event.competition} · {event.clock}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#94A3B8] hover:text-white p-0.5"
            aria-label="Dismiss live alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body: Live Score Box + Event Headline */}
        <div className="p-3.5 space-y-2.5">
          {/* Mini Broadcast Scoreboard */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#0C1E26] border border-[#173340]">
            <div className="flex items-center gap-2 min-w-0">
              <TeamCrest team={event.homeTeam} size="sm" />
              <span className="text-xs font-bold text-white truncate max-w-[95px]">
                {event.homeTeam}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#061116] border border-[#1D3B4A] font-mono-num text-xs font-extrabold">
              <span className="text-[#2CE5FF]">{event.homeScore}</span>
              <span className="text-[#64748B]">-</span>
              <span className="text-white">{event.awayScore}</span>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold text-white truncate max-w-[95px]">
                {event.awayTeam}
              </span>
              <TeamCrest team={event.awayTeam} size="sm" />
            </div>
          </div>

          <div>
            <div className="text-xs font-extrabold text-white leading-snug">
              {event.title}
            </div>
            <div className="text-[11px] text-[#94A3B8] mt-0.5">
              {event.subtitle}
            </div>
          </div>

          {/* Action Row: Jump to Match + Live Odd */}
          <div className="flex items-center justify-between pt-1">
            {event.featuredOddLabel && event.featuredOddValue && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#142B36] border border-[#1D3B4A] text-[11px]">
                <span className="text-[#CBD5E1]">{event.featuredOddLabel}</span>
                <span className="font-mono-num font-extrabold text-[#2CE5FF]">
                  {event.featuredOddValue.toFixed(2)}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                onOpenMatch(event.matchId);
                onClose();
              }}
              className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#A7F3D0] hover:bg-[#6EE7B7] text-[#061116] text-[11px] font-extrabold transition-colors"
            >
              <span>View Match</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
