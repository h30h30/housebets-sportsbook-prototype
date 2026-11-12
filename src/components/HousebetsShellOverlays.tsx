import React, { useState } from 'react';
import {
  ArrowUpDown,
  Bell,
  Check,
  ChevronRight,
  Copy,
  Crown,
  HelpCircle,
  Home,
  KeyRound,
  LogOut,
  MessageCircle,
  MessageSquare,
  Plus,
  Search,
  Send,
  Settings,
  Ticket,
  User,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { HousebetsLogo, UsdtIcon } from './BrandAssets';

export const WalletDropdownPopover: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  usdtBalance: number;
  onAddSampleUsdt: () => void;
}> = ({ isOpen, onClose, usdtBalance, onAddSampleUsdt }) => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'Crypto' | 'Cash'>('Crypto');

  if (!isOpen) return null;

  const currencies = [
    {
      code: 'USDT',
      name: 'Tether USDT',
      balance: usdtBalance.toFixed(2),
      color: '#26A17B',
      symbol: '₮',
      active: true,
    },
    {
      code: 'USDC',
      name: 'USD Coin',
      balance: '0.00000028',
      color: '#2775CA',
      symbol: '$',
      active: false,
    },
    {
      code: 'SOL',
      name: 'Solana',
      balance: '0.00',
      color: '#14F195',
      symbol: '◎',
      active: false,
    },
    {
      code: 'ETH',
      name: 'Ethereum',
      balance: '0.00',
      color: '#627EEA',
      symbol: 'Ξ',
      active: false,
    },
    {
      code: 'BTC',
      name: 'Bitcoin',
      balance: '0.00',
      color: '#F7931A',
      symbol: '₿',
      active: false,
    },
  ].filter(
    (c) =>
      !search.trim() ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-12 left-0 z-50 w-72 rounded-2xl bg-[#0B1820] border border-[#1A3544] shadow-2xl overflow-hidden text-white">
        <div className="p-3 space-y-2.5">
          {/* Search currencies */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search currencies"
              className="w-full h-9 pl-8 pr-3 rounded-xl bg-[#10222C] border border-[#1B3746] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#2CE5FF]"
            />
          </div>

          {/* House Keys Row (Matches Screenshot 131014) */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#10222C] border border-[#1B3746] text-xs">
            <span className="flex items-center gap-2 font-bold text-white">
              <KeyRound className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>House Keys</span>
            </span>
            <span className="font-mono-num font-extrabold text-white">0</span>
          </div>

          {/* Crypto | Cash Tabs */}
          <div className="grid grid-cols-2 border-b border-[#18313F] text-xs font-bold">
            {(['Crypto', 'Cash'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`pb-2 text-center relative transition-colors ${
                  tab === t ? 'text-white' : 'text-[#64748B] hover:text-white'
                }`}
              >
                {t}
                {tab === t && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2CE5FF]" />
                )}
              </button>
            ))}
          </div>

          {/* Currency List */}
          <div className="space-y-1 max-h-56 overflow-y-auto pr-0.5">
            {currencies.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={onClose}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                  c.active
                    ? 'bg-[#132C38] border border-[#2CE5FF]/40 text-white'
                    : 'hover:bg-[#10222C] text-[#CBD5E1]'
                }`}
              >
                <span className="flex items-center gap-2.5 font-extrabold">
                  {c.code === 'USDT' ? (
                    <UsdtIcon className="w-5 h-5" />
                  ) : (
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.symbol}
                    </span>
                  )}
                  <span>{c.code}</span>
                </span>
                <span className="font-mono-num font-bold text-white">
                  {c.balance}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer: Add Sample USDT + Wallet settings */}
        <div className="px-3 py-2.5 bg-[#081319] border-t border-[#162E3B] flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 text-[#94A3B8]">
            <Settings className="w-3.5 h-3.5" />
            <span>Wallet settings</span>
          </span>
          <button
            type="button"
            onClick={onAddSampleUsdt}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#A7F3D0] hover:bg-[#6EE7B7] text-[#061116] font-extrabold text-[10px] transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>+$100 USDT</span>
          </button>
        </div>
      </div>
    </>
  );
};

export const UserProfileDropdown: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  username: string;
  onOpenWallet: () => void;
  onOpenSupport: () => void;
  onLogout: () => void;
}> = ({
  isOpen,
  onClose,
  username,
  onOpenWallet,
  onOpenSupport,
  onLogout,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const menuItems = [
    { label: 'Notifications', icon: Bell, dot: true, action: onClose },
    { label: 'My Profile', icon: User, action: onClose },
    {
      label: 'Wallet',
      icon: Wallet,
      action: () => {
        onClose();
        onOpenWallet();
      },
    },
    { label: 'Rewards', icon: Crown, action: onClose },
    { label: 'Redeem Code', icon: Ticket, action: onClose },
    { label: 'Affiliate', icon: Users, action: onClose },
    { label: 'Transactions', icon: ArrowUpDown, action: onClose },
    { label: 'Settings', icon: Settings, action: onClose },
    {
      label: 'Live Support',
      icon: MessageCircle,
      action: () => {
        onClose();
        onOpenSupport();
      },
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-12 right-0 z-50 w-64 rounded-2xl bg-[#0B1820] border border-[#1A3544] shadow-2xl overflow-hidden text-white p-3 space-y-2">
        {/* Top XP & Tier Card (Matches Screenshot 131104) */}
        <div className="rounded-xl bg-[#10222C] border border-[#1C3847] p-3 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {/* Hexagon Rookie Icon */}
              <div className="w-6 h-6 rounded-md bg-[#1D3542] border border-[#2F5264] flex items-center justify-center shrink-0">
                <span className="w-2.5 h-2.5 rotate-45 bg-slate-200 rounded-[1px]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-extrabold text-white truncate">
                    {username}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(username).catch(() => {});
                      }
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }}
                    className="text-[#64748B] hover:text-white"
                    title="Copy username"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <div className="text-[10px] text-[#64748B] font-mono-num">
                  16 XP
                </div>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-md bg-[#0B1820] border border-[#224254] text-[10px] font-bold text-[#CBD5E1]">
              Rookie
            </span>
          </div>

          <div className="space-y-1">
            <div className="h-1.5 rounded-full bg-[#09141A] overflow-hidden">
              <div className="h-full w-[12%] bg-white rounded-full" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
              <span>
                <strong className="text-white font-mono-num">184 XP</strong> to{' '}
                <strong className="text-white">Bronze 1</strong>
              </span>
              <span className="font-mono-num text-[#64748B]">200 XP</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-0.5">
          {menuItems.map((item) => {
            const IconComp = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#CBD5E1] hover:text-white hover:bg-[#10222C] transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <IconComp className="w-4 h-4 text-[#94A3B8]" />
                  <span>{item.label}</span>
                </span>
                {item.dot && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-1 border-t border-[#162E3B]">
          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#CBD5E1] hover:text-rose-400 hover:bg-[#10222C] transition-colors"
          >
            <LogOut className="w-4 h-4 text-[#94A3B8]" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export const LiveSupportWidget: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  username: string;
  isPhoneFrame?: boolean;
}> = ({ isOpen, onClose, username, isPhoneFrame = false }) => {
  const [tab, setTab] = useState<'Home' | 'Messages' | 'Help'>('Home');

  if (!isOpen) return null;

  return (
    <div
      className={`${
        isPhoneFrame
          ? 'absolute bottom-16 left-3 right-3 z-50'
          : 'fixed bottom-16 right-4 z-50 w-[330px] sm:w-[360px]'
      } rounded-2xl bg-white text-[#0F172A] shadow-2xl border border-[#1A3544] overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200`}
    >
      {/* Dark Teal Header Gradient (Matches Screenshot 131224) */}
      <div className="bg-gradient-to-b from-[#081A22] to-[#173844] p-5 text-white">
        <div className="flex items-center justify-between mb-6">
          <HousebetsLogo className="h-5" />
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white p-1"
            aria-label="Close support widget"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-base font-bold text-white/75">
          Hi {username} 👋
        </div>
        <div className="text-xl font-extrabold text-white mt-0.5">
          How can we help?
        </div>
      </div>

      {/* Content Cards */}
      <div className="p-3.5 bg-[#F8FAFC] space-y-2.5 max-h-[310px] overflow-y-auto">
        {tab === 'Home' && (
          <>
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 shadow-xs text-xs text-slate-600">
              <span>Search for help</span>
              <Search className="w-4 h-4 text-[#0D9488]" />
            </div>

            <button
              type="button"
              onClick={() => setTab('Messages')}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 shadow-xs text-xs font-bold text-slate-900 transition-colors"
            >
              <span>Chat with us</span>
              <Send className="w-4 h-4 text-[#0F766E]" />
            </button>

            <div className="rounded-xl bg-white border border-slate-200 p-3.5 space-y-1 shadow-xs">
              <div className="text-xs font-bold text-slate-900">
                How long do withdrawals take?
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Withdrawals are paid out automatically in USDT, normally within a few minutes.
              </p>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 p-3.5 space-y-1 shadow-xs">
              <div className="text-xs font-bold text-slate-900">
                When do I get my rewards?
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Open Rewards to see your VIP progress and instant rakeback amounts.
              </p>
            </div>
          </>
        )}

        {tab === 'Messages' && (
          <div className="rounded-xl bg-white border border-slate-200 p-4 text-center space-y-2">
            <MessageSquare className="w-6 h-6 text-[#0F766E] mx-auto" />
            <div className="text-xs font-bold text-slate-900">
              Start a conversation
            </div>
            <p className="text-[11px] text-slate-500">
              Our 24/7 Housebets support team typically replies in under 2 minutes.
            </p>
          </div>
        )}

        {tab === 'Help' && (
          <div className="space-y-2">
            {[
              'Singles betting & USDT settlement rules',
              'How Cash Out works on live matches',
              'Why markets suspend during VAR / goals',
            ].map((topic) => (
              <div
                key={topic}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800"
              >
                <span>{topic}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Bar: Home | Messages | Help */}
      <div className="grid grid-cols-3 border-t border-slate-200 bg-white py-2 text-[11px] font-semibold">
        {[
          { id: 'Home' as const, icon: Home },
          { id: 'Messages' as const, icon: MessageSquare },
          { id: 'Help' as const, icon: HelpCircle },
        ].map((nav) => {
          const IconComp = nav.icon;
          const active = tab === nav.id;
          return (
            <button
              key={nav.id}
              type="button"
              onClick={() => setTab(nav.id)}
              className={`flex flex-col items-center gap-0.5 ${
                active ? 'text-[#0F766E] font-bold' : 'text-slate-400'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{nav.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
