import React from 'react';

export const HousebetsLogomark: React.FC<{
  className?: string;
  variant?: 'dark' | 'light';
}> = ({ className = 'w-6 h-6', variant = 'dark' }) => (
  <svg
    viewBox="380 120 450 545"
    className={`inline-block shrink-0 select-none ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Housebets Logomark"
  >
    <path
      fill={variant === 'dark' ? '#02f7fd' : '#001716'}
      d="M804.1,196.8c0-1.3.1-2.6.1-3.9s0-2.6-.1-3.9v-51.1h-109.7v51.1c0,1.3-.1,2.6-.1,3.9s0,2.6.1,3.9v140h-177.4v-140.2c0-1.2.1-2.5.1-3.7s0-2.5-.1-3.7v-51.3h-109.7v51.3c0,1.2-.1,2.5-.1,3.7s0,2.5.1,3.7v390.1c0,1.2-.1,2.5-.1,2.5s0,2.5.1,3.7v51.3h109.7v-51.3c0-1.2.1-2.5.1-3.7s0-2.5-.1-3.7v-140.2l88.8-54.9,88.7,54.8h0v140.1c0,1.3-.1,2.6-.1,3.9s0,2.6.1,3.9v51.1h109.7v-51.1c0-1.3.1-2.6.1-3.9s0-2.6-.1-3.9V196.8Z"
    />
  </svg>
);

export const HousebetsLogo: React.FC<{
  className?: string;
  variant?: 'dark' | 'light';
}> = ({ className = 'h-6', variant = 'dark' }) => {
  const textFill = variant === 'dark' ? '#ffffff' : '#001716';
  const markFill = variant === 'dark' ? '#02f7fd' : '#001716';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="130 315 952 154"
        className="h-full w-auto"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Housebets"
      >
        <g>
          <path
            fill={textFill}
            d="M755,355.8c-14.1,0-24.9,5.8-31,15.9v-51h-30.7v140.1h30.7v-14s0,0,0,0v-2.1h3.1c1,6.3,5,11.9,10.8,14.5,4.9,2.2,10.6,3.4,17,3.4,25.5,0,40.7-20,40.7-53.4s-15.2-53.4-40.7-53.4ZM743.6,436.4c-12.9,0-20.9-10.4-20.9-27.2s8-27.4,20.9-27.4,20.9,10,20.9,27.4-7.6,27.2-20.9,27.2Z"
          />
          <path
            fill={textFill}
            d="M312.5,355.8c-32.6,0-52.1,20-52.1,53.4s19.5,53.4,52.1,53.4,51.9-20,51.9-53.4-19.4-53.4-51.9-53.4ZM312.5,436.4c-13.3,0-20.9-9.9-20.9-27.2s7.6-27.4,20.9-27.4,20.9,10,20.9,27.4-7.6,27.2-20.9,27.2Z"
          />
          <path
            fill={textFill}
            d="M469.7,357.7v103h-30.7v-12.9s0,0,0,0v-3.2h-3.1c-1.4,8.5-7.7,15.5-16.1,17.2-2.4.5-4.9.8-7.6.8-22.1,0-35.2-16-35.2-42.8v-62.1h30.7v61c0,6.6,1.9,17.7,14.7,17.7s16.7-8.5,16.7-23.4v-55.4h30.7Z"
          />
          <path
            fill={textFill}
            d="M534.3,395.7h-.4c-12.1-2.2-19.5-3.8-19.5-9.7s9.5-8.5,13.6-8.5c6.4,0,14.1,2.3,14.1,13.1v3h29v-3c0-21.8-16.1-34.9-43.1-34.9s-43.3,12.1-43.3,32.4,22.1,28.5,38.3,31.2c13,2.2,21,4,21,11.4s-10,9.8-16,9.8-16.7-1.9-16.7-14.3v-3h-29v3c0,22.8,17.1,36.4,45.7,36.4s25.3-3.1,33.2-9.1c8.2-6.1,12.5-15,12.5-25.8,0-25.3-22.7-29.2-39.4-32.1Z"
          />
          <path
            fill={textFill}
            d="M650.7,420.2l-.5,2.3c-2.2,9.5-9.2,14.9-19.3,14.9s-15.9-6.2-18.5-17.2l-11.9-2v-3.1h79.5v-5.9c0-33.5-18.4-53.4-49.1-53.4s-49.5,20-49.5,53.4,18.5,53.4,49.5,53.4,45.5-14.6,49.1-39.1l.5-3.4h-29.8ZM631,380.8c6,0,16,2.6,18.6,19.6h-37.6c1.5-8.5,5.9-19.6,18.9-19.6Z"
          />
          <path
            fill={textFill}
            d="M873.5,420.2l-.5,2.3c-2.2,9.5-9.2,14.9-19.3,14.9s-15.9-6.2-18.5-17.2l-14.7-2v-3.1h82.3v-5.9c0-33.5-18.4-53.4-49.1-53.4s-49.5,20-49.5,53.4,18.5,53.4,49.5,53.4,45.5-14.6,49.1-39.1l.5-3.4h-29.8ZM853.7,380.8c6,0,16,2.6,18.6,19.6h-37.6c1.5-8.5,5.9-19.6,18.9-19.6Z"
          />
          <path
            fill={textFill}
            d="M1035.9,395.7h-.4c-12.1-2.2-19.5-3.8-19.5-9.7s9.5-8.5,13.6-8.5c6.4,0,14.1,2.3,14.1,13.1v3h29v-3c0-21.8-16.1-34.9-43.1-34.9s-43.3,12.1-43.3,32.4,22.1,28.5,38.3,31.2c13,2.2,21,4,21,11.4s-10,9.8-16,9.8-16.7-1.9-16.7-14.3v-3h-29v3c0,22.8,17.1,36.4,45.7,36.4s25.3-3.1,33.2-9.1c8.2-6.1,12.5-15,12.5-25.8,0-25.3-22.7-29.2-39.4-32.1Z"
          />
          <path
            fill={markFill}
            d="M247.1,337.1c0-.4,0-.7,0-1.1s0-.7,0-1.1v-14.3h-30.7v14.3c0,.4,0,.7,0,1.1s0,.7,0,1.1v39.2h-49.7v-39.2c0-.3,0-.7,0-1s0-.7,0-1v-14.4h-30.7v14.4c0,.3,0,.7,0,1s0,.7,0,1v109.2c0,.3,0,.7,0,1s0,.7,0,1v14.4h30.7v-14.4c0-.3,0-.7,0-1s0-.7,0-1v-39.2l24.8-15.4,24.8,15.3h0v39.2c0,.4,0,.7,0,1.1s0,.7,0,1.1v14.3h30.7v-14.3c0-.4,0-.7,0-1.1s0-.7,0-1.1v-109.1Z"
          />
          <path
            fill={textFill}
            d="M959.6,381.2h0s-19.8,0-19.8,0v3.1l10.7,2v38.8c0,5.2,2.1,11.4,12.1,11.4s8.1-1,11.1-2.7l4.4-2.5v25.9l-1.7.8c-6.2,3-14.3,4.7-21.7,4.7-21.8,0-34.9-12.8-34.9-34.3v-47.1h-13.5v-23.5h13.5v-29.8h30.7v29.8h29.3v23.5h-20.2Z"
          />
        </g>
      </svg>
    </div>
  );
};


export const UsdtIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={`inline-block shrink-0 ${className}`} fill="none">
    <circle cx="12" cy="12" r="11" fill="#26A17B" />
    <path
      d="M13.3 10.6V9.1H17V6.8H7V9.1H10.7V10.6C7.7 10.8 5.5 11.4 5.5 12.2C5.5 13 7.7 13.6 10.7 13.8V18H13.3V13.8C16.3 13.6 18.5 13 18.5 12.2C18.5 11.4 16.3 10.8 13.3 10.6ZM12 13.1C9.5 13.1 7.4 12.6 7.4 12.1C7.4 11.6 9.5 11.2 12 11.2C14.5 11.2 16.6 11.6 16.6 12.1C16.6 12.6 14.5 13.1 12 13.1Z"
      fill="white"
    />
  </svg>
);

const TEAM_COLORS: Record<string, { primary: string; secondary: string; accent: string; abbr: string }> = {
  'Arsenal': { primary: '#EF0107', secondary: '#FFFFFF', accent: '#DBB76C', abbr: 'ARS' },
  'Brighton & Hove Albion': { primary: '#0057B8', secondary: '#FFFFFF', accent: '#FFCD00', abbr: 'BHA' },
  'Brighton': { primary: '#0057B8', secondary: '#FFFFFF', accent: '#FFCD00', abbr: 'BHA' },
  'Aston Villa': { primary: '#670E36', secondary: '#95BFE5', accent: '#FEE505', abbr: 'AVL' },
  'Fulham': { primary: '#FFFFFF', secondary: '#111827', accent: '#CC0000', abbr: 'FUL' },
  'Newcastle United': { primary: '#111827', secondary: '#FFFFFF', accent: '#38BDF8', abbr: 'NEW' },
  'Everton': { primary: '#003399', secondary: '#FFFFFF', accent: '#FACC15', abbr: 'EVE' },
  'Liverpool': { primary: '#C8102E', secondary: '#FFFFFF', accent: '#F6EB61', abbr: 'LIV' },
  'Manchester United': { primary: '#DA291C', secondary: '#FBE122', accent: '#111827', abbr: 'MUN' },
  'Manchester City': { primary: '#6CABDD', secondary: '#FFFFFF', accent: '#1C2C5B', abbr: 'MCI' },
  'Tottenham Hotspur': { primary: '#FFFFFF', secondary: '#132257', accent: '#132257', abbr: 'TOT' },
  'Inter': { primary: '#010E80', secondary: '#111827', accent: '#C5A059', abbr: 'INT' },
  'Real Madrid': { primary: '#FFFFFF', secondary: '#FEBE10', accent: '#00529F', abbr: 'RMA' },
  'Bayern Munich': { primary: '#DC052D', secondary: '#0066B2', accent: '#FFFFFF', abbr: 'BAY' },
  'Barcelona': { primary: '#A50044', secondary: '#004D98', accent: '#EDBB00', abbr: 'BAR' },
  'Paris Saint-Germain': { primary: '#004170', secondary: '#DA291C', accent: '#FFFFFF', abbr: 'PSG' },
  'Atlético Madrid': { primary: '#CB3524', secondary: '#FFFFFF', accent: '#272E61', abbr: 'ATM' },
  'Sevilla': { primary: '#FFFFFF', secondary: '#D41920', accent: '#FACC15', abbr: 'SEV' },
  'Villarreal': { primary: '#FFE667', secondary: '#005187', accent: '#DA291C', abbr: 'VIL' },
  'Juventus': { primary: '#111827', secondary: '#FFFFFF', accent: '#D4AF37', abbr: 'JUV' },
  'Roma': { primary: '#8E1F2F', secondary: '#F0BC42', accent: '#FFFFFF', abbr: 'ROM' },
  'Napoli': { primary: '#12A0D7', secondary: '#FFFFFF', accent: '#003C82', abbr: 'NAP' },
  'AC Milan': { primary: '#FB090B', secondary: '#111827', accent: '#FFFFFF', abbr: 'MIL' },
  'Bayer Leverkusen': { primary: '#E32221', secondary: '#111827', accent: '#FACC15', abbr: 'B04' },
  'Borussia Dortmund': { primary: '#FDE100', secondary: '#111827', accent: '#111827', abbr: 'BVB' },
  'RB Leipzig': { primary: '#FFFFFF', secondary: '#DD0741', accent: '#001F47', abbr: 'RBL' },
  'Carlos Alcaraz': { primary: '#EF4444', secondary: '#FACC15', accent: '#FFFFFF', abbr: 'ALC' },
  'Jannik Sinner': { primary: '#10B981', secondary: '#FFFFFF', accent: '#EF4444', abbr: 'SIN' },
  'Novak Djokovic': { primary: '#2563EB', secondary: '#EF4444', accent: '#FFFFFF', abbr: 'DJO' },
  'Daniil Medvedev': { primary: '#3B82F6', secondary: '#FFFFFF', accent: '#EF4444', abbr: 'MED' },
  'Aryna Sabalenka': { primary: '#EC4899', secondary: '#FFFFFF', accent: '#FACC15', abbr: 'SAB' },
  'Iga Swiatek': { primary: '#DC2626', secondary: '#FFFFFF', accent: '#FACC15', abbr: 'SWI' },
  'LA Lakers': { primary: '#552583', secondary: '#FDB927', accent: '#FFFFFF', abbr: 'LAL' },
  'Boston Celtics': { primary: '#007A33', secondary: '#FFFFFF', accent: '#BA9653', abbr: 'BOS' },
  'NY Yankees': { primary: '#003087', secondary: '#FFFFFF', accent: '#E4002C', abbr: 'NYY' },
  'LA Dodgers': { primary: '#005A9C', secondary: '#FFFFFF', accent: '#EF3E42', abbr: 'LAD' },
  'Kansas City Chiefs': { primary: '#E31837', secondary: '#FFB81C', accent: '#FFFFFF', abbr: 'KC' },
  'Baltimore Ravens': { primary: '#241773', secondary: '#9E7C0C', accent: '#FFFFFF', abbr: 'BAL' },
  'Team Liquid': { primary: '#0A2540', secondary: '#38BDF8', accent: '#FFFFFF', abbr: 'TL' },
  'G2 Esports': { primary: '#18181B', secondary: '#EF4444', accent: '#FFFFFF', abbr: 'G2' },
};

export const TeamCrest: React.FC<{ team: string; size?: 'sm' | 'md' | 'lg' }> = ({
  team,
  size = 'sm',
}) => {
  const palette = TEAM_COLORS[team] || {
    primary: '#0EA5E9',
    secondary: '#FFFFFF',
    accent: '#38BDF8',
    abbr: team.slice(0, 3).toUpperCase(),
  };

  const dims =
    size === 'lg'
      ? 'w-11 h-11 text-[11px]'
      : size === 'md'
      ? 'w-7 h-7 text-[9px]'
      : 'w-4 h-4 text-[7px]';

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 select-none relative ${dims}`}
      title={team}
    >
      <svg viewBox="0 0 36 40" className="w-full h-full drop-shadow-sm">
        <path
          d="M18 2L33 7V19C33 28.5 26.5 35.5 18 38C9.5 35.5 3 28.5 3 19V7L18 2Z"
          fill={palette.primary}
          stroke={palette.accent}
          strokeWidth="2.5"
        />
        <path
          d="M18 4.5L30.5 8.8V19C30.5 26.8 25 32.8 18 35.2V4.5Z"
          fill={palette.secondary}
          fillOpacity="0.22"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-extrabold tracking-tighter leading-none"
        style={{
          color:
            palette.primary === '#FFFFFF' ||
            palette.primary === '#FDE100' ||
            palette.primary === '#FFE667'
              ? '#0F172A'
              : '#FFFFFF',
        }}
      >
        {palette.abbr}
      </span>
    </span>
  );
};

export const LeagueBadge: React.FC<{ competition: string }> = ({ competition }) => {
  if (competition === 'Premier League') {
    return (
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white text-[#CE1124] shrink-0 overflow-hidden border border-white/20">
        <svg viewBox="0 0 20 20" className="w-full h-full">
          <rect width="20" height="20" fill="#FFFFFF" />
          <rect x="8" y="0" width="4" height="20" fill="#CE1124" />
          <rect x="0" y="8" width="20" height="4" fill="#CE1124" />
        </svg>
      </span>
    );
  }
  if (competition === 'LaLiga') {
    return (
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full shrink-0 overflow-hidden border border-white/20">
        <svg viewBox="0 0 20 20" className="w-full h-full">
          <rect width="20" height="5" fill="#AA151B" />
          <rect y="5" width="20" height="10" fill="#F1BF00" />
          <rect y="15" width="20" height="5" fill="#AA151B" />
        </svg>
      </span>
    );
  }
  if (competition === 'Serie A') {
    return (
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full shrink-0 overflow-hidden border border-white/20">
        <svg viewBox="0 0 20 20" className="w-full h-full">
          <rect width="6.6" height="20" fill="#009246" />
          <rect x="6.6" width="6.8" height="20" fill="#FFFFFF" />
          <rect x="13.4" width="6.6" height="20" fill="#CE2B37" />
        </svg>
      </span>
    );
  }
  if (competition === 'Bundesliga') {
    return (
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full shrink-0 overflow-hidden border border-white/20">
        <svg viewBox="0 0 20 20" className="w-full h-full">
          <rect width="20" height="6.6" fill="#000000" />
          <rect y="6.6" width="20" height="6.8" fill="#DD0000" />
          <rect y="13.4" width="20" height="6.6" fill="#FFCE00" />
        </svg>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#1D4ED8] text-white shrink-0 overflow-hidden border border-[#60A5FA]/40">
      <svg viewBox="0 0 20 20" className="w-full h-full">
        <circle cx="10" cy="10" r="10" fill="#1E3A8A" />
        <circle cx="10" cy="10" r="5" fill="#38BDF8" fillOpacity="0.5" />
      </svg>
    </span>
  );
};
