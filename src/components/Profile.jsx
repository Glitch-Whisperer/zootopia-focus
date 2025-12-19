import React from 'react';
import { 
  X, Clock, Flame, Trophy, Calendar, 
  MapPin, Star, TrendingUp, IceCream 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getCurrentRank } from '../config/regionsConfig'; // Assuming you have this from before

// Helper to calculate Pawpsicles (e.g., 1 Pawpsicle every 20 mins)
const calculatePawpsicles = (minutes) => Math.floor(minutes / 20);

export function UserProfile({ 
  isOpen, 
  onClose, 
  userStats = { 
    totalFocusMinutes: 0, 
    currentStreak: 0, 
    bestStreak: 0,
    sessionsCompleted: 0,
    regionsUnlocked: 1
  } 
}) {
  if (!isOpen) return null;

  const rank = getCurrentRank(userStats.totalFocusMinutes);
  const pawpsicles = calculatePawpsicles(userStats.totalFocusMinutes);
  
  // Example progress to next rank calculation
  const nextRankMinutes = 1500; // Example static value for "Mayor" or next rank
  const progressToNextRank = Math.min((userStats.totalFocusMinutes / nextRankMinutes) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Profile Card */}
      <div className="relative w-full max-w-2xl bg-gray-900/90 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header Background Pattern */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 opacity-20" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-white/10 text-white/70 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative p-8 pt-10">
          
          {/* --- USER IDENTITY SECTION --- */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            {/* Avatar Circle */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 p-1 shadow-xl">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                {/* Placeholder for User Avatar or Initials */}
                <span className="text-3xl font-bold text-white">Z</span> 
              </div>
            </div>

            {/* Name & Rank */}
            <div className="text-center md:text-left flex-1">
              <h2 className="text-3xl font-display font-bold text-white mb-1">Officer Hopps</h2>
              <div className="flex items-center justify-center md:justify-start gap-2 text-white/60 mb-3">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-xs uppercase tracking-wider font-semibold text-primary">
                  {rank.name}
                </span>
                <span className="text-sm">• Joined Oct 2025</span>
              </div>
              
              {/* Rank Progress Bar */}
              <div className="max-w-xs mx-auto md:mx-0">
                <div className="flex justify-between text-[10px] text-white/40 mb-1 uppercase tracking-wider">
                  <span>Current Rank</span>
                  <span>Next Rank</span>
                </div>
                <Progress value={progressToNextRank} className="h-2 bg-white/10" indicatorClassName="bg-gradient-to-r from-orange-500 to-yellow-500" />
              </div>
            </div>

            {/* Big Currency Display (Pawpsicles) */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center min-w-[120px]">
               <div className="bg-red-500/20 p-2 rounded-full mb-2">
                 <IceCream className="w-6 h-6 text-red-400" />
               </div>
               <span className="text-2xl font-bold text-white">{pawpsicles}</span>
               <span className="text-xs text-white/50 uppercase tracking-wider">Pawpsicles</span>
            </div>
          </div>

          {/* --- MAIN STATS GRID --- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard 
              icon={Clock} 
              color="text-blue-400" 
              bg="bg-blue-400/10" 
              value={`${Math.floor(userStats.totalFocusMinutes / 60)}h ${userStats.totalFocusMinutes % 60}m`} 
              label="Total Focus" 
            />
            <StatCard 
              icon={Flame} 
              color="text-orange-400" 
              bg="bg-orange-400/10" 
              value={userStats.currentStreak} 
              label="Day Streak" 
            />
            <StatCard 
              icon={Trophy} 
              color="text-yellow-400" 
              bg="bg-yellow-400/10" 
              value={userStats.bestStreak} 
              label="Best Streak" 
            />
            <StatCard 
              icon={MapPin} 
              color="text-green-400" 
              bg="bg-green-400/10" 
              value={userStats.regionsUnlocked} 
              label="Districts Open" 
            />
          </div>

          {/* --- DETAILED METRICS / ACHIEVEMENTS --- */}
          <div className="space-y-4">
            <h3 className="text-white font-display text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> 
              Performance Stats
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Daily Average */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Daily Average</p>
                    <p className="text-xs text-white/50">Last 7 Days</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-white">45m</span>
              </div>

              {/* Total Sessions */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Star className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Focus Sessions</p>
                    <p className="text-xs text-white/50">Completed</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-white">{userStats.sessionsCompleted}</span>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
             <Button variant="ghost" onClick={onClose} className="text-white/60 hover:text-white hover:bg-white/10">
               Close Profile
             </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

// Simple Sub-component for individual stats
function StatCard({ icon: Icon, color, bg, value, label }) {
  return (
    <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors">
      <div className={`p-2 rounded-full ${bg} mb-2`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <span className="text-xl font-bold text-white font-display">{value}</span>
      <span className="text-xs text-white/50 uppercase tracking-wider mt-1">{label}</span>
    </div>
  );
}