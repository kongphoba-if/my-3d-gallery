import { useState, useEffect } from 'react';
import { Menu, X, Maximize } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Extend intrinsic elements to allow <model-viewer> in JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        iosSrc?: string;
        alt?: string;
        ar?: boolean | string;
        'ar-modes'?: string;
        'camera-controls'?: boolean | string;
        'auto-rotate'?: boolean | string;
        'shadow-intensity'?: string;
        'camera-orbit'?: string;
        'environment-image'?: string;
        'exposure'?: string;
        style?: React.CSSProperties;
      }, HTMLElement>;
    }
  }
}

// 11 Placeholder Models - Using theme aesthetic names
const MODELS = [
  { id: 1, name: "AERO_PRO_MAX", src: "model1.glb" },
  { id: 2, name: "KINETIC_CORE", src: "model2.glb" },
  { id: 3, name: "VOID_SPHERE", src: "model3.glb" },
  { id: 4, name: "PRISM_LENS", src: "model4.glb" },
  { id: 5, name: "FLUX_FRAME", src: "model5.glb" },
  { id: 6, name: "NEO_STRUCTURE", src: "model6.glb" },
  { id: 7, name: "OMEGA_POINT", src: "model7.glb" },
  { id: 8, name: "DELTA_MESH", src: "model8.glb" },
  { id: 9, name: "TITAN_SHELL", src: "model9.glb" },
  { id: 10, name: "QUARTZ_GRID", src: "model10.glb" },
  { id: 11, name: "APEX_FORM", src: "model11.glb" }
];

export default function App() {
  const [activeModelId, setActiveModelId] = useState<number>(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Initialize model from URL parameter (?model=X)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modelParam = params.get('model');
    if (modelParam) {
      const modelId = parseInt(modelParam, 10);
      if (!isNaN(modelId) && modelId >= 1 && modelId <= 11) {
        setActiveModelId(modelId);
      }
    }
  }, []);

  const activeModel = MODELS.find(m => m.id === activeModelId) || MODELS[0];

  const selectModel = (id: number) => {
    setActiveModelId(id);
    setIsMenuOpen(false);
    // Update URL without refreshing the page
    const newUrl = `${window.location.pathname}?model=${id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#050505] text-white overflow-hidden relative font-['Helvetica_Neue',Helvetica,Arial,sans-serif]">
      
      {/* Top Navigation / Logo */}
      <header className="absolute top-0 left-0 w-full z-10 p-6 flex justify-between items-center pointer-events-none">
        <h1 className="text-[32px] font-black tracking-[-2px] uppercase text-white drop-shadow-md">
          Vizual / 3D
        </h1>
      </header>

      {/* Main 3D Canvas */}
      <main className="flex-1 w-full h-full relative z-0">
        <model-viewer
          src={activeModel.src}
          alt={`A 3D model of ${activeModel.name}`}
          ar="true"
          ar-modes="webxr scene-viewer quick-look"
          camera-controls="true"
          auto-rotate="true"
          shadow-intensity="1"
          style={{ 
            width: '100%', 
            height: '100%', 
            background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #050505 100%)' 
          }}
        >
          {/* Custom AR Button slot */}
          <button 
            slot="ar-button" 
            className="absolute top-8 right-8 bg-white text-black px-8 flex items-center justify-center h-12 text-[14px] font-black uppercase tracking-[1px] shadow-[10px_10px_0px_rgba(255,255,255,0.1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
          >
            <span className="hidden sm:inline mr-2">View in</span> AR
          </button>
        </model-viewer>

        {/* Current Info Overlay */}
        <div className="absolute top-32 left-6 sm:left-12 pointer-events-none z-10 max-w-[80%]">
          <h1 className="text-[50px] sm:text-[84px] leading-[0.8] m-0 font-black uppercase tracking-[-4px]">
            {activeModel.name.replace('_', ' ').replace('_', '\n').split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>
          <p className="opacity-50 text-[12px] mt-4 tracking-[1px] uppercase">
            INDUSTRIAL DESIGN ARCHIVE // VER 4.0.1
          </p>
        </div>
      </main>

      {/* Floating Menu Toggle Button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="absolute bottom-8 right-8 z-20 bg-white/10 border border-white/20 text-white px-5 py-4 text-[11px] font-bold uppercase tracking-[1px] backdrop-blur-md cursor-pointer hover:bg-white/20 active:bg-white active:text-black transition-colors"
        aria-label="Open model menu"
      >
        <span className="flex items-center space-x-2">
          <Menu className="w-4 h-4" />
          <span>Select Model</span>
        </span>
      </button>

      {/* Overlays / Bottom Sheet Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 z-30 bg-[#050505]/80 backdrop-blur-sm"
            />

            {/* Bottom Sheet styled brutally */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
              className="absolute bottom-0 left-0 w-full sm:w-[400px] sm:left-auto sm:right-0 sm:top-0 sm:border-l sm:border-t-0 sm:h-full z-40 bg-[#0f0f0f] border-t sm:transform-none border-[#222] shadow-2xl flex flex-col pt-4 max-h-[85vh] sm:max-h-full"
            >
              {/* Sheet Handle (mobile only) */}
              <div 
                className="w-full flex sm:hidden justify-center pb-4 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-16 h-1 bg-[#333]" />
              </div>

              {/* Sheet Header */}
              <div className="px-6 pb-6 pt-2 flex justify-between items-center sm:mt-8">
                <h2 className="text-[12px] font-black uppercase tracking-[2px] opacity-70">Model Collection</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="opacity-50 hover:opacity-100 transition-opacity"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Sheet List */}
              <div className="px-6 pb-4 overflow-y-auto overscroll-contain flex-1 custom-scrollbar">
                <div className="flex flex-col pb-12">
                  {MODELS.map((model) => {
                    const isActive = model.id === activeModelId;
                    return (
                      <button
                        key={model.id}
                        onClick={() => selectModel(model.id)}
                        className={`w-full flex items-baseline py-4 border-b transition-all ${
                          isActive 
                            ? 'opacity-100 border-white border-b-2 bg-white/5 px-2' 
                            : 'opacity-50 border-[#222] hover:opacity-100 hover:px-2 hover:bg-white/5'
                        }`}
                      >
                        <span className="text-[10px] font-bold w-12 text-left shrink-0">
                          {model.id.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[18px] font-bold uppercase text-left truncate">
                          {model.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Footer Status */}
              <div className="p-6 border-t border-[#222] bg-[#050505]">
                <div className="text-[10px] opacity-40 tracking-[1px] uppercase">
                  Engine: WebGL 2.0 / Active
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

