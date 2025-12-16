
import { Coins, Shield } from 'lucide-react';

export function CurrencyDisplay({ stats }) {
  return (
    <div className="flex gap-3 animate-slide-down">
      <div className="currency-badge currency-bucks">
        <Coins className="w-4 h-4" />
        <span>{stats.bucks.toLocaleString()}</span>
      </div>
      <div className="currency-badge currency-rank">
        <Shield className="w-4 h-4" />
        <span>{RANK_LABELS[stats.rank]}</span>
      </div>
    </div>
  );
}
