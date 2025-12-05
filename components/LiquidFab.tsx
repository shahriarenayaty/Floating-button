import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Video, Plus, Lock } from 'lucide-react';
import { FabMode, Ripple, LiquidFabProps } from '../types';

/**
 * LIQUID GLASS FAB COMPONENT
 * 
 * Features:
 * - Backdrop Blur for glass effect.
 * - Moving internal gradients (Aurora effect).
 * - Safe area awareness.
 * - Spring physics entrance.
 * - Interactive ripple effect.
 */

const MODE_CONFIG = {
  photo: {
    icon: Camera,
    text: 'Add Photo',
    accept: 'image/*',
    gradient: 'from-blue-400/30 via-purple-400/30 to-blue-400/30'
  },
  video: {
    icon: Video,
    text: 'Add Video',
    accept: 'video/*',
    gradient: 'from-red-400/30 via-orange-400/30 to-red-400/30'
  },
  mixed: {
    icon: Plus,
    text: 'Add Media',
    accept: 'image/*,video/*',
    gradient: 'from-emerald-400/30 via-cyan-400/30 to-emerald-400/30'
  },
  disabled: {
    icon: Lock,
    text: 'Archived',
    accept: '',
    gradient: 'from-gray-500/20 via-gray-400/20 to-gray-500/20'
  }
};

export const LiquidFab: React.FC<LiquidFabProps> = ({ mode, onUpload, onDisabledClick }) => {
  const config = MODE_CONFIG[mode];
  const Icon = config.icon;
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Ripple State
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 1. Handle Disabled State
    if (mode === 'disabled') {
      onDisabledClick();
      // Add a small shake or visual feedback for disabled click could go here
    } else {
      // 2. Trigger File Input
      inputRef.current?.click();
    }

    // 3. Create Ripple
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { x, y, id: Date.now() };
      setRipples((prev) => [...prev, newRipple]);
    }
  };

  // Cleanup ripples
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => setRipples([]), 1000);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept={config.accept}
        multiple
        onChange={(e) => onUpload(e.target.files)}
      />

      <div className="fixed bottom-[calc(24px+env(safe-area-inset-bottom))] left-0 right-0 z-50 flex justify-center pointer-events-none">
        <motion.button
          ref={buttonRef}
          onClick={handleClick}
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0 }}
          whileTap={{ scale: 0.95 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 30 
          }}
          className={`
            pointer-events-auto
            group relative overflow-hidden
            flex items-center gap-3 px-6 py-4
            rounded-full
            bg-white/10 
            backdrop-blur-xl
            border border-white/20
            shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
            transition-colors duration-500
            ${mode === 'disabled' ? 'grayscale opacity-80' : ''}
          `}
        >
          {/* 1. The Liquid Aurora Background */}
          {/* We animate this background to simulate fluid movement */}
          <motion.div 
            className={`absolute inset-[-50%] w-[200%] h-[200%] bg-gradient-to-r ${config.gradient} blur-2xl opacity-60`}
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* 2. Glass Shine/Sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

          {/* 3. Ripple Effect Container */}
          <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
            <AnimatePresence>
              {ripples.map((ripple) => (
                <motion.span
                  key={ripple.id}
                  initial={{ transform: "scale(0)", opacity: 0.5 }}
                  animate={{ transform: "scale(4)", opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    position: "absolute",
                    top: ripple.y - 20, // Center the ripple
                    left: ripple.x - 20,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    pointerEvents: "none",
                  }}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* 4. Content (Icon & Text) */}
          <div className="relative z-10 flex items-center gap-2">
            <motion.div
              key={mode} // Animates icon switch
              initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Icon size={22} className="text-white drop-shadow-md" />
            </motion.div>
            
            <motion.span 
              key={`${mode}-text`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[17px] font-semibold text-white tracking-wide drop-shadow-sm select-none"
            >
              {config.text}
            </motion.span>
          </div>
          
          {/* 5. Subtle Border Highlight (Bottom Edge) */}
          <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] pointer-events-none" />

        </motion.button>
      </div>
    </>
  );
};