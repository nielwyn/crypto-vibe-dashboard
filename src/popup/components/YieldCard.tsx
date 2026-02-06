import { YieldPool } from '../../types';

interface YieldCardProps {
  pool: YieldPool;
}

// DEX protocols - show pair like SOL/USDC
const DEX_PROTOCOLS = ['uniswap', 'pancakeswap', 'raydium', 'sushiswap', 'curve', 'balancer', 'velodrome', 'aerodrome', 'camelot', 'trader-joe', 'orca'];

// Lending protocols - show single asset
const LENDING_PROTOCOLS = ['aave', 'compound', 'venus', 'kamino', 'morpho', 'spark', 'benqi', 'radiant'];

// Staking protocols - show single staking asset
const STAKING_PROTOCOLS = ['lido', 'lista', 'jito', 'rocketpool', 'frax-ether', 'stakewise', 'marinade'];

type ProtocolType = 'DEX' | 'Lending' | 'Staking' | 'Other';

function getProtocolType(project: string): ProtocolType {
  const projectLower = project.toLowerCase();
  if (DEX_PROTOCOLS.some(p => projectLower.includes(p))) return 'DEX';
  if (LENDING_PROTOCOLS.some(p => projectLower.includes(p))) return 'Lending';
  if (STAKING_PROTOCOLS.some(p => projectLower.includes(p))) return 'Staking';
  return 'Other';
}

function getProtocolLabel(type: ProtocolType): string {
  switch (type) {
    case 'DEX': return 'DEX';
    case 'Lending': return 'Lend';
    case 'Staking': return 'Stake';
    default: return 'Yield';
  }
}

export function YieldCard({ pool }: YieldCardProps) {
  const protocolType = getProtocolType(pool.project);

  const getApyColor = (apy: number) => {
    if (apy > 5) return 'text-[#14f195]';
    if (apy >= 2) return 'text-[#5a7cc0]';
    return 'text-gray-400';
  };

  return (
    <div 
      className="flex-shrink-0 w-24 bg-[#1e2040]/70 backdrop-blur-sm rounded-xl p-2 border border-[#3d4470]/50 text-center hover:bg-[#2a2d50] hover:border-[#5a7cc0]/40 transition-all duration-200"
      title={`${pool.project} • ${pool.symbol}\n${pool.chain} • ${protocolType}\nAPR: ${pool.apy.toFixed(2)}%\nTVL: $${(pool.tvlUsd / 1_000_000).toFixed(1)}M`}
    >
      {/* Protocol name */}
      <div className="text-xs text-white/90 truncate font-medium">
        {pool.project}
      </div>
      {/* Asset/Pair */}
      <div className="text-[10px] text-[#ab9ff2] truncate font-medium mt-0.5">
        {pool.symbol}
      </div>
      {/* Chain + Type badge */}
      <div className="flex items-center justify-center gap-1 mt-0.5">
        <span className="text-[9px] text-[#8da4d4]/60 truncate">{pool.chain}</span>
        <span className="text-[9px] px-1 py-0.5 bg-[#3d4470]/50 rounded text-[#8da4d4]">
          {getProtocolLabel(protocolType)}
        </span>
      </div>
      {/* APY */}
      <div className={`text-sm font-bold mt-1 ${getApyColor(pool.apy)}`}>
        {pool.apy.toFixed(1)}% <span className="text-[9px] font-normal opacity-70">APR</span>
      </div>
    </div>
  );
}
