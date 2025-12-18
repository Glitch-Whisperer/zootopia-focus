import { PawPrint, Shield } from 'lucide-react';
import { RANK_LABELS } from '@/types/game.js';

export function CurrencyDisplay({ stats }) {
  return (
    <div className="flex gap-3 animate-slide-down">
      <div className="currency-badge currency-bucks">
        <PawPrint className="w-4 h-4" />
        <span>{stats.pawpsicals.toLocaleString()}</span>
      </div>
      <div className="currency-badge currency-rank">
        <Shield className="w-4 h-4" />
        <span>{RANK_LABELS[stats.rank]}</span>
      </div>
    </div>
  );
}