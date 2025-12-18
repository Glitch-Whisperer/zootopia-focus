import { useState } from 'react';
import { User, Lock, Mail, ArrowRight, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Ensure this path points to your Zootopia city image
import zootopiaCityBg from '@/assets/landing.jpg'; 

export function LandingPage({ onAuthSuccess }) {
  const [view, setView] = useState('welcome'); // 'welcome', 'login', 'signup'
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null); // To show success message
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleAuth = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);
    
    // Simulate Network Request
    setTimeout(() => {
      setIsLoading(false);

      if (view === 'signup') {
        // --- SIGN UP FLOW ---
        // 1. Don't log in yet.
        // 2. Show success message.
        setNotification("Registration successful! Please login with your badge.");
        // 3. Switch to Login view.
        setView('login');
        // 4. Clear password field for realism
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        // --- LOGIN FLOW ---
        // 1. Create User Session
        const user = {
          id: 'citizen_' + Math.random().toString(36).substr(2, 9),
          name: formData.name || 'Citizen',
          email: formData.email
        };
        // 2. Save Session
        localStorage.setItem('metrofocus-user', JSON.stringify(user));
        // 3. Trigger Parent to switch to Character Selection
        onAuthSuccess(user);
      }
    }, 1500);
  };

  // Zootopia Logo Color Gradient (Teal/Cyan/Greenish)
  const zootopiaBtnClass = "bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 shadow-[0_0_20px_rgba(45,212,191,0.3)] text-white text-shadow-sm";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white font-sans">
      
      {/* --- BACKGROUND --- */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${zootopiaCityBg})`,
          animation: 'slowZoom 40s linear infinite alternate'
        }}
      />
      
      {/* --- CONTENT --- */}
      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center">
        
        {/* Header Logo */}
        <div className={`text-center mb-8 transition-all duration-500 ${view !== 'welcome' ? 'scale-90' : 'scale-100'}`}>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 shadow-[0_4px_20px_rgba(0,0,0,0.5)] mb-4">
             <MapPin className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-display text-5xl text-white tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            FocusHabitat
          </h1>
          <p className="text-lg text-white font-medium tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-2">
            "In Zootopia, anyone can be anything."
          </p>
        </div>

        {/* --- GLASS CARD --- */}
        <div className="w-full backdrop-blur-xl bg-black/60 border border-white/20 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-slide-up ring-1 ring-white/10">
          
          {/* Notification Banner (e.g. "Registration Successful") */}
          {notification && (
            <div className="mb-6 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg flex items-center gap-2 text-emerald-100 text-sm animate-fade-in">
              <CheckCircle className="w-4 h-4" />
              {notification}
            </div>
          )}

          {view === 'welcome' && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-center text-white text-lg leading-relaxed font-light drop-shadow-md">
                Ready to make your mark on the city? From Savanna Central to Tundratown, your journey begins now.
              </p>
              
              <div className="space-y-3 pt-2">
                <Button 
                  onClick={() => setView('signup')}
                  className={`w-full h-14 text-lg border-0 font-bold tracking-wide transition-transform hover:scale-[1.02] ${zootopiaBtnClass}`}
                >
                  Start Your Hustle <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <Button 
                  onClick={() => setView('login')}
                  variant="ghost" 
                  className="w-full h-12 text-white hover:bg-white/10 hover:text-cyan-200 transition-colors"
                >
                  Already a Citizen? Login
                </Button>
              </div>
            </div>
          )}

          {(view === 'login' || view === 'signup') && (
            <form onSubmit={handleAuth} className="space-y-4 animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-display text-white drop-shadow-md">
                  {view === 'login' ? 'Welcome Back' : 'New Citizen ID'}
                </h2>
                <p className="text-white/70 text-sm mt-1">
                  {view === 'login' ? 'Resume your hustle' : 'Get your official paw-print ID'}
                </p>
              </div>

              {view === 'signup' && (
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-white/60 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Citizen Name"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500/80 focus:bg-black/60 transition-all backdrop-blur-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-white/60 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="email" 
                  placeholder="Email Address"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500/80 focus:bg-black/60 transition-all backdrop-blur-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-white/60 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="password" 
                  placeholder="Password"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500/80 focus:bg-black/60 transition-all backdrop-blur-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className={`w-full h-14 mt-6 text-lg border-0 font-bold transition-transform hover:scale-[1.02] ${zootopiaBtnClass}`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2 animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" /> Processing...
                  </span>
                ) : (
                  view === 'login' ? 'Enter Zootopia' : 'Create ID'
                )}
              </Button>

              <button 
                type="button"
                onClick={() => {
                   setView(view === 'login' ? 'signup' : 'login');
                   setNotification(null);
                }}
                className="w-full text-center text-sm text-white/60 hover:text-white mt-4 hover:underline transition-all"
              >
                {view === 'login' ? "New to the city? Sign Up" : "Already have a home? Login"}
              </button>
            </form>
          )}

        </div>
      </div>
      
      <style>{`
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}