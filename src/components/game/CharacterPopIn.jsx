import { useState, useEffect } from 'react';

// --- REPLACE WITH YOUR ACTUAL IMAGE PATHS ---
import judyImg from '../../assets/bunny.png'; // Ensure these exist
// import nickImg from '@/assets/nick-3d-transparent.png'; 

export function CharacterPopIn({ show, biome, onAnimationEnd }) {
  const [render, setRender] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const messages = {
    tundra: "Brrr! Great focus staying warm out there!",
    rainforest: "Excellent work navigating the jungle!",
    sahara: "Phew, hot streak! Time to cool down.",
    default: "Great hustle! You're making the world a better place."
  };

  useEffect(() => {
    if (show) {
      setRender(true);
      setTimeout(() => setAnimateIn(true), 50); 

      const hideTimer = setTimeout(() => {
        setAnimateIn(false);
      }, 4500);

      const cleanupTimer = setTimeout(() => {
        setRender(false);
        if (onAnimationEnd) onAnimationEnd();
      }, 5100); 

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(cleanupTimer);
      };
    }
  }, [show, onAnimationEnd]);

  if (!render) return null;

  const characterImg = judyImg; 
  const message = messages[biome] || messages.default;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 pointer-events-none flex justify-center h-screen items-end overflow-hidden pb-0">
        
        {/* Animation Wrapper */}
        <div className={`
          relative flex flex-col items-center md:block md:items-end 
          transition-transform duration-500 ease-out-back 
          ${animateIn ? 'translate-y-0' : 'translate-y-full'}
        `}>
           
           {/* Glass Speech Bubble */}
           <div className={`
             glass-panel bg-black/60 backdrop-blur-xl border border-white/20 shadow-2xl
             rounded-3xl p-4 md:p-6
             
             /* Mobile: Stacked above image, centered */
             relative mb-[-20px] z-20 max-w-[85%] text-center mx-auto
             
             /* Desktop: Floating to the side */
             md:absolute md:mb-0 md:bottom-[65%] md:right-[55%] md:text-left md:max-w-xs md:rounded-br-none md:mx-0
             
             /* Animation */
             origin-bottom transition-all duration-500 delay-300
             ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-10'}
           `}>
             <p className="text-sm md:text-xl text-white font-display leading-tight drop-shadow-md">
               "{message}"
             </p>
           </div>

           {/* Character Image */}
           <img 
               src={characterImg} 
               alt="Character" 
               className={`
                 /* Mobile Height: shorter to fit screen */
                 h-[50vh] 
                 /* Desktop Height: taller for impact */
                 md:h-[65vh] 
                 w-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]
               `} 
           />
        </div>
      </div>
  );
}