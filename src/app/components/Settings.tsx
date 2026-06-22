import { useState } from 'react';
import { X, MapPin, Thermometer, Image as ImageIcon, Upload, Trash2, Link, Plus, Pencil, Check, GripVertical } from 'lucide-react';

interface SettingsProps {
  onClose: () => void;
  onSettingsChange: () => void;
}

export interface AppSettings {
  weatherLocation: string;
  temperatureUnit: 'F' | 'C';
  customBackgrounds: string[];
}

export interface QuickLink {
  id: string;
  name: string;
  url: string;
  emoji?: string;
}

const LINKS_KEY = 'newtab-quicklinks';

const defaultLinks: QuickLink[] = [
  { id: 'gmail', name: 'Gmail', url: 'https://mail.google.com', emoji: '📧' },
  { id: 'youtube', name: 'YouTube', url: 'https://youtube.com', emoji: '▶️' },
  { id: 'github', name: 'GitHub', url: 'https://github.com', emoji: '🐙' },
  { id: 'twitter', name: 'Twitter', url: 'https://twitter.com', emoji: '🐦' },
  { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com', emoji: '💼' },
  { id: 'calendar', name: 'Calendar', url: 'https://calendar.google.com', emoji: '📅' },
];

export function loadLinks(): QuickLink[] {
  try {
    const saved = localStorage.getItem(LINKS_KEY);
    return saved ? JSON.parse(saved) : defaultLinks;
  } catch {
    return defaultLinks;
  }
}

export function saveLinks(links: QuickLink[]) {
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

interface LinkRowProps {
  link: QuickLink;
  onEdit: (link: QuickLink) => void;
  onDelete: (id: string) => void;
}

function LinkRow({ link, onEdit, onDelete }: LinkRowProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(link.name);
  const [url, setUrl] = useState(link.url);
  const [emoji, setEmoji] = useState(link.emoji ?? '');

  const commit = () => {
    if (!name.trim() || !url.trim()) return;
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl;
    onEdit({ ...link, name: name.trim(), url: finalUrl, emoji: emoji.trim() || undefined });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="rounded-2xl bg-white/25 border border-white/40 backdrop-blur-md p-3 flex flex-col gap-2 shadow-inner">
        <div className="flex gap-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name"
            className="flex-1 px-3 py-2 rounded-xl bg-white/40 border border-white/50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all" />
          <input value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="Emoji" maxLength={2}
            className="w-20 px-3 py-2 rounded-xl bg-white/40 border border-white/50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all" />
        </div>
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..."
          className="px-3 py-2 rounded-xl bg-white/40 border border-white/50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all" />
        <div className="flex justify-end gap-2">
          <button onClick={() => setEditing(false)}
            className="px-3 py-1.5 rounded-lg bg-white/30 border border-white/40 text-xs text-gray-600 hover:bg-white/50 transition-all">
            Cancel
          </button>
          <button onClick={commit}
            className="px-3 py-1.5 rounded-lg bg-white/60 border border-white/60 text-xs text-gray-800 font-medium shadow hover:bg-white/80 transition-all">
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-sm hover:bg-white/35 transition-all duration-200">
      <span className="text-base w-6 text-center shrink-0">{link.emoji ?? link.name[0]}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800 truncate">{link.name}</div>
        <div className="text-xs text-gray-500 truncate">{link.url}</div>
      </div>
      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button onClick={() => setEditing(true)}
          className="p-1.5 rounded-lg bg-white/50 border border-white/50 hover:bg-white/80 transition-all"
          title="Edit">
          <Pencil className="w-3.5 h-3.5 text-gray-600" />
        </button>
        <button onClick={() => onDelete(link.id)}
          className="p-1.5 rounded-lg bg-red-400/30 border border-red-300/40 hover:bg-red-400/60 transition-all"
          title="Remove">
          <Trash2 className="w-3.5 h-3.5 text-red-600" />
        </button>
      </div>
    </div>
  );
}

export function Settings({ onClose, onSettingsChange }: SettingsProps) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('newtab-settings');
    return saved ? JSON.parse(saved) : {
      weatherLocation: 'San Francisco',
      temperatureUnit: 'F',
      customBackgrounds: [],
    };
  });

  const [links, setLinks] = useState<QuickLink[]>(loadLinks);
  const [addingLink, setAddingLink] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newEmoji, setNewEmoji] = useState('');

  const handleSave = () => {
    localStorage.setItem('newtab-settings', JSON.stringify(settings));
    saveLinks(links);
    onSettingsChange();
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image size must be less than 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings(prev => ({ ...prev, customBackgrounds: [...prev.customBackgrounds, reader.result as string] }));
    };
    reader.readAsDataURL(file);
  };

  const removeCustomBackground = (index: number) => {
    setSettings(prev => ({ ...prev, customBackgrounds: prev.customBackgrounds.filter((_, i) => i !== index) }));
  };

  const handleEditLink = (updated: QuickLink) => {
    setLinks(links.map(l => l.id === updated.id ? updated : l));
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const handleAddLink = () => {
    if (!newName.trim() || !newUrl.trim()) return;
    let finalUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl;
    setLinks(prev => [...prev, {
      id: crypto.randomUUID(),
      name: newName.trim(),
      url: finalUrl,
      emoji: newEmoji.trim() || undefined,
    }]);
    setNewName(''); setNewUrl(''); setNewEmoji('');
    setAddingLink(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto
                      bg-white/30 backdrop-blur-2xl rounded-3xl
                      border border-white/50 shadow-[0_8px_64px_rgba(0,0,0,0.18)]">

        {/* Frosted header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 sm:px-8 py-5
                        bg-white/40 backdrop-blur-xl border-b border-white/40 rounded-t-3xl">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 tracking-tight">Settings</h2>
          <button onClick={onClose}
            className="p-2 rounded-full bg-white/30 border border-white/40 hover:bg-white/60 transition-all duration-200">
            <X className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        <div className="px-6 sm:px-8 py-6 space-y-8">

          {/* ── Weather ── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-white/40 border border-white/40">
                <MapPin className="w-4 h-4 text-gray-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-700">Weather</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 ml-1">Location</label>
                <input
                  type="text"
                  value={settings.weatherLocation}
                  onChange={e => setSettings({ ...settings, weatherLocation: e.target.value })}
                  placeholder="Enter city name"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/40 border border-white/50 backdrop-blur-sm
                             text-sm text-gray-800 placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-white/70 focus:bg-white/60 transition-all"
                />
                <p className="text-[11px] text-gray-400 mt-1.5 ml-1">
                  e.g. San Francisco, New York, London, Tokyo, Sydney…
                </p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 ml-1">Temperature Unit</label>
                <div className="flex gap-2">
                  {(['F', 'C'] as const).map(unit => (
                    <button key={unit}
                      onClick={() => setSettings({ ...settings, temperatureUnit: unit })}
                      className={`flex-1 py-2.5 rounded-xl border text-sm transition-all duration-200 flex items-center justify-center gap-2
                        ${settings.temperatureUnit === unit
                          ? 'bg-white/70 border-white/80 shadow-md text-gray-800 font-medium'
                          : 'bg-white/25 border-white/35 text-gray-600 hover:bg-white/45'}`}>
                      <Thermometer className="w-3.5 h-3.5" />
                      {unit === 'F' ? 'Fahrenheit' : 'Celsius'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-white/30" />

          {/* ── Quick Links ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/40 border border-white/40">
                  <Link className="w-4 h-4 text-gray-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-700">Quick Links</h3>
              </div>
              {!addingLink && (
                <button onClick={() => setAddingLink(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/40 border border-white/50 text-xs text-gray-600 hover:bg-white/60 transition-all">
                  <Plus className="w-3.5 h-3.5" /> Add shortcut
                </button>
              )}
            </div>

            {/* Add form */}
            {addingLink && (
              <div className="mb-3 rounded-2xl bg-white/25 border border-white/40 backdrop-blur-md p-4 space-y-2 shadow-inner">
                <div className="flex gap-2">
                  <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name"
                    className="flex-1 px-3 py-2 rounded-xl bg-white/40 border border-white/50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all" />
                  <input value={newEmoji} onChange={e => setNewEmoji(e.target.value)} placeholder="Emoji" maxLength={2}
                    className="w-20 px-3 py-2 rounded-xl bg-white/40 border border-white/50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all" />
                </div>
                <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://..."
                  onKeyDown={e => e.key === 'Enter' && handleAddLink()}
                  className="w-full px-3 py-2 rounded-xl bg-white/40 border border-white/50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all" />
                <div className="flex justify-end gap-2 pt-1">
                  <button onClick={() => { setAddingLink(false); setNewName(''); setNewUrl(''); setNewEmoji(''); }}
                    className="px-3 py-1.5 rounded-lg bg-white/30 border border-white/40 text-xs text-gray-600 hover:bg-white/50 transition-all">
                    Cancel
                  </button>
                  <button onClick={handleAddLink}
                    className="px-3 py-1.5 rounded-lg bg-white/60 border border-white/60 text-xs text-gray-800 font-medium shadow hover:bg-white/80 transition-all">
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Link list */}
            <div className="space-y-2">
              {links.map(link => (
                <LinkRow key={link.id} link={link} onEdit={handleEditLink} onDelete={handleDeleteLink} />
              ))}
              {links.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No shortcuts yet. Add one above.</p>
              )}
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-white/30" />

          {/* ── Custom Backgrounds ── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-white/40 border border-white/40">
                <ImageIcon className="w-4 h-4 text-gray-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-700">Custom Backgrounds</h3>
            </div>

            <label className="flex items-center justify-center gap-3 py-6 rounded-2xl
                             bg-white/20 border-2 border-dashed border-white/40
                             hover:bg-white/35 hover:border-white/60
                             transition-all duration-300 cursor-pointer group mb-3">
              <Upload className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
              <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Upload image</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            {settings.customBackgrounds.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {settings.customBackgrounds.map((bg, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-white/40 shadow">
                    <img src={bg} alt="" className="w-full h-20 sm:h-24 object-cover" />
                    <button onClick={() => removeCustomBackground(index)}
                      className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-black/40 backdrop-blur-sm
                               opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/80">
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[11px] text-gray-400 mt-2">Stored locally in your browser · max 5 MB each</p>
          </section>
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 flex gap-3 justify-end px-6 sm:px-8 py-4
                        bg-white/40 backdrop-blur-xl border-t border-white/40 rounded-b-3xl">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/30 border border-white/40 text-sm text-gray-600 hover:bg-white/50 transition-all">
            Cancel
          </button>
          <button onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-white/70 border border-white/60 text-sm text-gray-800 font-medium shadow-md hover:bg-white/90 transition-all">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export function getSettings(): AppSettings {
  const saved = localStorage.getItem('newtab-settings');
  return saved ? JSON.parse(saved) : {
    weatherLocation: 'San Francisco',
    temperatureUnit: 'F',
    customBackgrounds: [],
  };
}
