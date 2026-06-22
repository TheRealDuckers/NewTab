import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Clock } from '@/app/components/Clock';
import { SearchBar } from '@/app/components/SearchBar';
import { WeatherWidget } from '@/app/components/WeatherWidget';
import { QuickLinks } from '@/app/components/QuickLinks';
import { BackgroundChanger } from '@/app/components/BackgroundChanger';
import { Settings } from '@/app/components/Settings';
import { useMagnetic } from '@/app/components/useMagnetic';

function MagneticButton({ onClick, title, children }: {
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

export default function App() {
  const [background, setBackground] = useState(
    'https://images.unsplash.com/photo-1597434429739-2574d7e06807?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920'
  );
  const [showSettings, setShowSettings] = useState(false);
  const [weatherKey, setWeatherKey] = useState(0);

  const handleSettingsChange = () => {
    setWeatherKey(prev => prev + 1);
  };

  return (
    <div className="size-full min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 size-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
        {/* Settings Button — Top Left */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <MagneticButton onClick={() => setShowSettings(true)} title="Settings">
            <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:rotate-90 transition-transform duration-300" />
          </MagneticButton>
        </div>

        {/* Weather Widget — Top Right */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <WeatherWidget key={weatherKey} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl px-2 sm:px-0">
          <Clock />
          <SearchBar />
          <QuickLinks />
        </div>
      </div>

      {/* Background Changer */}
      <BackgroundChanger onBackgroundChange={setBackground} />

      {/* Settings Modal */}
      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          onSettingsChange={handleSettingsChange}
        />
      )}
    </div>
  );
}
