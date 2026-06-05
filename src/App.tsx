import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ChildModule from './components/ChildModule';
import ParentModule from './components/ParentModule';
import { cn } from './lib/utils';
import { getStorageItem, setStorageItem, LUMI_STORAGE_KEYS } from './utils/storage';

// --- Context & Types ---

interface AppSettings {
  lowStimulus: boolean;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  motion: 'normal' | 'reducido';
  contrast: 'suave' | 'alto';
  showTextWithImages: boolean;
}

export const SettingsContext = createContext<{
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
}>({
  settings: {
    lowStimulus: false,
    soundEnabled: true,
    voiceEnabled: true,
    fontSize: 'normal',
    motion: 'normal',
    contrast: 'suave',
    showTextWithImages: true,
  },
  updateSettings: () => {},
});

// --- Components ---

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { settings, updateSettings } = useContext(SettingsContext);
  const location = useLocation();
  const isChildMode = location.pathname.startsWith('/nino');
  const isParentMode = location.pathname.startsWith('/padres');

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      settings.lowStimulus && "low-stimulus",
      settings.fontSize === 'large' && "text-xl",
      settings.fontSize === 'xlarge' && "text-2xl"
    )}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-bottom border-lumi-sand px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-lumi-olive rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110">
            <Heart size={24} fill="white" />
          </div>
          <div>
            <h1 className="font-bold text-2xl tracking-tight text-lumi-olive">Lumi</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Pequeños pasos</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => updateSettings({ lowStimulus: !settings.lowStimulus })}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            title="Modo bajo estímulo"
          >
            {settings.lowStimulus ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <button 
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            title="Sonidos"
          >
            {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          
          {(isChildMode || isParentMode) && (
            <Link to="/" className="flex items-center gap-1 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all">
              <HomeIcon size={16} />
              <span className="hidden sm:inline">Inicio</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: settings.motion === 'reducido' ? 0 : 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-lumi-sand py-8 px-6 mt-12 bg-white/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="font-bold text-lumi-olive mb-1">Make IT Group & AMI</p>
            <p className="text-sm text-slate-500 max-w-md">
              Proyecto sin fines de lucro en colaboración con la Asociación Mexicana de Ingeniería (AMI).
            </p>
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <Link to="/acerca-de" className="hover:text-lumi-olive transition-colors">Acerca de</Link>
            <Link to="/padres/directorio" className="hover:text-lumi-olive transition-colors">Directorio México</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-100 text-[10px] text-center text-slate-400 uppercase tracking-widest">
           Lumi es una herramienta de apoyo visual. No sustituye la opinión médica profesional.
        </div>
      </footer>
    </div>
  );
};

// --- Pages ---

const Home = () => {
  const { settings } = useContext(SettingsContext);
  const speak = (text: string) => {
    if (!settings.soundEnabled) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center py-12">
      <div className="space-y-8">
        <div className="inline-block px-4 py-1.5 bg-lumi-soft-yellow rounded-full text-sm font-bold text-amber-700 border border-amber-200">
          Versión Beta 1.0
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-[0.9] tracking-tighter text-slate-900">
          Acompañando <br />
          cada <span className="text-lumi-olive">pequeño</span> paso.
        </h1>
        <p className="text-lg text-slate-600 max-w-md">
          Herramientas visuales y recursos educativos diseñados para niños con autismo y sus familias.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <Link 
            to="/nino" 
            onClick={() => speak("Modo Niño")}
            className="flex flex-col items-center justify-center gap-4 bg-lumi-soft-blue p-8 rounded-[40px] border-2 border-blue-200 hover:border-blue-400 text-blue-900 transition-all hover:scale-[1.02]"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <Baby size={32} />
            </div>
            <span className="text-xl font-bold font-child">Modo Niño</span>
          </Link>
          
          <Link 
            to="/padres" 
            onClick={() => speak("Modo Padres")}
            className="flex flex-col items-center justify-center gap-4 bg-lumi-soft-green p-8 rounded-[40px] border-2 border-emerald-200 hover:border-emerald-400 text-emerald-900 transition-all hover:scale-[1.02]"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <Users size={32} />
            </div>
            <span className="text-xl font-bold font-child">Modo Padres</span>
          </Link>
        </div>
      </div>
      
      <div className="hidden md:block relative">
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-lumi-soft-yellow rounded-full blur-3xl opacity-50" />
        <div className="card-lumi transform rotate-2">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <Info size={24} />
              </div>
              <h3 className="font-bold text-xl">¿Qué es Lumi?</h3>
            </div>
            <p className="text-slate-600">
              Es una plataforma interactiva creada por Make IT Group y la AMI para ayudar a la comunicación y rutinas diarias.
            </p>
            <div className="pt-4 border-t border-slate-100">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Institución aliada</p>
              <p className="font-serif italic text-lg text-lumi-olive">Asociación Mexicana de Ingeniería</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    return getStorageItem<AppSettings>(LUMI_STORAGE_KEYS.accessibilitySettings, {
      lowStimulus: false,
      soundEnabled: true,
      voiceEnabled: true,
      fontSize: 'normal',
      motion: 'normal',
      contrast: 'suave',
      showTextWithImages: true,
    }) ?? {
      lowStimulus: false,
      soundEnabled: true,
      voiceEnabled: true,
      fontSize: 'normal',
      motion: 'normal',
      contrast: 'suave',
      showTextWithImages: true,
    };
  });

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  useEffect(() => {
    setStorageItem(LUMI_STORAGE_KEYS.accessibilitySettings, settings);
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Child Routes */}
            <Route path="/nino/*" element={<ChildModule />} />
            {/* Parent Routes */}
            <Route path="/padres/*" element={<ParentModule />} />
            <Route path="/acerca-de" element={<AboutPage />} />
          </Routes>
        </Layout>
      </Router>
    </SettingsContext.Provider>
  );
}
function AboutPage() { 
  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8">
      <h1 className="text-4xl font-bold text-lumi-olive">Acerca de Lumi</h1>
      <section className="space-y-4 text-lg text-slate-700 leading-relaxed">
        <p>
          Lumi nace de la necesidad de proporcionar herramientas digitales accesibles y amigables para niños con autismo. 
          Es una iniciativa social impulsada por <strong>Make IT Group</strong> en colaboración estratégica con la <strong>Asociación Mexicana de Ingeniería (AMI)</strong>.
        </p>
        <div className="bg-lumi-soft-red p-6 rounded-3xl border border-red-100 text-red-900 text-sm">
          <strong>Aviso Importante:</strong> Esta plataforma es una herramienta de apoyo visual y educativo. 
          No está diseñada para diagnosticar ni tratar condiciones médicas. La atención profesional especializada es indispensable.
        </div>
      </section>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-lumi">
          <h3 className="font-bold text-xl mb-2">Misión Social</h3>
          <p className="text-slate-600">Facilitar la comunicación y la estructuración del día a día mediante tecnología humana y empática.</p>
        </div>
        <div className="card-lumi">
          <h3 className="font-bold text-xl mb-2">Impacto en México</h3>
          <p className="text-slate-600">Buscamos centralizar recursos y directorios para que las familias encuentren el apoyo que necesitan.</p>
        </div>
      </div>
    </Router>
  </AppDataContext.Provider>
}
