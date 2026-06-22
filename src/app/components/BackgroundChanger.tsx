import { useState } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Image } from 'lucide-react';
import { useMagnetic } from './useMagnetic';

const builtInBackgrounds = [
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1597434429739-2574d7e06807?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
];

function getCustomBackgrounds(): string[] {
  try {
    const saved = localStorage.getItem('newtab-settings');
    if (!saved) return [];
    const settings = JSON.parse(saved);
    return Array.isArray(settings.customBackgrounds) ? settings.customBackgrounds : [];
  } catch {
    return [];
  }
}

function MagneticIconButton({ onClick, title, children }: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const { ref, x, y } = useMagnetic({ strength: 0.5, radius: 70 });
  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      style={{ x, y }}
      onClick={onClick}
      title={title}
      className="p-2.5 sm:p-3 rounded-full bg-white/40 backdrop-blur-md border border-white/50
                 hover:bg-white/60 transition-[background,border,box-shadow] duration-200
                 shadow-lg hover:shadow-xl group"
    >
      {children}
    </motion.button>
  );
}

interface BackgroundChangerProps {
  onBackgroundChange: (url: string) => void;
}

export function BackgroundChanger({ onBackgroundChange }: BackgroundChangerProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [customBgs, setCustomBgs] = useState<string[]>([]);

  const openGallery = () => {
    setCustomBgs(getCustomBackgrounds());
    setShowGallery(true);
  };

  const changeBackground = (url: string) => {
    onBackgroundChange(url);
    setShowGallery(false);
  };

  const randomBackground = () => {
    const all = [...builtInBackgrounds, ...getCustomBackgrounds()];
    onBackgroundChange(all[Math.floor(Math.random() * all.length)]);
  };

  const allBackgrounds = [...builtInBackgrounds, ...customBgs];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <div className="flex flex-col gap-2 items-end">
        {showGallery && (
          <div className="bg-white/40 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-white/50 mb-2">
            <div className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 font-medium">Choose Background</div>
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {allBackgrounds.map((url, index) => (
                <button
                  key={index}
                  onClick={() => changeBackground(url)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-white/50
                           hover:border-white hover:scale-105 transition-all duration-300 shadow-md relative"
                >
                  <img src={url} alt={`Background ${index + 1}`} className="w-full h-full object-cover" />
                  {index >= builtInBackgrounds.length && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[9px] text-center py-0.5">
                      Custom
                    </div>
                  )}
                </button>
              ))}
            </div>
            {customBgs.length === 0 && (
              <p className="text-xs text-gray-500 mt-2">Upload custom images in Settings.</p>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <MagneticIconButton onClick={randomBackground} title="Random background">
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:rotate-180 transition-transform duration-500" />
          </MagneticIconButton>
          <MagneticIconButton onClick={showGallery ? () => setShowGallery(false) : openGallery} title="Choose background">
            <Image className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </MagneticIconButton>
        </div>
      </div>
    </div>
  );
}
