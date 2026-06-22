import { useState } from 'react';
import { motion } from 'motion/react';
import { loadLinks } from './Settings';
import { useMagnetic } from './useMagnetic';

function getFavicon(url: string) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return null;
  }
}

function LinkIcon({ name, url, emoji }: { name: string; url: string; emoji?: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const favicon = getFavicon(url);

  if (!imgFailed && favicon) {
    return <img src={favicon} alt="" className="w-6 h-6" onError={() => setImgFailed(true)} />;
  }
  if (emoji) return <span className="text-xl leading-none">{emoji}</span>;
  return <span className="text-lg font-bold text-gray-600">{name[0]?.toUpperCase()}</span>;
}

function MagneticLink({ link }: { link: { id: string; name: string; url: string; emoji?: string } }) {
  const { ref, x, y } = useMagnetic({ strength: 0.42, radius: 90 });

  return (
    <motion.a
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ x, y }}
      className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl
                 bg-white/40 backdrop-blur-md border border-white/50
                 hover:bg-white/65 hover:shadow-xl hover:border-white/70
                 transition-[background,border,box-shadow] duration-200 select-none"
    >
      <div className="flex items-center justify-center w-6 h-6">
        <LinkIcon name={link.name} url={link.url} emoji={link.emoji} />
      </div>
      <span className="text-xs text-gray-700 truncate max-w-[56px] text-center">{link.name}</span>
    </motion.a>
  );
}

export function QuickLinks() {
  const links = loadLinks();

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-0">
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {links.map(link => (
          <MagneticLink key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}
