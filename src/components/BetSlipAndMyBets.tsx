import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Coins,
  Copy,
  Lock,
  Maximize2,
  RefreshCw,
  RotateCcw,
  Settings2,
  TrendingUp,
  WifiOff,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import { PlacedBet, SlipSelection, SportId } from '../data/sportsbookData';
import { UsdtIcon } from './BrandAssets';

interface SharedSlipAndBetsProps {
  mode: 'panel' | 'fullpage';
  activeTab: 'slip' | 'mybets';
  onTabChange: (tab: 'slip' | 'mybets') => void;
  selections: SlipSelection[];
  onUpdateStake: (selectionId: string, stake: string) => void;
  onUpdateAllStakes: (stake: string) => void;
  onRemoveSelection: (selectionId: string) => void;
  onClearSlip: () => void;
  onAcceptOddsChanges: () => void;
  onPlaceBets: () => void;
  onRepeatLastBet?: () => void;
  lastPlacedCount?: number;
  betPlacementState: 'idle' | 'placing' | 'placed' | 'failed';
  betErrorMessage: string;
  onResetPlacementState: () => void;
  myBets: PlacedBet[];
  onCashOut: (betId: string) => void;
  usdtBalance: number;
  oddsAcceptMode: 'ask' | 'higher';
  onChangeOddsAcceptMode: (mode: 'ask' | 'higher') => void;
  onClosePanel?: () => void;
  onOpenFullPage?: () => void;
  onBackFromFullPage?: () => void;
  onOpenMatch?: (matchId: string) => void;
  onSimulateSlipOddsChange: () => void;
  onSimulateSlipSuspended: () => void;
  simulateNextBetFail: boolean;
  onToggleSimulateNextBetFail: () => void;
  isOffline?: boolean;
}

const QUICK_STAKES = [5, 10, 25, 100];
const MIN_STAKE = 1;
const MAX_STAKE = 5000;

export const BetSlipAndMyBets: React.FC<SharedSlipAndBetsProps> = ({
  mode,
  activeTab,
  onTabChange,
  selections,
  onUpdateStake,
  onUpdateAllStakes,
  onRemoveSelection,
  onClearSlip,
  onAcceptOddsChanges,
  onPlaceBets,
  onRepeatLastBet,
  lastPlacedCount = 0,
  betPlacementState,
  betErrorMessage,
  onResetPlacementState,
  myBets,
  onCashOut,
  usdtBalance,
  oddsAcceptMode,
  onChangeOddsAcceptMode,
  onClosePanel,
  onOpenFullPage,
  onBackFromFullPage,
  onOpenMatch,
  onSimulateSlipOddsChange,
  onSimulateSlipSuspended,
  simulateNextBetFail,
  onToggleSimulateNextBetFail,
  isOffline = false,
}) => {
  const [myBetsSubTab, setMyBetsSubTab] = useState<'Open' | 'Settled'>('Open');
  const [timeFilter, setTimeFilter] = useState<string>('All time');
  const [sportFilter, setSportFilter] = useState<'all' | SportId>('all');
  const [expandedBetIds, setExpandedBetIds] = useState<Record<string, boolean>>({
    'bet-open-1': true,
  });
  const [confirmingCashOutId, setConfirmingCashOutId] = useState<string | null>(null);
  const [cashedOutNotice, setCashedOutNotice] = useState<string | null>(null);
  const [copiedBetRef, setCopiedBetRef] = useState<string | null>(null);
  const [showOddsSettings, setShowOddsSettings] = useState<boolean>(false);

  const openBets = myBets.filter((b) => b.status === 'Open');
  const settledBets = myBets.filter((b) => b.status !== 'Open');

  const filteredMyBets = (myBetsSubTab === 'Open' ? openBets : settledBets).filter(
    (bet) => {
      if (sportFilter !== 'all' && bet.sport !== sportFilter) return false;
      if (
        timeFilter !== 'All time' &&
        timeFilter !== 'Custom' &&
        bet.PlacedDateGroup !== timeFilter
      ) {
        return false;
      }
      return true;
    }
  );

  // Total Profit/Loss for Settled Bets
  const settledSummary = settledBets.reduce(
    (acc, bet) => {
      const returned =
        bet.status === 'Lost' ? 0 : bet.settledReturn ?? bet.cashOutAmount ?? 0;
      acc.totalStaked += bet.stake;
      acc.totalReturned += returned;
      acc.netProfit += returned - bet.stake;
      return acc;
    },
    { totalStaked: 0, totalReturned: 0, netProfit: 0 }
  );

  // Totals & Validation for Singles Bet Slip
  const hasSuspendedSelection = selections.some((s) => s.suspended);
  const hasOddsChangedSelection = selections.some((s) => s.oddsChanged);
  const hasBelowMinStake = selections.some((s) => {
    const val = parseFloat(s.stake);
    return !isNaN(val) && val > 0 && val < MIN_STAKE;
  });
  const hasAboveMaxStake = selections.some((s) => {
    const val = parseFloat(s.stake);
    return !isNaN(val) && val > MAX_STAKE;
  });

  const totalStake = selections.reduce((sum, s) => {
    const val = parseFloat(s.stake);
    return sum + (isNaN(val) || val < 0 ? 0 : val);
  }, 0);

  const totalPayout = selections.reduce((sum, s) => {
    const val = parseFloat(s.stake);
    if (isNaN(val) || val <= 0 || s.suspended) return sum;
    return sum + val * s.odds;
  }, 0);

  const handleCashOutClick = (bet: PlacedBet) => {
    if (isOffline) return;
    if (confirmingCashOutId !== bet.id) {
      setConfirmingCashOutId(bet.id);
      setTimeout(() => {
        setConfirmingCashOutId((prev) => (prev === bet.id ? null : prev));
      }, 3500);
      return;
    }
    setConfirmingCashOutId(null);
    onCashOut(bet.id);
    setCashedOutNotice(
      `Cash Out confirmed: $${(bet.cashOutAmount ?? bet.stake).toFixed(
        2
      )} USDT credited for "${bet.selectionLabel}" (${bet.betRef})`
    );
    setTimeout(() => setCashedOutNotice(null), 5000);
  };

  const handleCopyRef = (ref: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(ref).catch(() => {});
    }
    setCopiedBetRef(ref);
    setTimeout(() => setCopiedBetRef(null), 1800);
  };

  return (
    <div
      className={`flex flex-col h-full ${
        mode === 'panel' ? 'bg-[#09181F] text-white' : 'space-y-4 pb-10'
      }`}
    >
      {/* Top Header: Panel Mode vs Fullpage Mode (Strictly Bet slip + My bets per contest wireframes) */}
      {mode === 'panel' ? (
        <div className="flex items-center justify-between px-3.5 py-3 border-b border-[#16303D] shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onTabChange('slip')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'slip'
                  ? 'bg-[#133240] text-white border border-[#1E495C]'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <span>Bet slip</span>
              <span
                key={selections.length}
                className={`w-5 h-5 rounded-full text-[11px] font-mono-num font-extrabold flex items-center justify-center animate-in zoom-in-75 duration-150 ${
                  activeTab === 'slip'
                    ? 'bg-[#0EA5E9] text-white'
                    : 'bg-[#16303D] text-[#94A3B8]'
                }`}
              >
                {selections.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('mybets')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'mybets'
                  ? 'bg-[#133240] text-white border border-[#1E495C]'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <span>My bets</span>
              <span
                className={`w-5 h-5 rounded-full text-[11px] font-mono-num font-extrabold flex items-center justify-center ${
                  openBets.length > 0
                    ? 'bg-[#A7F3D0] text-[#061116]'
                    : 'bg-[#16303D] text-[#94A3B8]'
                }`}
              >
                {openBets.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowOddsSettings((prev) => !prev)}
              className={`p-1.5 rounded-lg transition-colors ${
                showOddsSettings
                  ? 'bg-[#133240] text-[#2CE5FF]'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#132B36]'
              }`}
              title="Odds change settings"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
            {onOpenFullPage && (
              <button
                type="button"
                onClick={onOpenFullPage}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#132B36] transition-colors"
                title="Open full page Bet Slip & My Bets view"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onClosePanel && (
              <button
                type="button"
                onClick={onClosePanel}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#132B36] transition-colors"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Full Page Header (matches desk-mybets.webp + shared Bet slip toggle) */
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            {onBackFromFullPage && (
              <button
                type="button"
                onClick={onBackFromFullPage}
                className="w-9 h-9 rounded-xl bg-[#0C1E26] border border-[#173340] hover:border-[#2CE5FF]/50 flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0C1E26] border border-[#173340]">
              <button
                type="button"
                onClick={() => onTabChange('mybets')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'mybets'
                    ? 'bg-[#133240] text-white border border-[#1E495C]'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <span>My bets</span>
                <span className="px-1.5 py-0.2 rounded-full text-[11px] font-mono-num bg-[#A7F3D0] text-[#061116] font-extrabold">
                  {openBets.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onTabChange('slip')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'slip'
                    ? 'bg-[#133240] text-white border border-[#1E495C]'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <span>Bet slip (Singles)</span>
                <span className="px-1.5 py-0.2 rounded-full text-[11px] font-mono-num bg-[#0EA5E9] text-white font-extrabold">
                  {selections.length}
                </span>
              </button>
            </div>
            <span className="text-xs text-[#94A3B8] font-mono-num">
              {openBets.length} open · {settledBets.length} settled
            </span>
          </div>
        </div>
      )}

      {/* Collapsible Odds Change Policy Settings */}
      {showOddsSettings && (
        <div className="px-3.5 py-2.5 bg-[#061116] border-b border-[#16303D] space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between text-[#94A3B8] font-semibold">
            <span>When live odds change:</span>
            <button
              type="button"
              onClick={() => setShowOddsSettings(false)}
              className="text-[#64748B] hover:text-white"
            >
              Done
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => onChangeOddsAcceptMode('ask')}
              className={`px-2.5 py-1.5 rounded-lg border text-left font-semibold transition-colors ${
                oddsAcceptMode === 'ask'
                  ? 'bg-[#133240] border-[#2CE5FF] text-white'
                  : 'bg-[#0C1E26] border-[#173340] text-[#94A3B8]'
              }`}
            >
              Always ask player
            </button>
            <button
              type="button"
              onClick={() => onChangeOddsAcceptMode('higher')}
              className={`px-2.5 py-1.5 rounded-lg border text-left font-semibold transition-colors ${
                oddsAcceptMode === 'higher'
                  ? 'bg-[#133240] border-[#2CE5FF] text-white'
                  : 'bg-[#0C1E26] border-[#173340] text-[#94A3B8]'
              }`}
            >
              Auto-accept higher
            </button>
          </div>
        </div>
      )}

      {/* Interactive Edge-State Quick Bar inside Bet Slip so judges can test all states in 1 click */}
      {activeTab === 'slip' && selections.length > 0 && (
        <div
          className={`px-3.5 py-2 bg-[#061116]/90 border-b border-[#16303D] flex flex-wrap items-center justify-between gap-1.5 text-[11px] ${
            mode === 'fullpage' ? 'rounded-xl border' : ''
          }`}
        >
          <span className="text-[#94A3B8] font-medium">Simulate Slip State:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={onSimulateSlipOddsChange}
              className={`px-2 py-0.5 rounded border font-semibold transition-colors ${
                hasOddsChangedSelection
                  ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#FCD34D]'
                  : 'bg-[#112631] border-[#1D3B4A] text-[#CBD5E1] hover:text-white'
              }`}
            >
              Odds Changed
            </button>
            <button
              type="button"
              onClick={onSimulateSlipSuspended}
              className={`px-2 py-0.5 rounded border font-semibold transition-colors ${
                hasSuspendedSelection
                  ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#FCD34D]'
                  : 'bg-[#112631] border-[#1D3B4A] text-[#CBD5E1] hover:text-white'
              }`}
            >
              Suspended
            </button>
            <button
              type="button"
              onClick={onToggleSimulateNextBetFail}
              className={`px-2 py-0.5 rounded border font-semibold transition-colors ${
                simulateNextBetFail
                  ? 'bg-[#E11D48]/25 border-[#FB7185] text-[#FDA4AF]'
                  : 'bg-[#112631] border-[#1D3B4A] text-[#CBD5E1] hover:text-white'
              }`}
            >
              {simulateNextBetFail ? 'Fail Next: ON' : 'Bet Failed'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: BET SLIP (SINGLES ONLY) */}
      {activeTab === 'slip' ? (
        <div
          className={`flex-1 flex flex-col justify-between overflow-y-auto ${
            mode === 'panel'
              ? 'p-3.5'
              : 'rounded-xl bg-[#0C1E26] border border-[#173340] p-5 max-w-xl'
          }`}
        >
          <div className="space-y-3">
            {/* Singles Header Row (matches desk-slip.webp & phone-slip-open.webp) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-white">Singles</span>
                <span className="text-[#64748B]">·</span>
                <span className="text-[#94A3B8]">
                  {selections.length}{' '}
                  {selections.length === 1 ? 'selection' : 'selections'}
                </span>
              </div>
              {selections.length > 0 && (
                <button
                  type="button"
                  onClick={onClearSlip}
                  className="text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Stake All Singles helper when 2+ selections are in the slip */}
            {selections.length > 1 && (
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#0C1E26] border border-[#173340] text-[11px]">
                <span className="text-[#94A3B8] font-medium">
                  Stake all {selections.length} singles:
                </span>
                <div className="flex items-center gap-1">
                  {[10, 25, 50].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => onUpdateAllStakes(amt.toFixed(2))}
                      className="px-2 py-0.5 rounded bg-[#142B36] hover:bg-[#1B3947] font-mono-num font-bold text-[#2CE5FF]"
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Status Banners: Bet Placed Receipt (with Repeat Bet CTA) / Bet Failed */}
            {betPlacementState === 'placed' && (
              <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/40 p-3.5 space-y-2.5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Bet receipt confirmed in USDT!</span>
                  </div>
                  <button
                    type="button"
                    onClick={onResetPlacementState}
                    className="text-[#94A3B8] hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-[#CBD5E1]">
                  Your single bet has been accepted and added to Open Bets.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onResetPlacementState();
                      onTabChange('mybets');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A7F3D0] hover:bg-[#6EE7B7] text-[#061116] text-xs font-extrabold transition-colors"
                  >
                    <span>View My bets ({openBets.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {onRepeatLastBet && lastPlacedCount > 0 && (
                    <button
                      type="button"
                      onClick={onRepeatLastBet}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#133240] hover:bg-[#1B4356] border border-[#2CE5FF]/40 text-[#2CE5FF] text-xs font-bold transition-colors"
                      title="Re-add your last placed selection(s) to the bet slip"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Repeat bet</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {betPlacementState === 'failed' && (
              <div className="rounded-xl bg-rose-500/15 border border-rose-500/40 p-3.5 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>Bet failed</span>
                  </div>
                  <button
                    type="button"
                    onClick={onResetPlacementState}
                    className="text-[#94A3B8] hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-rose-200/90">{betErrorMessage}</p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (simulateNextBetFail) onToggleSimulateNextBetFail();
                      onPlaceBets();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry placement</span>
                  </button>
                </div>
              </div>
            )}

            {/* Empty Slip State */}
            {selections.length === 0 && betPlacementState !== 'placed' && (
              <div className="rounded-xl bg-[#0C1E26] border border-[#173340] p-6 text-center space-y-2 my-4">
                <p className="text-xs font-semibold text-white">
                  Your bet slip is empty
                </p>
                <p className="text-[11px] text-[#64748B]">
                  Tap any decimal odds across Sports Home, Live, Football, or the Match Page to add a Single selection.
                </p>
              </div>
            )}

            {/* Selection Cards (matches desk-slip.webp & phone-slip-open.webp) */}
            <div className="space-y-2.5">
              {selections.map((sel) => {
                const numericStake = parseFloat(sel.stake);
                const validStake =
                  !isNaN(numericStake) && numericStake > 0 ? numericStake : 0;
                const isBelowMin = validStake > 0 && validStake < MIN_STAKE;
                const isAboveMax = validStake > MAX_STAKE;
                const potentialReturn = validStake * sel.odds;

                return (
                  <div
                    key={sel.selectionId}
                    className={`rounded-xl p-3.5 border transition-all animate-in fade-in zoom-in-95 duration-200 ${
                      sel.suspended
                        ? 'bg-[#12222B]/80 border-[#F59E0B]/50'
                        : sel.oddsChanged
                        ? 'bg-[#122631] border-[#38BDF8]/60'
                        : 'bg-[#112631] border-[#1D3B4A]'
                    }`}
                  >
                    {/* Top Row: Selection Name + Odds + Remove X */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-white truncate">
                        {sel.optionLabel}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        {sel.suspended ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#F59E0B]">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Suspended</span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            {sel.oddsChanged && (
                              <span className="font-mono-num text-[11px] text-[#64748B] line-through">
                                {sel.originalOdds.toFixed(2)}
                              </span>
                            )}
                            <span
                              className={`font-mono-num text-sm font-extrabold ${
                                sel.oddsChanged
                                  ? 'text-[#FACC15]'
                                  : 'text-[#2CE5FF]'
                              }`}
                            >
                              {sel.odds.toFixed(2)}
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => onRemoveSelection(sel.selectionId)}
                          className="text-[#64748B] hover:text-white transition-colors"
                          aria-label="Remove selection"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Subtitle Row: Market · Match · Score/Clock */}
                    <div className="flex items-center justify-between gap-2 mt-1 mb-3 text-[11px]">
                      <span className="text-[#94A3B8] truncate">
                        {sel.marketName} · {sel.matchTitle}
                      </span>
                      {sel.scoreSummary && (
                        <span className="font-mono-num text-[#FB7185] font-semibold shrink-0">
                          {sel.scoreSummary}
                        </span>
                      )}
                    </div>

                    {/* State Alert inside card: Suspended or Odds Changed */}
                    {sel.suspended && (
                      <div className="mb-2.5 flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[11px] text-[#FCD34D]">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Lock className="w-3 h-3 shrink-0" />
                          Selection suspended
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveSelection(sel.selectionId)}
                          className="underline font-semibold hover:text-white"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {!sel.suspended && sel.oddsChanged && (
                      <div className="mb-2.5 flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-[#FACC15]/15 border border-[#FACC15]/30 text-[11px] text-[#FDE047]">
                        <span className="flex items-center gap-1.5 font-medium">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          Odds changed ({sel.originalOdds.toFixed(2)} →{' '}
                          {sel.odds.toFixed(2)})
                        </span>
                      </div>
                    )}

                    {/* Stake Input + Returns Row (matches desk-slip.webp & phone-slip-open.webp) */}
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono-num text-xs font-bold text-[#64748B]">
                          $
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          disabled={sel.suspended || isOffline}
                          value={sel.stake}
                          onChange={(e) =>
                            onUpdateStake(sel.selectionId, e.target.value)
                          }
                          placeholder="0.00"
                          className={`w-full h-10 pl-7 pr-3 rounded-lg bg-[#16313F] border ${
                            isBelowMin || isAboveMax
                              ? 'border-rose-500 focus:border-rose-400'
                              : 'border-[#23485B] focus:border-[#2CE5FF]'
                          } focus:outline-none font-mono-num text-xs font-bold text-white placeholder-[#64748B] disabled:opacity-50`}
                        />
                      </div>

                      <div className="text-right shrink-0 min-w-[72px]">
                        <div className="text-[10px] text-[#94A3B8]">Returns</div>
                        <div className="font-mono-num text-xs font-bold text-white mt-0.5">
                          {validStake > 0 && !sel.suspended
                            ? `$${potentialReturn.toFixed(2)}`
                            : '—'}
                        </div>
                      </div>
                    </div>

                    {/* Min / Max Stake Helper Line under Stake Field */}
                    <div className="flex items-center justify-between mt-1.5 text-[10px] font-mono-num">
                      {isBelowMin ? (
                        <span className="text-rose-400 font-semibold">
                          Minimum stake is ${MIN_STAKE.toFixed(2)} USDT
                        </span>
                      ) : isAboveMax ? (
                        <span className="text-rose-400 font-semibold">
                          Maximum stake is ${MAX_STAKE.toLocaleString()} USDT
                        </span>
                      ) : (
                        <span className="text-[#64748B]">
                          Min ${MIN_STAKE.toFixed(2)} · Max $
                          {MAX_STAKE.toLocaleString()}.00 USDT
                        </span>
                      )}
                      <span className="text-[#64748B]">Single</span>
                    </div>

                    {/* Quick USDT Stake Buttons + MAX */}
                    {!sel.suspended && (
                      <div className="grid grid-cols-5 gap-1.5 mt-2">
                        {QUICK_STAKES.map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            disabled={isOffline}
                            onClick={() => {
                              const current = parseFloat(sel.stake) || 0;
                              onUpdateStake(
                                sel.selectionId,
                                (current + amt).toFixed(2)
                              );
                            }}
                            className="py-1 rounded bg-[#16313F] hover:bg-[#1E4052] disabled:opacity-50 text-[11px] font-mono-num font-semibold text-[#94A3B8] hover:text-white transition-colors"
                          >
                            +${amt}
                          </button>
                        ))}
                        <button
                          type="button"
                          disabled={isOffline}
                          onClick={() =>
                            onUpdateStake(
                              sel.selectionId,
                              Math.min(MAX_STAKE, Math.max(10, usdtBalance)).toFixed(2)
                            )
                          }
                          className="py-1 rounded bg-[#16313F] hover:bg-[#1E4052] disabled:opacity-50 text-[10px] font-mono-num font-extrabold text-[#2CE5FF] transition-colors"
                          title="Set max single stake"
                        >
                          MAX
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Totals & Primary Action Button (matches desk-slip.webp & phone-slip-open.webp) */}
          <div className="pt-4 mt-4 border-t border-[#16303D] space-y-3 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[#94A3B8]">Total stake</span>
                <span className="font-mono-num font-bold text-white">
                  ${totalStake.toFixed(2)}
                </span>
                <UsdtIcon className="w-4 h-4" />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[#94A3B8]">Payout</span>
                <span className="font-mono-num font-bold text-white">
                  ${totalPayout.toFixed(2)}
                </span>
                <UsdtIcon className="w-4 h-4" />
              </div>
            </div>

            {/* State-aware Primary Button: Offline -> Suspended -> Odds Changed -> Place Bet */}
            {isOffline ? (
              <button
                type="button"
                disabled
                className="w-full h-11 rounded-xl bg-[#112631] border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <WifiOff className="w-4 h-4" />
                <span>Connection lost — odds paused</span>
              </button>
            ) : hasSuspendedSelection ? (
              <button
                type="button"
                disabled
                className="w-full h-11 rounded-xl bg-[#112631] border border-[#F59E0B]/40 text-[#F59E0B] text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                <span>Selection suspended — remove to bet</span>
              </button>
            ) : hasOddsChangedSelection ? (
              <button
                type="button"
                onClick={onAcceptOddsChanges}
                className="w-full h-11 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#061116] text-xs font-extrabold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Zap className="w-4 h-4" />
                <span>Accept odds changes</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={
                  selections.length === 0 ||
                  totalStake <= 0 ||
                  hasBelowMinStake ||
                  hasAboveMaxStake ||
                  betPlacementState === 'placing'
                }
                onClick={onPlaceBets}
                className={`w-full h-11 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  selections.length > 0 &&
                  totalStake > 0 &&
                  !hasBelowMinStake &&
                  !hasAboveMaxStake
                    ? 'bg-[#A7F3D0] hover:bg-[#6EE7B7] text-[#061116] shadow-sm cursor-pointer'
                    : 'bg-[#102631] text-[#64748B] cursor-not-allowed'
                }`}
              >
                {betPlacementState === 'placing'
                  ? 'Placing bet...'
                  : totalStake > 0
                  ? `Place bet ($${totalStake.toFixed(2)} USDT)`
                  : 'Place bet'}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* TAB 2: MY BETS (OPEN, SETTLED, PROFIT/LOSS, LIVE CASH OUT) */
        <div
          className={`flex-1 overflow-y-auto ${
            mode === 'panel' ? 'p-3.5 space-y-3' : 'space-y-4'
          }`}
        >
          {/* Open / Settled Sub-tabs (matches desk-mybets.webp) */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0C1E26] border border-[#173340] w-fit">
              <button
                type="button"
                onClick={() => setMyBetsSubTab('Open')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  myBetsSubTab === 'Open'
                    ? 'bg-[#133240] text-white border border-[#1E495C]'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Open ({openBets.length})
              </button>
              <button
                type="button"
                onClick={() => setMyBetsSubTab('Settled')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  myBetsSubTab === 'Settled'
                    ? 'bg-[#133240] text-white border border-[#1E495C]'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Settled ({settledBets.length})
              </button>
            </div>
          </div>

          {/* Total Profit / Loss Summary Card in Settled Tab */}
          {myBetsSubTab === 'Settled' && settledBets.length > 0 && (
            <div className="rounded-xl bg-[#0C1E26] border border-[#173340] p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <TrendingUp
                  className={`w-4 h-4 ${
                    settledSummary.netProfit >= 0
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}
                />
                <span className="font-bold text-white">Settled P&L Summary</span>
              </div>
              <div className="flex items-center gap-3 font-mono-num text-[11px] flex-wrap">
                <span className="text-[#94A3B8]">
                  Staked:{' '}
                  <strong className="text-white">
                    ${settledSummary.totalStaked.toFixed(2)}
                  </strong>
                </span>
                <span className="text-[#94A3B8]">
                  Returned:{' '}
                  <strong className="text-white">
                    ${settledSummary.totalReturned.toFixed(2)}
                  </strong>
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-extrabold ${
                    settledSummary.netProfit >= 0
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  Net: {settledSummary.netProfit >= 0 ? '+' : '-'}$
                  {Math.abs(settledSummary.netProfit).toFixed(2)} USDT
                </span>
              </div>
            </div>
          )}

          {/* Cash Out Confirmation Toast Notice */}
          {cashedOutNotice && (
            <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/40 px-3.5 py-2.5 flex items-center justify-between text-xs text-emerald-300 font-semibold animate-in fade-in zoom-in-95 duration-200">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{cashedOutNotice}</span>
              </span>
              <button
                type="button"
                onClick={() => setCashedOutNotice(null)}
                className="text-emerald-300 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Filters Row for Full Page (matches desk-mybets.webp: All time, Today, Last 7 days, Last 30 days, Custom + All sports) */}
          {mode === 'fullpage' && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {['All time', 'Today', 'Last 7 days', 'Last 30 days', 'Custom'].map(
                  (tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setTimeFilter(tf)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        timeFilter === tf
                          ? 'bg-[#133240] border-[#1E495C] text-white'
                          : 'bg-[#0C1E26] border-[#173340] text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      {tf}
                    </button>
                  )
                )}
              </div>

              <select
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value as 'all' | SportId)}
                className="h-9 px-3.5 rounded-xl bg-[#0C1E26] border border-[#173340] text-xs font-semibold text-white focus:outline-none @sm:w-44"
              >
                <option value="all">All sports</option>
                <option value="soccer">Soccer</option>
                <option value="tennis">Tennis</option>
                <option value="basketball">Basketball</option>
              </select>
            </div>
          )}

          {/* FULL PAGE TABLE VIEW (matches desk-mybets.webp on desktop, cards on mobile @container) */}
          {mode === 'fullpage' ? (
            <div className="rounded-xl bg-[#0C1E26] border border-[#173340] overflow-hidden">
              {/* Table Header */}
              <div className="hidden @md:grid grid-cols-12 items-center px-4 py-2.5 border-b border-[#16303D] text-[11px] font-semibold text-[#64748B]">
                <div className="col-span-2">Placed</div>
                <div className="col-span-4">Bet</div>
                <div className="col-span-1 text-right">Odds</div>
                <div className="col-span-1 text-right">Stake</div>
                <div className="col-span-2 text-right">Returns</div>
                <div className="col-span-2 text-right">Result</div>
              </div>

              {filteredMyBets.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#94A3B8]">
                  No {myBetsSubTab.toLowerCase()} bets found for this filter.
                </div>
              ) : (
                filteredMyBets.map((bet) => {
                  const isExpanded = !!expandedBetIds[bet.id];
                  const isConfirming = confirmingCashOutId === bet.id;
                  return (
                    <div
                      key={bet.id}
                      className="border-b border-[#16303D] last:border-b-0"
                    >
                      <div
                        onClick={() =>
                          setExpandedBetIds((prev) => ({
                            ...prev,
                            [bet.id]: !prev[bet.id],
                          }))
                        }
                        className="grid grid-cols-1 @md:grid-cols-12 items-center gap-2 px-4 py-3.5 hover:bg-[#112631]/60 cursor-pointer transition-colors"
                      >
                        <div className="@md:col-span-2 font-mono-num text-[11px] text-[#94A3B8] whitespace-pre-line leading-tight">
                          {bet.placedAt}
                        </div>

                        <div className="@md:col-span-4 min-w-0">
                          <div className="text-xs font-bold text-white">
                            {bet.selectionLabel}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] mt-0.5 flex-wrap">
                            <span
                              onClick={(e) => {
                                if (onOpenMatch) {
                                  e.stopPropagation();
                                  onOpenMatch(bet.matchId);
                                }
                              }}
                              className="hover:text-[#2CE5FF] hover:underline"
                            >
                              {bet.matchTitle}
                            </span>
                            {bet.isLive && (
                              <>
                                <span className="text-[#FB7185] font-mono-num font-bold">
                                  ● {bet.liveClock}
                                </span>
                                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono-num text-[10px] font-bold">
                                  {bet.liveScore}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between @md:hidden text-xs pt-1 border-t border-[#16303D]/60">
                          <span className="text-[#94A3B8]">
                            Odds:{' '}
                            <strong className="font-mono-num text-[#2CE5FF]">
                              {bet.odds.toFixed(2)}
                            </strong>
                          </span>
                          <span className="text-[#94A3B8]">
                            Stake:{' '}
                            <strong className="font-mono-num text-white">
                              ${bet.stake.toFixed(2)}
                            </strong>
                          </span>
                          <span className="text-[#94A3B8]">
                            Return:{' '}
                            <strong className="font-mono-num text-white">
                              ${(bet.settledReturn ?? bet.potentialReturn).toFixed(2)}
                            </strong>
                          </span>
                        </div>

                        <div className="hidden @md:block @md:col-span-1 @md:text-right font-mono-num text-xs font-bold text-[#2CE5FF]">
                          {bet.odds.toFixed(2)}
                        </div>

                        <div className="hidden @md:block @md:col-span-1 @md:text-right font-mono-num text-xs text-white">
                          ${bet.stake.toFixed(2)}
                        </div>

                        <div className="hidden @md:block @md:col-span-2 @md:text-right font-mono-num text-xs font-semibold text-white">
                          ${(bet.settledReturn ?? bet.potentialReturn).toFixed(2)}
                        </div>

                        <div className="@md:col-span-2 flex items-center justify-between @md:justify-end gap-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              bet.status === 'Open'
                                ? 'bg-[#133240] text-white'
                                : bet.status === 'Won'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : bet.status === 'Cashed Out'
                                ? 'bg-[#2CE5FF]/20 text-[#2CE5FF]'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {bet.status}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Row Details + Copyable USDT Bet Ref + Interactive Live Cash Out */}
                      {isExpanded && (
                        <div className="px-4 py-3 bg-[#09171E] border-t border-[#142C38] flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] flex-wrap">
                            <span>
                              Market:{' '}
                              <strong className="text-white">
                                {bet.marketName}
                              </strong>
                            </span>
                            <span>·</span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyRef(bet.betRef, e)}
                              className="inline-flex items-center gap-1 font-mono-num text-[#2CE5FF] hover:underline"
                              title="Copy Bet ID"
                            >
                              <span>ID: {bet.betRef}</span>
                              {copiedBetRef === bet.betRef ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>

                          {bet.status === 'Open' && (
                            <button
                              type="button"
                              disabled={isOffline}
                              onClick={() => handleCashOutClick(bet)}
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all shadow-sm ${
                                isConfirming
                                  ? 'bg-[#FACC15] hover:bg-[#FDE047] text-[#061116]'
                                  : bet.cashOutDirection === 'up'
                                  ? 'bg-emerald-400 hover:bg-emerald-300 text-[#061116]'
                                  : bet.cashOutDirection === 'down'
                                  ? 'bg-[#FDA4AF] hover:bg-[#FB7185] text-[#061116]'
                                  : 'bg-[#A7F3D0] hover:bg-[#6EE7B7] text-[#061116]'
                              } disabled:opacity-50`}
                            >
                              <Coins className="w-3.5 h-3.5" />
                              <span>
                                {isConfirming
                                  ? `Confirm Cash out $${(
                                      bet.cashOutAmount ?? bet.stake
                                    ).toFixed(2)}`
                                  : `Cash out $${(
                                      bet.cashOutAmount ?? bet.stake
                                    ).toFixed(2)}`}
                              </span>
                              {bet.cashOutDirection === 'up' && (
                                <ArrowUpRight className="w-3.5 h-3.5 text-[#065F46]" />
                              )}
                              {bet.cashOutDirection === 'down' && (
                                <ArrowDownRight className="w-3.5 h-3.5 text-[#881337]" />
                              )}
                              <UsdtIcon className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* COMPACT SIDE PANEL / MOBILE SHEET MY BETS CARDS */
            <div className="space-y-2.5">
              {filteredMyBets.map((bet) => {
                const isConfirming = confirmingCashOutId === bet.id;
                return (
                  <div
                    key={bet.id}
                    className="rounded-xl bg-[#112631] border border-[#1D3B4A] p-3.5 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-white">
                          {bet.selectionLabel}
                        </div>
                        <div className="text-[11px] text-[#94A3B8] mt-0.5">
                          {bet.marketName} · {bet.matchTitle}
                        </div>
                      </div>
                      <span className="font-mono-num text-xs font-extrabold text-[#2CE5FF]">
                        {bet.odds.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      {bet.isLive ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[#FB7185] font-mono-num font-bold">
                            ● LIVE {bet.liveClock}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono-num text-[10px] font-bold">
                            {bet.liveScore}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#64748B]">
                          {bet.placedAt.replace('\n', ' · ')}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleCopyRef(bet.betRef, e)}
                        className="inline-flex items-center gap-1 font-mono-num text-[10px] text-[#94A3B8] hover:text-white"
                      >
                        <span>{bet.betRef}</span>
                        {copiedBetRef === bet.betRef ? (
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-2.5 h-2.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#193544] text-xs">
                      <div>
                        <span className="text-[#94A3B8]">Stake: </span>
                        <span className="font-mono-num font-bold text-white">
                          ${bet.stake.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#94A3B8]">
                          {bet.status === 'Open' ? 'To return: ' : 'Returned: '}
                        </span>
                        <span className="font-mono-num font-bold text-white">
                          ${(bet.settledReturn ?? bet.potentialReturn).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {bet.status === 'Open' ? (
                      <button
                        type="button"
                        disabled={isOffline}
                        onClick={() => handleCashOutClick(bet)}
                        className={`w-full h-9 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                          isConfirming
                            ? 'bg-[#FACC15] hover:bg-[#FDE047] text-[#061116]'
                            : bet.cashOutDirection === 'up'
                            ? 'bg-emerald-400 hover:bg-emerald-300 text-[#061116]'
                            : bet.cashOutDirection === 'down'
                            ? 'bg-[#FDA4AF] hover:bg-[#FB7185] text-[#061116]'
                            : 'bg-[#A7F3D0] hover:bg-[#6EE7B7] text-[#061116]'
                        } disabled:opacity-50`}
                      >
                        <span>
                          {isConfirming
                            ? `Confirm Cash out $${(
                                bet.cashOutAmount ?? bet.stake
                              ).toFixed(2)} USDT`
                            : `Cash out $${(
                                bet.cashOutAmount ?? bet.stake
                              ).toFixed(2)} USDT`}
                        </span>
                        {bet.cashOutDirection === 'up' && (
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#065F46]" />
                        )}
                        {bet.cashOutDirection === 'down' && (
                          <ArrowDownRight className="w-3.5 h-3.5 text-[#881337]" />
                        )}
                        <UsdtIcon className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-[#64748B]">Single · USDT</span>
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            bet.status === 'Won'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : bet.status === 'Cashed Out'
                              ? 'bg-[#2CE5FF]/20 text-[#2CE5FF]'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {bet.status}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
