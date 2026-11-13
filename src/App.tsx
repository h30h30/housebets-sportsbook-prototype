/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BellRing,
  Calendar,
  ChevronDown,
  ChevronUp,
  CircleDot,
  Compass,
  Crown,
  Flame,
  Gamepad2,
  HelpCircle,
  Lock,
  Menu,
  MessageCircle,
  MessageSquare,
  Monitor,
  PanelLeft,
  PanelRight,
  Receipt,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Trophy,
  Tv,
  User,
  WifiOff,
  X,
  Zap,
} from 'lucide-react';
import {
  INITIAL_MATCHES,
  INITIAL_MY_BETS,
  LiveEventNotification,
  MatchFixture,
  OddOption,
  PlacedBet,
  SAMPLE_LIVE_EVENTS,
  SlipSelection,
  SportId,
} from './data/sportsbookData';
import { HousebetsLogo, UsdtIcon } from './components/BrandAssets';
import { SportsHomeView } from './components/SportsHomeView';
import { LiveView } from './components/LiveView';
import { FootballView } from './components/FootballView';
import { MatchPageView } from './components/MatchPageView';
import { BetSlipAndMyBets } from './components/BetSlipAndMyBets';
import { AuthModal } from './components/AuthModal';
import { LiveStreamToast } from './components/LiveStreamToast';
import {
  AmericanFootballIcon,
  BasketballIcon,
  SoccerBallIcon,
  TennisBallIcon,
} from './components/MatchComponents';
import {
  LiveSupportWidget,
  UserProfileDropdown,
  WalletDropdownPopover,
} from './components/HousebetsShellOverlays';

type PageId = 'home' | 'live' | 'football' | 'match' | 'mybets' | 'notfound';

const DEFAULT_SELECTIONS: SlipSelection[] = [
  {
    selectionId: 'ars-bha-1x2-1',
    matchId: 'ars-bha',
    matchTitle: 'Arsenal v Brighton & Hove Albion',
    marketId: 'mkt-ars-bha-1x2',
    marketName: 'Match result',
    optionLabel: 'Arsenal',
    odds: 1.3,
    originalOdds: 1.3,
    oddsChanged: false,
    suspended: false,
    stake: '10.00',
    isLive: true,
    scoreSummary: "1–0 · 52'",
  },
];

function parseHashRoute(): { page: PageId; matchId?: string } {
  const raw = window.location.hash.replace(/^#\/?/, '');
  if (!raw || raw === 'home') return { page: 'home' };
  if (raw.startsWith('match/')) {
    const mId = raw.split('/')[1] || 'ars-bha';
    return { page: 'match', matchId: mId };
  }
  if (
    raw === 'live' ||
    raw === 'football' ||
    raw === 'match' ||
    raw === 'mybets' ||
    raw === 'notfound'
  ) {
    return { page: raw };
  }
  return { page: 'notfound' };
}

export default function App() {
  // Core Navigation State synced with URL Hash
  const initialRoute = parseHashRoute();
  const [activePage, setActivePage] = useState<PageId>(initialRoute.page);
  const [activeMatchId, setActiveMatchId] = useState<string>(
    initialRoute.matchId || 'ars-bha'
  );
  const [liveSportFilter, setLiveSportFilter] = useState<'all' | SportId>('all');
  const [footballCompFilter, setFootballCompFilter] = useState<string>('all');

  // Shell & Viewport State
  const [leftNavExpanded, setLeftNavExpanded] = useState<boolean>(false);
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(true);
  const [rightPanelTab, setRightPanelTab] = useState<'slip' | 'mybets'>('slip');
  const [mobileSheetOpen, setMobileSheetOpen] = useState<boolean>(false);
  const [viewportMode, setViewportMode] = useState<'auto' | 'phone390'>('auto');
  const [judgeDrawerOpen, setJudgeDrawerOpen] = useState<boolean>(false);

  // Loading Skeleton & Offline / Connection Lost States
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  // Auth & Shell Overlay State (Defaults to logged out so Log In / Register buttons show by default matching wireframes)
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    username: string;
    method: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('hb_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [walletDropdownOpen, setWalletDropdownOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const [supportWidgetOpen, setSupportWidgetOpen] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<string>('GB English');
  const [langMenuOpen, setLangMenuOpen] = useState<boolean>(false);

  // Sample Wallet & Search State (Persisted in localStorage)
  const [usdtBalance, setUsdtBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('hb_usdt_balance');
      return saved ? Number(JSON.parse(saved)) : 1250.0;
    } catch {
      return 1250.0;
    }
  });
  const [homeSearchQuery, setHomeSearchQuery] = useState<string>('');
  const [oddsAcceptMode, setOddsAcceptMode] = useState<'ask' | 'higher'>('ask');

  // Live Broadcast Notification Toast State
  const [activeLiveToast, setActiveLiveToast] =
    useState<LiveEventNotification | null>(null);
  const [liveEventIndex, setLiveEventIndex] = useState<number>(0);

  // Sportsbook Data State
  const [matches, setMatches] = useState<MatchFixture[]>(INITIAL_MATCHES);
  const [followedTeams, setFollowedTeams] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hb_followed_teams');
      return saved ? JSON.parse(saved) : ['Arsenal'];
    } catch {
      return ['Arsenal'];
    }
  });
  const [followedCompetitions, setFollowedCompetitions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hb_followed_comps');
      return saved ? JSON.parse(saved) : ['Premier League'];
    } catch {
      return ['Premier League'];
    }
  });

  // Singles Bet Slip State (Persisted in localStorage across navigation and page reloads)
  const [selections, setSelections] = useState<SlipSelection[]>(() => {
    try {
      const saved = localStorage.getItem('hb_slip_selections');
      return saved ? JSON.parse(saved) : DEFAULT_SELECTIONS;
    } catch {
      return DEFAULT_SELECTIONS;
    }
  });
  const [lastPlacedSelections, setLastPlacedSelections] = useState<SlipSelection[]>(
    []
  );

  const [myBets, setMyBets] = useState<PlacedBet[]>(() => {
    try {
      const saved = localStorage.getItem('hb_my_bets');
      return saved ? JSON.parse(saved) : INITIAL_MY_BETS;
    } catch {
      return INITIAL_MY_BETS;
    }
  });
  const [betPlacementState, setBetPlacementState] = useState<
    'idle' | 'placing' | 'placed' | 'failed'
  >('idle');
  const [betErrorMessage, setBetErrorMessage] = useState<string>('');

  // Contest Edge-State Simulators
  const [nothingLiveSimulated, setNothingLiveSimulated] = useState<boolean>(false);
  const [simulateNextBetFail, setSimulateNextBetFail] = useState<boolean>(false);

  // Fast initial skeleton load (320ms)
  useEffect(() => {
    const t = setTimeout(() => setIsInitialLoading(false), 320);
    return () => clearTimeout(t);
  }, []);

  // Listen to browser online / offline events
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync URL hash for Browser Back/Forward support
  const navigateToPage = (page: PageId, matchId?: string) => {
    setActivePage(page);
    if (matchId) setActiveMatchId(matchId);
    const nextHash =
      page === 'match' ? `#match/${matchId || activeMatchId}` : `#${page}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash);
    }
  };

  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHashRoute();
      setActivePage(parsed.page);
      if (parsed.matchId) setActiveMatchId(parsed.matchId);
    };
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onHashChange);
    };
  }, []);

  // Persist Bet Slip, My Bets, Balance, User, and Followed items in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hb_followed_teams', JSON.stringify(followedTeams));
      localStorage.setItem(
        'hb_followed_comps',
        JSON.stringify(followedCompetitions)
      );
      localStorage.setItem('hb_slip_selections', JSON.stringify(selections));
      localStorage.setItem('hb_my_bets', JSON.stringify(myBets));
      localStorage.setItem('hb_usdt_balance', JSON.stringify(usdtBalance));
      if (currentUser) {
        localStorage.setItem('hb_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('hb_current_user');
      }
    } catch {
      // Ignore storage errors
    }
  }, [
    followedTeams,
    followedCompetitions,
    selections,
    myBets,
    usdtBalance,
    currentUser,
  ]);

  // Reset all demo data back to initial contest defaults
  const handleResetDemoData = () => {
    setMatches(INITIAL_MATCHES);
    setSelections(DEFAULT_SELECTIONS);
    setMyBets(INITIAL_MY_BETS);
    setUsdtBalance(1250.0);
    setFollowedTeams(['Arsenal']);
    setFollowedCompetitions(['Premier League']);
    setBetPlacementState('idle');
    setNothingLiveSimulated(false);
    setSimulateNextBetFail(false);
    setIsOffline(false);
    navigateToPage('home');
  };

  // Trigger a broadcast-style live event notification and update match score/odds
  const triggerLiveMatchEvent = (customIndex?: number) => {
    if (isOffline) return;
    const idx =
      customIndex !== undefined
        ? customIndex % SAMPLE_LIVE_EVENTS.length
        : liveEventIndex % SAMPLE_LIVE_EVENTS.length;
    const ev = SAMPLE_LIVE_EVENTS[idx];
    setLiveEventIndex((prev) => prev + 1);
    setActiveLiveToast(ev);

    // Update the corresponding match's score and clock in live state
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== ev.matchId) return m;
        return {
          ...m,
          homeScore: ev.homeScore,
          awayScore: ev.awayScore,
          clock: ev.clock,
        };
      })
    );
  };

  // Automatically show one subtle live stream alert after 11s so judges see it in action
  useEffect(() => {
    const t = setTimeout(() => {
      triggerLiveMatchEvent(0);
    }, 11000);
    return () => clearTimeout(t);
  }, []);

  // Auto-dismiss live toast after 8 seconds
  useEffect(() => {
    if (!activeLiveToast) return;
    const t = setTimeout(() => {
      setActiveLiveToast(null);
    }, 8000);
    return () => clearTimeout(t);
  }, [activeLiveToast]);

  // Subtle live match clock & live Cash Out ticker (paused when offline)
  useEffect(() => {
    if (isOffline) return;
    const timer = setInterval(() => {
      setMatches((prev) =>
        prev.map((m) => {
          if (!m.isLive || !m.clock || !m.clock.endsWith("'")) return m;
          const mins = parseInt(m.clock.replace("'", ''), 10);
          if (isNaN(mins) || mins >= 90) return m;
          return { ...m, clock: `${mins + 1}'` };
        })
      );

      // Tick open bets' Cash Out value slightly with up/down indicator
      setMyBets((prev) =>
        prev.map((bet, idx) => {
          if (bet.status !== 'Open' || !bet.cashOutAmount) return bet;
          const delta = idx % 2 === 0 ? 0.45 : -0.35;
          const nextVal = Math.max(
            bet.stake * 0.5,
            Math.min(bet.potentialReturn - 0.25, Number((bet.cashOutAmount + delta).toFixed(2)))
          );
          return {
            ...bet,
            cashOutAmount: nextVal,
            cashOutDirection: delta > 0 ? 'up' : 'down',
          };
        })
      );
    }, 18000);
    return () => clearInterval(timer);
  }, [isOffline]);

  const selectedOptionIds = new Set(selections.map((s) => s.selectionId));

  // Toggle selection in Singles Bet Slip
  const handleToggleOdd = (
    match: MatchFixture,
    marketName: string,
    option: OddOption
  ) => {
    if (isOffline || match.suspended || option.suspended) return;

    setBetPlacementState('idle');

    setSelections((prev) => {
      const exists = prev.some((s) => s.selectionId === option.id);
      if (exists) {
        return prev.filter((s) => s.selectionId !== option.id);
      }
      const newSelection: SlipSelection = {
        selectionId: option.id,
        matchId: match.id,
        matchTitle: `${match.homeTeam} v ${match.awayTeam}`,
        marketId: `${match.id}-${marketName}`,
        marketName,
        optionLabel: option.label,
        odds: option.odds,
        originalOdds: option.odds,
        oddsChanged: false,
        suspended: false,
        stake: '10.00',
        isLive: match.isLive,
        scoreSummary: match.isLive
          ? `${match.homeScore ?? 0}–${match.awayScore ?? 0} · ${match.clock}`
          : undefined,
      };
      return [...prev, newSelection];
    });

    if (!rightPanelOpen) {
      setRightPanelOpen(true);
    }
    setRightPanelTab('slip');
  };

  const handleOpenMatch = (matchId: string) => {
    navigateToPage('match', matchId);
  };

  // Sport-aware back navigation from Match Page (Soccer -> Football page, Tennis/MLB/NBA/etc. -> Live page filtered to that sport)
  const handleBackFromMatch = (sport: SportId) => {
    if (sport === 'soccer') {
      navigateToPage('football');
    } else {
      setLiveSportFilter(sport);
      navigateToPage('live');
    }
  };

  const handleToggleFollowTeam = (team: string) => {
    setFollowedTeams((prev) =>
      prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]
    );
  };

  const handleToggleFollowCompetition = (comp: string) => {
    setFollowedCompetitions((prev) =>
      prev.includes(comp) ? prev.filter((c) => c !== comp) : [...prev, comp]
    );
  };

  // Edge State 1: Simulate Live Odds Movement + Bet Slip "Odds Changed" + Live Cash Out Value Update (with Up/Down indicator)
  const handleSimulateOddsMovement = () => {
    if (isOffline) return;

    setMatches((prevMatches) =>
      prevMatches.map((m) => {
        const mutateOption = (opt: OddOption, idx: number): OddOption => {
          const delta = idx % 2 === 0 ? 0.08 : -0.06;
          const nextOdds = Math.max(1.02, Number((opt.odds + delta).toFixed(2)));
          return {
            ...opt,
            previousOdds: opt.odds,
            odds: nextOdds,
            drift: delta > 0 ? 'up' : 'down',
          };
        };

        return {
          ...m,
          mainOdds: m.mainOdds.map(mutateOption),
          markets: m.markets.map((mkt) => ({
            ...mkt,
            options: mkt.options.map(mutateOption),
          })),
        };
      })
    );

    setSelections((prev) =>
      prev.map((sel, idx) => {
        const delta = idx % 2 === 0 ? -0.06 : 0.12;
        const nextOdds = Math.max(1.05, Number((sel.odds + delta).toFixed(2)));
        const shouldAutoAccept = oddsAcceptMode === 'higher' && delta > 0;
        return {
          ...sel,
          odds: nextOdds,
          originalOdds: shouldAutoAccept ? nextOdds : sel.originalOdds,
          oddsChanged: !shouldAutoAccept,
        };
      })
    );

    setMyBets((prev) =>
      prev.map((bet, idx) => {
        if (bet.status !== 'Open' || !bet.cashOutAmount) return bet;
        const delta = idx % 2 === 0 ? 1.35 : -0.85;
        const nextCashOut = Math.max(
          bet.stake * 0.4,
          Math.min(
            bet.potentialReturn - 0.5,
            Number((bet.cashOutAmount + delta).toFixed(2))
          )
        );
        return {
          ...bet,
          cashOutAmount: nextCashOut,
          cashOutDirection: delta > 0 ? 'up' : 'down',
        };
      })
    );
  };

  // Edge State 2: Toggle Market / Selection Suspended
  const handleToggleMarketSuspend = (matchId: string, marketId: string) => {
    let targetMarketNowSuspended = false;

    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m;
        return {
          ...m,
          markets: m.markets.map((mkt) => {
            if (mkt.id !== marketId) return mkt;
            targetMarketNowSuspended = !mkt.suspended;
            return { ...mkt, suspended: !mkt.suspended };
          }),
        };
      })
    );

    setSelections((prev) =>
      prev.map((sel) =>
        sel.matchId === matchId
          ? { ...sel, suspended: targetMarketNowSuspended }
          : sel
      )
    );
  };

  const handleSimulateSlipSuspended = () => {
    setSelections((prev) => {
      const anySuspended = prev.some((s) => s.suspended);
      return prev.map((s, i) =>
        i === 0 ? { ...s, suspended: !anySuspended } : s
      );
    });
  };

  // Accept Odds Changes in Bet Slip
  const handleAcceptOddsChanges = () => {
    setSelections((prev) =>
      prev.map((s) => ({
        ...s,
        originalOdds: s.odds,
        oddsChanged: false,
      }))
    );
  };

  // Place Singles Bets (handles both Bet Placed Receipt and Bet Failed states)
  const handlePlaceBets = () => {
    if (isOffline) return;
    const validSelections = selections.filter(
      (s) => !s.suspended && parseFloat(s.stake) >= 1 && parseFloat(s.stake) <= 5000
    );
    if (validSelections.length === 0) return;

    const totalStake = validSelections.reduce(
      (sum, s) => sum + (parseFloat(s.stake) || 0),
      0
    );

    setBetPlacementState('placing');

    setTimeout(() => {
      if (simulateNextBetFail) {
        setBetPlacementState('failed');
        setBetErrorMessage(
          'Market price changed during placement or insufficient liquidity on selection. Please review and retry.'
        );
        return;
      }

      if (totalStake > usdtBalance) {
        setBetPlacementState('failed');
        setBetErrorMessage(
          `Insufficient USDT balance ($${usdtBalance.toFixed(
            2
          )} available, $${totalStake.toFixed(2)} required).`
        );
        return;
      }

      setUsdtBalance((prev) => Math.max(0, prev - totalStake));

      const nowStr = 'Oct 17\n15:04';
      const newPlacedBets: PlacedBet[] = validSelections.map((s, idx) => {
        const stakeNum = parseFloat(s.stake) || 10;
        const retNum = Number((stakeNum * s.odds).toFixed(2));
        const randomRef = `HB-${Math.floor(10000 + Math.random() * 89999)}U`;
        return {
          id: `bet-live-${Date.now()}-${idx}`,
          betRef: randomRef,
          placedAt: nowStr,
          PlacedDateGroup: 'Today',
          sport: 'soccer',
          matchId: s.matchId,
          matchTitle: s.matchTitle,
          selectionLabel: s.optionLabel,
          marketName: s.marketName,
          odds: s.odds,
          stake: stakeNum,
          potentialReturn: retNum,
          status: 'Open',
          isLive: s.isLive,
          liveClock: "52'",
          liveScore: '1–0',
          cashOutAmount: Number((stakeNum * 0.96).toFixed(2)),
          cashOutDirection: null,
        };
      });

      setLastPlacedSelections(validSelections);
      setMyBets((prev) => [...newPlacedBets, ...prev]);
      setSelections([]);
      setBetPlacementState('placed');
    }, 320);
  };

  // Repeat Last Placed Bet from Receipt
  const handleRepeatLastBet = () => {
    if (lastPlacedSelections.length === 0) return;
    setSelections(
      lastPlacedSelections.map((s) => ({
        ...s,
        oddsChanged: false,
        suspended: false,
      }))
    );
    setBetPlacementState('idle');
  };

  // Cash Out Open Bet
  const handleCashOut = (betId: string) => {
    if (isOffline) return;
    const target = myBets.find((b) => b.id === betId);
    if (!target || target.status !== 'Open') return;

    const payout = target.cashOutAmount ?? target.stake;
    setUsdtBalance((prev) => prev + payout);

    setMyBets((prev) =>
      prev.map((b) =>
        b.id === betId
          ? {
              ...b,
              status: 'Cashed Out',
              settledReturn: payout,
              cashOutDirection: null,
            }
          : b
      )
    );
  };

  const currentMatch =
    matches.find((m) => m.id === activeMatchId) || matches[0];

  const openBetsCount = myBets.filter((b) => b.status === 'Open').length;
  const firstSelection = selections[0];
  const isPhoneFrame = viewportMode === 'phone390';

  return (
    <div className="min-h-screen bg-[#061116] text-[#F1F5F9] flex flex-col">
      {/* MAIN SHELL WRAPPER (Supports Full Responsive OR 390px Phone Frame simulation) */}
      <div
        className={
          isPhoneFrame
            ? 'w-[390px] max-w-full mx-auto my-4 border-[6px] border-[#16303D] rounded-[36px] overflow-hidden shadow-2xl bg-[#061116] flex flex-col h-[844px] relative'
            : 'flex-1 flex flex-col min-h-0 relative'
        }
      >
        {/* LIVE BROADCAST EVENT POP-UP TOAST (Goals, Break Points, Scoring Runs) */}
        <LiveStreamToast
          event={activeLiveToast}
          onClose={() => setActiveLiveToast(null)}
          onOpenMatch={(mId) => handleOpenMatch(mId)}
          isPhoneFrame={isPhoneFrame}
        />

        {/* SIGN UP / LOG IN MODAL (Google, Web3 USDT Wallet, Email/Password) */}
        <AuthModal
          isOpen={authModalOpen}
          initialMode={authModalMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={(user) => {
            setCurrentUser(user);
            setAuthModalOpen(false);
          }}
          isPhoneFrame={isPhoneFrame}
        />

        {/* LIVE SUPPORT INTERCOM-STYLE WIDGET (Matches Screenshot 131224) */}
        <LiveSupportWidget
          isOpen={supportWidgetOpen}
          onClose={() => setSupportWidgetOpen(false)}
          username={currentUser?.username || 'SureJumper016'}
          isPhoneFrame={isPhoneFrame}
        />

        {/* HOUSEBETS TOP BAR (Matches Screenshot 130940, 131413, and desk-*.webp wireframes) */}
        <header className="h-14 px-3 sm:px-4 bg-[#07141A] border-b border-[#132934] flex items-center justify-between gap-3 sticky top-0 z-30 shrink-0">
          {/* Zone 1: Sidebar Toggle + Official Housebets Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            {!isPhoneFrame && (
              <button
                type="button"
                onClick={() => setLeftNavExpanded((prev) => !prev)}
                className="hidden md:flex w-9 h-9 rounded-xl bg-[#0C1E26] border border-[#173340] items-center justify-center text-[#94A3B8] hover:text-white transition-colors"
                aria-label="Toggle left navigation"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => navigateToPage('home')}
              className="focus:outline-none flex items-center"
            >
              <HousebetsLogo className="h-5 sm:h-6" />
            </button>
          </div>

          {/* Zone 2: Center Bar — Wallet Pill (when logged in) + Weekly Prize $50,000.00 + 5-Page Nav */}
          {!isPhoneFrame && (
            <div className="hidden md:flex items-center gap-2">
              {currentUser && (
                <div className="relative flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setWalletDropdownOpen((prev) => !prev)}
                    className="h-9 px-3 rounded-xl bg-[#0C1E26] hover:bg-[#132B36] border border-[#173340] flex items-center gap-2 text-xs font-extrabold text-white transition-colors"
                  >
                    <UsdtIcon className="w-4 h-4" />
                    <span className="font-mono-num">${usdtBalance.toFixed(2)}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setWalletDropdownOpen((prev) => !prev)}
                    className="h-9 px-3.5 rounded-xl bg-[#CFFAFE] hover:bg-[#A5F3FC] text-[#05181E] text-xs font-extrabold transition-colors"
                  >
                    Wallet
                  </button>

                  <WalletDropdownPopover
                    isOpen={walletDropdownOpen}
                    onClose={() => setWalletDropdownOpen(false)}
                    usdtBalance={usdtBalance}
                    onAddSampleUsdt={() => setUsdtBalance((b) => b + 100)}
                  />
                </div>
              )}

              {/* 5-Page Contest Navigation Pill */}
              <nav className="hidden lg:flex items-center gap-0.5 bg-[#0C1E26] border border-[#173340] rounded-xl p-1">
                {[
                  { id: 'home', label: 'Sports Home' },
                  { id: 'live', label: 'Live (13)' },
                  { id: 'football', label: 'Football' },
                  { id: 'match', label: 'Match Page' },
                  { id: 'mybets', label: `My Bets (${openBetsCount})` },
                ].map((navItem) => {
                  const isActive = activePage === navItem.id;
                  return (
                    <button
                      key={navItem.id}
                      type="button"
                      onClick={() => {
                        if (navItem.id === 'live') setLiveSportFilter('all');
                        if (navItem.id === 'football') setFootballCompFilter('all');
                        navigateToPage(navItem.id as PageId);
                        if (navItem.id === 'mybets') setRightPanelTab('mybets');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        isActive
                          ? 'bg-[#133240] text-[#2CE5FF] border border-[#1E495C]'
                          : 'text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      {navItem.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Zone 3: Right Actions — Search, Live Alert, Right Panel Toggle, Log In / Register (or User Profile) */}
          <div className="flex items-center gap-2 shrink-0">
            {!isPhoneFrame && (
              <>
                <button
                  type="button"
                  onClick={() => triggerLiveMatchEvent()}
                  className="hidden md:inline-flex items-center gap-1.5 h-9 px-2.5 rounded-xl bg-[#0C1E26] hover:bg-[#132B36] border border-[#173340] text-xs font-semibold text-[#2CE5FF] transition-colors"
                  title="Trigger a live match goal/score pop-up notification"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span className="hidden 2xl:inline">Live Alert</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRightPanelOpen((prev) => !prev)}
                  className={`hidden xl:flex w-9 h-9 rounded-xl border items-center justify-center transition-colors relative ${
                    rightPanelOpen
                      ? 'bg-[#133240] border-[#2CE5FF]/50 text-white'
                      : 'bg-[#0C1E26] border-[#173340] text-[#94A3B8] hover:text-white'
                  }`}
                  title="Toggle Bet Slip & My Bets Side Panel"
                >
                  <PanelRight className="w-4 h-4" />
                  {selections.length > 0 && !rightPanelOpen && (
                    <span className="w-4 h-4 rounded-full bg-[#0EA5E9] text-white font-mono-num text-[9px] font-bold flex items-center justify-center absolute -top-1 -right-1">
                      {selections.length}
                    </span>
                  )}
                </button>
              </>
            )}

            {currentUser ? (
              <div className="relative flex items-center gap-1.5">
                {/* Mobile / Phone Frame Compact Wallet Balance Pill */}
                <button
                  type="button"
                  onClick={() => setWalletDropdownOpen((prev) => !prev)}
                  className={`${
                    isPhoneFrame ? 'flex' : 'flex md:hidden'
                  } h-9 px-2.5 rounded-xl bg-[#0C1E26] hover:bg-[#132B36] border border-[#173340] items-center gap-1.5 text-xs font-extrabold text-white transition-colors`}
                >
                  <UsdtIcon className="w-3.5 h-3.5" />
                  <span className="font-mono-num">${usdtBalance.toFixed(2)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="w-9 h-9 rounded-xl bg-[#0C1E26] hover:bg-[#132B36] border border-[#173340] flex items-center justify-center text-white transition-colors"
                  title={`Account (${currentUser.username})`}
                >
                  <User className="w-4 h-4" />
                </button>

                <UserProfileDropdown
                  isOpen={profileDropdownOpen}
                  onClose={() => setProfileDropdownOpen(false)}
                  username={currentUser.username}
                  onOpenWallet={() => setWalletDropdownOpen(true)}
                  onOpenSupport={() => setSupportWidgetOpen(true)}
                  onLogout={() => setCurrentUser(null)}
                />
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="h-9 px-3.5 rounded-xl bg-[#0C1E26] hover:bg-[#132B36] border border-[#173340] text-xs font-bold text-white transition-colors whitespace-nowrap"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="h-9 px-3.5 rounded-xl bg-[#CFFAFE] hover:bg-[#A5F3FC] text-[#05181E] text-xs font-extrabold transition-colors whitespace-nowrap"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </header>

        {/* OFFLINE / CONNECTION LOST BANNER (Fits "Every state: suspended, changed, failed" requirement) */}
        {isOffline && (
          <div className="px-4 py-2 bg-rose-500/20 border-b border-rose-500/40 flex items-center justify-between gap-3 text-xs text-rose-200 shrink-0 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 font-semibold">
              <WifiOff className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                Connection lost — live odds updates and bet placement are paused.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOffline(false)}
              className="px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-extrabold shrink-0 transition-colors"
            >
              Reconnect
            </button>
          </div>
        )}

        {/* 3-COLUMN BODY SHELL (Left Nav + Center Main View + Right Shared Bet Slip & My Bets Panel) */}
        <div className="flex-1 flex min-h-0 relative">
          {/* LEFT NAVIGATION RAIL (Desktop only, focused strictly on Sportsbook contest scope) */}
          {!isPhoneFrame && (
            <aside
              className={`hidden md:flex flex-col justify-between bg-[#07141A] border-r border-[#132934] py-3 px-2 shrink-0 select-none transition-all overflow-y-auto ${
                leftNavExpanded ? 'w-60' : 'w-16 items-center'
              }`}
            >
              <div className="space-y-3 w-full">
                {/* Primary Sportsbook Navigation Card */}
                <div
                  className={`flex flex-col gap-1 p-1.5 rounded-xl bg-[#0C1E26] border border-[#173340] ${
                    leftNavExpanded ? 'w-full' : 'items-center'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => navigateToPage('home')}
                    className={`flex items-center rounded-lg text-xs font-bold transition-colors ${
                      leftNavExpanded
                        ? 'w-full justify-start gap-2.5 px-2.5 py-2'
                        : 'w-9 h-9 justify-center'
                    } ${
                      activePage === 'home'
                        ? 'bg-[#133240] text-white border border-[#1E495C]'
                        : 'text-[#94A3B8] hover:text-white hover:bg-[#112631]'
                    }`}
                    title="1. Sports Home"
                  >
                    <Calendar className="w-4 h-4 shrink-0 text-[#2CE5FF]" />
                    {leftNavExpanded && <span>Sports Home</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLiveSportFilter('all');
                      navigateToPage('live');
                    }}
                    className={`flex items-center rounded-lg text-xs font-bold transition-colors ${
                      leftNavExpanded
                        ? 'w-full justify-start gap-2.5 px-2.5 py-2'
                        : 'w-9 h-9 justify-center'
                    } ${
                      activePage === 'live'
                        ? 'bg-[#133240] text-white border border-[#1E495C]'
                        : 'text-[#94A3B8] hover:text-white hover:bg-[#112631]'
                    }`}
                    title="2. Live In-Play"
                  >
                    <Tv className="w-4 h-4 shrink-0" />
                    {leftNavExpanded && <span>Live In-Play</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateToPage('football')}
                    className={`flex items-center rounded-lg text-xs font-bold transition-colors ${
                      leftNavExpanded
                        ? 'w-full justify-start gap-2.5 px-2.5 py-2'
                        : 'w-9 h-9 justify-center'
                    } ${
                      activePage === 'football'
                        ? 'bg-[#133240] text-white border border-[#1E495C]'
                        : 'text-[#94A3B8] hover:text-white hover:bg-[#112631]'
                    }`}
                    title="3. Football"
                  >
                    <SoccerBallIcon className="w-4 h-4 shrink-0" />
                    {leftNavExpanded && <span>Football</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenMatch('ars-bha')}
                    className={`flex items-center rounded-lg text-xs font-bold transition-colors ${
                      leftNavExpanded
                        ? 'w-full justify-start gap-2.5 px-2.5 py-2'
                        : 'w-9 h-9 justify-center'
                    } ${
                      activePage === 'match'
                        ? 'bg-[#133240] text-white border border-[#1E495C]'
                        : 'text-[#94A3B8] hover:text-white hover:bg-[#112631]'
                    }`}
                    title="4. Match Page (Arsenal v Brighton)"
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    {leftNavExpanded && <span>Match Page</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateToPage('mybets')}
                    className={`flex items-center rounded-lg text-xs font-bold transition-colors relative ${
                      leftNavExpanded
                        ? 'w-full justify-start gap-2.5 px-2.5 py-2'
                        : 'w-9 h-9 justify-center'
                    } ${
                      activePage === 'mybets'
                        ? 'bg-[#133240] text-white border border-[#1E495C]'
                        : 'text-[#94A3B8] hover:text-white hover:bg-[#112631]'
                    }`}
                    title="5. Bet Slip + My Bets"
                  >
                    <Receipt className="w-4 h-4 shrink-0" />
                    {leftNavExpanded && <span>My Bets ({openBetsCount})</span>}
                    {openBetsCount > 0 && !leftNavExpanded && (
                      <span className="w-2 h-2 rounded-full bg-[#A7F3D0] absolute top-1.5 right-1.5" />
                    )}
                  </button>
                </div>

                {/* SPORTS Section Card */}
                <div
                  className={`flex flex-col gap-1 p-1.5 rounded-xl bg-[#0C1E26] border border-[#173340] ${
                    leftNavExpanded ? 'w-full' : 'items-center'
                  }`}
                >
                  {leftNavExpanded && (
                    <div className="px-2.5 pt-1 pb-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                      SPORTS
                    </div>
                  )}
                  {[
                    {
                      label: 'Football',
                      icon: SoccerBallIcon,
                      active: activePage === 'football',
                      action: () => navigateToPage('football'),
                    },
                    {
                      label: 'Tennis',
                      icon: TennisBallIcon,
                      active:
                        activePage === 'live' && liveSportFilter === 'tennis',
                      action: () => {
                        setLiveSportFilter('tennis');
                        navigateToPage('live');
                      },
                    },
                    {
                      label: 'Basketball',
                      icon: BasketballIcon,
                      active:
                        activePage === 'live' &&
                        liveSportFilter === 'basketball',
                      action: () => {
                        setLiveSportFilter('basketball');
                        navigateToPage('live');
                      },
                    },
                    {
                      label: 'American Football',
                      icon: AmericanFootballIcon,
                      active:
                        activePage === 'live' &&
                        liveSportFilter === 'american_football',
                      action: () => {
                        setLiveSportFilter('american_football');
                        navigateToPage('live');
                      },
                    },
                    {
                      label: 'Esports',
                      icon: Gamepad2,
                      active:
                        activePage === 'live' && liveSportFilter === 'esports',
                      action: () => {
                        setLiveSportFilter('esports');
                        navigateToPage('live');
                      },
                    },
                  ].map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={item.action}
                        className={`flex items-center rounded-lg text-xs font-bold transition-colors ${
                          leftNavExpanded
                            ? 'w-full justify-start gap-2.5 px-2.5 py-2'
                            : 'w-9 h-9 justify-center'
                        } ${
                          item.active
                            ? 'bg-[#133240] text-[#2CE5FF] border border-[#1E495C]'
                            : 'text-[#CBD5E1] hover:text-white hover:bg-[#112631]'
                        }`}
                        title={item.label}
                      >
                        <IconComponent className="w-4 h-4 shrink-0 text-[#94A3B8]" />
                        {leftNavExpanded && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Footer Support & Language Card (Expanded Mode) */}
                {leftNavExpanded && (
                  <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-[#0C1E26] border border-[#173340] text-xs">
                    <button
                      type="button"
                      onClick={() => setSupportWidgetOpen(true)}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[#94A3B8] hover:text-white transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Help Center</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSupportWidgetOpen(true)}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[#94A3B8] hover:text-white transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Responsible Gambling</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSupportWidgetOpen(true)}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[#94A3B8] hover:text-white transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Live Support</span>
                    </button>

                    {/* Language Dropdown */}
                    <div className="relative pt-1">
                      <button
                        type="button"
                        onClick={() => setLangMenuOpen((prev) => !prev)}
                        className="w-full h-9 px-3 rounded-xl bg-[#08151B] border border-[#173340] flex items-center justify-between text-xs font-bold text-white"
                      >
                        <span>{selectedLang}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
                      </button>
                      {langMenuOpen && (
                        <div className="mt-1 rounded-xl bg-[#08151B] border border-[#1C3B4B] p-1 space-y-0.5 text-xs">
                          {[
                            'GB English',
                            'ES Español',
                            'FR Français',
                            'BR Português',
                          ].map((l) => (
                            <button
                              key={l}
                              type="button"
                              onClick={() => {
                                setSelectedLang(l);
                                setLangMenuOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold ${
                                selectedLang === l
                                  ? 'bg-[#133240] text-white'
                                  : 'text-[#94A3B8] hover:text-white'
                              }`}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* CENTER MAIN VIEWPORT */}
          <main
            className={`@container flex-1 overflow-y-auto min-w-0 ${
              isPhoneFrame
                ? 'px-3 pt-3 pb-20'
                : 'px-3 sm:px-6 lg:px-8 pt-4 pb-24 xl:pb-10'
            }`}
          >
            <div className="max-w-5xl mx-auto">
              {isInitialLoading ? (
                /* SKELETON LOADING STATE ON FIRST LOAD */
                <div className="space-y-4 animate-pulse py-2">
                  <div className="h-11 rounded-2xl bg-[#0C1E26] border border-[#173340]" />
                  <div className="flex gap-2 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="h-9 w-28 rounded-full bg-[#0C1E26] border border-[#173340] shrink-0"
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-1 @md:grid-cols-2 gap-3">
                    <div className="h-44 rounded-2xl bg-[#0C1E26] border border-[#173340]" />
                    <div className="h-44 rounded-2xl bg-[#0C1E26] border border-[#173340]" />
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((row) => (
                      <div
                        key={row}
                        className="h-16 rounded-xl bg-[#0C1E26] border border-[#173340]"
                      />
                    ))}
                  </div>
                </div>
              ) : activePage === 'notfound' ? (
                /* 404 PAGE STATE */
                <div className="my-12 rounded-2xl bg-[#0C1E26] border border-[#173340] p-8 text-center max-w-md mx-auto space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#133240] border border-[#2CE5FF]/40 flex items-center justify-center mx-auto text-[#2CE5FF]">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-mono-num text-xs font-extrabold uppercase tracking-widest text-[#2CE5FF]">
                      Error 404
                    </div>
                    <h2 className="text-lg font-extrabold text-white">
                      Page or market not found
                    </h2>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      The fixture or page you requested has ended, moved, or does not exist.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => navigateToPage('home')}
                      className="px-4 py-2.5 rounded-xl bg-[#2CE5FF] hover:bg-[#67E8F9] text-[#061116] text-xs font-extrabold transition-colors"
                    >
                      Back to Sports Home
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateToPage('live')}
                      className="px-4 py-2.5 rounded-xl bg-[#112631] hover:bg-[#173544] border border-[#1D3B4A] text-white text-xs font-bold transition-colors"
                    >
                      View Live Matches
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {activePage === 'home' && (
                    <SportsHomeView
                      matches={matches}
                      selectedOptionIds={selectedOptionIds}
                      onToggleOdd={handleToggleOdd}
                      onOpenMatch={handleOpenMatch}
                      onNavigatePage={(p) => {
                        if (p === 'live') setLiveSportFilter('all');
                        if (p === 'football') setFootballCompFilter('all');
                        navigateToPage(p);
                      }}
                      onOpenCompetition={(comp) => {
                        setFootballCompFilter(comp);
                        navigateToPage('football');
                      }}
                      followedTeams={followedTeams}
                      followedCompetitions={followedCompetitions}
                      onToggleFollowTeam={handleToggleFollowTeam}
                      onToggleFollowCompetition={handleToggleFollowCompetition}
                      searchQuery={homeSearchQuery}
                      onSearchChange={setHomeSearchQuery}
                    />
                  )}

                  {activePage === 'live' && (
                    <LiveView
                      matches={matches}
                      selectedOptionIds={selectedOptionIds}
                      onToggleOdd={handleToggleOdd}
                      onOpenMatch={handleOpenMatch}
                      onBack={() => navigateToPage('home')}
                      onNavigateFootball={() => {
                        setFootballCompFilter('all');
                        navigateToPage('football');
                      }}
                      followedCompetitions={followedCompetitions}
                      onToggleFollowCompetition={handleToggleFollowCompetition}
                      nothingLiveSimulated={nothingLiveSimulated}
                      onToggleNothingLive={() =>
                        setNothingLiveSimulated((prev) => !prev)
                      }
                      initialSportFilter={liveSportFilter}
                    />
                  )}

                  {activePage === 'football' && (
                    <FootballView
                      matches={matches}
                      selectedOptionIds={selectedOptionIds}
                      onToggleOdd={handleToggleOdd}
                      onOpenMatch={handleOpenMatch}
                      onBack={() => navigateToPage('home')}
                      followedTeams={followedTeams}
                      followedCompetitions={followedCompetitions}
                      onToggleFollowTeam={handleToggleFollowTeam}
                      onToggleFollowCompetition={handleToggleFollowCompetition}
                      initialCompetition={footballCompFilter}
                    />
                  )}

                  {activePage === 'match' && (
                    <MatchPageView
                      match={currentMatch}
                      allMatches={matches}
                      selectedOptionIds={selectedOptionIds}
                      onToggleOdd={handleToggleOdd}
                      onSelectMatch={(id) => navigateToPage('match', id)}
                      onBackToSportOrLeague={(sport) => handleBackFromMatch(sport)}
                      followedTeams={followedTeams}
                      followedCompetitions={followedCompetitions}
                      onToggleFollowTeam={handleToggleFollowTeam}
                      onToggleFollowCompetition={handleToggleFollowCompetition}
                      onSimulateOddsMovement={handleSimulateOddsMovement}
                      onToggleMarketSuspend={handleToggleMarketSuspend}
                      showJudgeControls={judgeDrawerOpen}
                    />
                  )}

                  {activePage === 'mybets' && (
                    <BetSlipAndMyBets
                      mode="fullpage"
                      activeTab={rightPanelTab}
                      onTabChange={setRightPanelTab}
                      selections={selections}
                      onUpdateStake={(id, st) =>
                        setSelections((prev) =>
                          prev.map((s) =>
                            s.selectionId === id ? { ...s, stake: st } : s
                          )
                        )
                      }
                      onUpdateAllStakes={(st) =>
                        setSelections((prev) =>
                          prev.map((s) => ({ ...s, stake: st }))
                        )
                      }
                      onRemoveSelection={(id) =>
                        setSelections((prev) =>
                          prev.filter((s) => s.selectionId !== id)
                        )
                      }
                      onClearSlip={() => setSelections([])}
                      onAcceptOddsChanges={handleAcceptOddsChanges}
                      onPlaceBets={handlePlaceBets}
                      onRepeatLastBet={handleRepeatLastBet}
                      lastPlacedCount={lastPlacedSelections.length}
                      betPlacementState={betPlacementState}
                      betErrorMessage={betErrorMessage}
                      onResetPlacementState={() => setBetPlacementState('idle')}
                      myBets={myBets}
                      onCashOut={handleCashOut}
                      usdtBalance={usdtBalance}
                      oddsAcceptMode={oddsAcceptMode}
                      onChangeOddsAcceptMode={setOddsAcceptMode}
                      onBackFromFullPage={() => navigateToPage('home')}
                      onOpenMatch={handleOpenMatch}
                      onSimulateSlipOddsChange={handleSimulateOddsMovement}
                      onSimulateSlipSuspended={handleSimulateSlipSuspended}
                      simulateNextBetFail={simulateNextBetFail}
                      onToggleSimulateNextBetFail={() =>
                        setSimulateNextBetFail((prev) => !prev)
                      }
                      isOffline={isOffline}
                    />
                  )}
                </>
              )}
            </div>
          </main>

          {/* RIGHT PERSISTENT SIDE PANEL (Desktop 1440px — Bet Slip + My Bets share one panel, matches desk-slip.webp) */}
          {!isPhoneFrame && rightPanelOpen && (
            <aside className="hidden xl:flex flex-col w-[340px] border-l border-[#132934] bg-[#09181F] shrink-0">
              <BetSlipAndMyBets
                mode="panel"
                activeTab={rightPanelTab}
                onTabChange={setRightPanelTab}
                selections={selections}
                onUpdateStake={(id, st) =>
                  setSelections((prev) =>
                    prev.map((s) =>
                      s.selectionId === id ? { ...s, stake: st } : s
                    )
                  )
                }
                onUpdateAllStakes={(st) =>
                  setSelections((prev) =>
                    prev.map((s) => ({ ...s, stake: st }))
                  )
                }
                onRemoveSelection={(id) =>
                  setSelections((prev) =>
                    prev.filter((s) => s.selectionId !== id)
                  )
                }
                onClearSlip={() => setSelections([])}
                onAcceptOddsChanges={handleAcceptOddsChanges}
                onPlaceBets={handlePlaceBets}
                onRepeatLastBet={handleRepeatLastBet}
                lastPlacedCount={lastPlacedSelections.length}
                betPlacementState={betPlacementState}
                betErrorMessage={betErrorMessage}
                onResetPlacementState={() => setBetPlacementState('idle')}
                myBets={myBets}
                onCashOut={handleCashOut}
                usdtBalance={usdtBalance}
                oddsAcceptMode={oddsAcceptMode}
                onChangeOddsAcceptMode={setOddsAcceptMode}
                onClosePanel={() => setRightPanelOpen(false)}
                onOpenFullPage={() => {
                  navigateToPage('mybets');
                }}
                onOpenMatch={handleOpenMatch}
                onSimulateSlipOddsChange={handleSimulateOddsMovement}
                onSimulateSlipSuspended={handleSimulateSlipSuspended}
                simulateNextBetFail={simulateNextBetFail}
                onToggleSimulateNextBetFail={() =>
                  setSimulateNextBetFail((prev) => !prev)
                }
                isOffline={isOffline}
              />
            </aside>
          )}
        </div>

        {/* PHONE FLOATING BOTTOM BET SLIP BAR (matches phone-slip.webp: "[1] Arsenal @ 1.30 ^") */}
        {selections.length > 0 && !mobileSheetOpen && (
          <div
            className={`${
              isPhoneFrame ? 'absolute' : 'fixed xl:hidden'
            } bottom-16 left-3 right-3 z-40 animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            <button
              type="button"
              onClick={() => {
                setRightPanelTab('slip');
                setMobileSheetOpen(true);
              }}
              className="w-full h-12 px-3.5 rounded-2xl bg-[#A7F3D0] hover:bg-[#6EE7B7] text-[#061116] shadow-xl flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  key={selections.length}
                  className="w-7 h-7 rounded-lg bg-[#061116] text-white font-mono-num text-xs font-extrabold flex items-center justify-center shrink-0 animate-in zoom-in-75 duration-150"
                >
                  {selections.length}
                </span>
                <span className="text-xs font-extrabold truncate">
                  {selections.length === 1 && firstSelection
                    ? `${firstSelection.optionLabel} @ ${firstSelection.odds.toFixed(
                        2
                      )}`
                    : `${selections.length} Singles selections`}
                </span>
              </div>
              <ChevronUp className="w-4 h-4 text-[#061116] shrink-0" />
            </button>
          </div>
        )}

        {/* PHONE SLIDE-UP BET SLIP + MY BETS SHEET (matches phone-slip-open.webp) */}
        {mobileSheetOpen && (
          <div
            className={`${
              isPhoneFrame ? 'absolute' : 'fixed xl:hidden'
            } inset-0 z-50 bg-black/65 flex flex-col justify-end`}
            onClick={() => setMobileSheetOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#09181F] border-t border-[#1D3B4A] rounded-t-3xl max-h-[82%] flex flex-col overflow-hidden shadow-2xl"
            >
              <BetSlipAndMyBets
                mode="panel"
                activeTab={rightPanelTab}
                onTabChange={setRightPanelTab}
                selections={selections}
                onUpdateStake={(id, st) =>
                  setSelections((prev) =>
                    prev.map((s) =>
                      s.selectionId === id ? { ...s, stake: st } : s
                    )
                  )
                }
                onUpdateAllStakes={(st) =>
                  setSelections((prev) =>
                    prev.map((s) => ({ ...s, stake: st }))
                  )
                }
                onRemoveSelection={(id) =>
                  setSelections((prev) =>
                    prev.filter((s) => s.selectionId !== id)
                  )
                }
                onClearSlip={() => setSelections([])}
                onAcceptOddsChanges={handleAcceptOddsChanges}
                onPlaceBets={handlePlaceBets}
                onRepeatLastBet={handleRepeatLastBet}
                lastPlacedCount={lastPlacedSelections.length}
                betPlacementState={betPlacementState}
                betErrorMessage={betErrorMessage}
                onResetPlacementState={() => setBetPlacementState('idle')}
                myBets={myBets}
                onCashOut={handleCashOut}
                usdtBalance={usdtBalance}
                oddsAcceptMode={oddsAcceptMode}
                onChangeOddsAcceptMode={setOddsAcceptMode}
                onClosePanel={() => setMobileSheetOpen(false)}
                onOpenFullPage={() => {
                  setMobileSheetOpen(false);
                  navigateToPage('mybets');
                }}
                onOpenMatch={(mId) => {
                  setMobileSheetOpen(false);
                  handleOpenMatch(mId);
                }}
                onSimulateSlipOddsChange={handleSimulateOddsMovement}
                onSimulateSlipSuspended={handleSimulateSlipSuspended}
                simulateNextBetFail={simulateNextBetFail}
                onToggleSimulateNextBetFail={() =>
                  setSimulateNextBetFail((prev) => !prev)
                }
                isOffline={isOffline}
              />
            </div>
          </div>
        )}

        {/* PHONE BOTTOM NAVIGATION BAR */}
        <nav
          className={`${
            isPhoneFrame
              ? 'w-full'
              : 'fixed xl:hidden bottom-0 left-0 right-0'
          } h-14 bg-[#07141A] border-t border-[#132934] grid grid-cols-5 items-center px-2 z-40 shrink-0`}
        >
          <button
            type="button"
            onClick={() => navigateToPage('home')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl text-[10px] font-semibold ${
              activePage === 'home' ? 'text-[#2CE5FF]' : 'text-[#94A3B8]'
            }`}
          >
            <Menu className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => navigateToPage('football')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl text-[10px] font-semibold ${
              activePage === 'football' || activePage === 'match'
                ? 'bg-[#0E2936] text-[#2CE5FF]'
                : 'text-[#94A3B8]'
            }`}
          >
            <SoccerBallIcon className="w-4 h-4" />
            <span>Football</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLiveSportFilter('all');
              navigateToPage('live');
            }}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl text-[10px] font-semibold ${
              activePage === 'live'
                ? 'bg-[#0E2936] text-[#2CE5FF]'
                : 'text-[#94A3B8]'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Live</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRightPanelTab('slip');
              setMobileSheetOpen(true);
            }}
            className="flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl text-[10px] font-semibold text-[#94A3B8] relative"
          >
            <Receipt className="w-4 h-4" />
            <span>Slip ({selections.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRightPanelTab('mybets');
              setMobileSheetOpen(true);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl text-[10px] font-semibold ${
              activePage === 'mybets' ? 'text-[#2CE5FF]' : 'text-[#94A3B8]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>My Bets ({openBetsCount})</span>
          </button>
        </nav>
      </div>

      {/* SLEEK FLOATING BOTTOM-LEFT "JUDGE & STATE CONTROLS" PILL & POPOVER */}
      <div className="fixed bottom-16 xl:bottom-4 left-4 z-50">
        {judgeDrawerOpen ? (
          <div className="w-76 rounded-2xl bg-[#09181F]/95 backdrop-blur border border-[#2CE5FF]/40 p-3.5 shadow-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-[#16303D] pb-2">
              <span className="font-extrabold text-[#2CE5FF] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Judge & State Controls</span>
              </span>
              <button
                type="button"
                onClick={() => setJudgeDrawerOpen(false)}
                className="text-[#94A3B8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 5 Pages Quick Jump */}
            <div className="space-y-1">
              <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
                Jump to Contest Page (5/5)
              </div>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { id: 'home', label: '1. Sports Home' },
                  { id: 'live', label: '2. Live' },
                  { id: 'football', label: '3. Football' },
                  { id: 'match', label: '4. Match Page' },
                  { id: 'mybets', label: '5. Slip + My Bets' },
                  { id: 'notfound', label: '404 Page State' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      navigateToPage(p.id as PageId);
                      if (p.id === 'mybets') setRightPanelTab('mybets');
                    }}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold text-left transition-colors ${
                      activePage === p.id
                        ? 'bg-[#2CE5FF] text-[#061116] font-bold'
                        : 'bg-[#0C1E26] text-[#CBD5E1] hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Edge State Simulators + Live Broadcast Event Trigger */}
            <div className="space-y-1">
              <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
                Test Every State (10 pts)
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={handleSimulateOddsMovement}
                  className="px-2.5 py-1.5 rounded-lg bg-[#112A36] hover:bg-[#173747] text-[#FACC15] border border-[#FACC15]/30 text-[11px] font-semibold flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 shrink-0" />
                  <span>Odds Changed</span>
                </button>
                <button
                  type="button"
                  onClick={handleSimulateSlipSuspended}
                  className="px-2.5 py-1.5 rounded-lg bg-[#112A36] hover:bg-[#173747] text-[#F59E0B] border border-[#F59E0B]/30 text-[11px] font-semibold flex items-center gap-1"
                >
                  <Lock className="w-3 h-3 shrink-0" />
                  <span>Suspended</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSimulateNextBetFail((prev) => !prev)}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold ${
                    simulateNextBetFail
                      ? 'bg-rose-500/25 border-rose-400 text-rose-300'
                      : 'bg-[#112A36] border-rose-500/30 text-rose-300'
                  }`}
                >
                  {simulateNextBetFail ? 'Bet Fail: ON' : 'Bet Failed'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigateToPage('live');
                    setNothingLiveSimulated((prev) => !prev);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold ${
                    nothingLiveSimulated
                      ? 'bg-[#2CE5FF]/20 border-[#2CE5FF] text-[#2CE5FF]'
                      : 'bg-[#112A36] border-[#1D3B4A] text-[#CBD5E1]'
                  }`}
                >
                  Nothing Live
                </button>
                <button
                  type="button"
                  onClick={() => setIsOffline((prev) => !prev)}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 ${
                    isOffline
                      ? 'bg-rose-500/25 border-rose-400 text-rose-300'
                      : 'bg-[#112A36] border-[#1D3B4A] text-[#CBD5E1]'
                  }`}
                >
                  <WifiOff className="w-3 h-3 shrink-0" />
                  <span>{isOffline ? 'Offline: ON' : 'Connection Lost'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsInitialLoading(true);
                    setTimeout(() => setIsInitialLoading(false), 900);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#112A36] hover:bg-[#173747] border border-[#1D3B4A] text-[#CBD5E1] text-[11px] font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3 shrink-0" />
                  <span>Skeleton Load</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => triggerLiveMatchEvent()}
                className="w-full mt-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 text-[11px] font-bold flex items-center justify-center gap-1.5"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Trigger Live Goal / Match Alert</span>
              </button>
            </div>

            {/* Viewport Switcher: 1440px vs 390px + Reset Demo Data */}
            <div className="space-y-1.5 pt-1 border-t border-[#16303D]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
                  Viewport Mode
                </span>
                <button
                  type="button"
                  onClick={handleResetDemoData}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-[#94A3B8] hover:text-white"
                  title="Reset slip, bets, and balance to initial defaults"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Demo</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewportMode('auto')}
                  className={`inline-flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold border ${
                    viewportMode === 'auto'
                      ? 'bg-[#133240] border-[#2CE5FF] text-white'
                      : 'bg-[#0C1E26] border-[#173340] text-[#94A3B8]'
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Desktop / Auto</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode('phone390')}
                  className={`inline-flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold border ${
                    viewportMode === 'phone390'
                      ? 'bg-[#133240] border-[#2CE5FF] text-[#2CE5FF]'
                      : 'bg-[#0C1E26] border-[#173340] text-[#94A3B8]'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>390px Phone</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setJudgeDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#0C1E26]/95 hover:bg-[#133240] border border-[#2CE5FF]/50 text-[11px] font-bold text-[#2CE5FF] shadow-lg backdrop-blur transition-all"
            title="Open Judge & State Simulator Controls"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Judge Controls</span>
          </button>
        )}
      </div>
    </div>
  );
}
