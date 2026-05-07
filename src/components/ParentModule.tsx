/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  BookText, 
  MapPin, 
  Download, 
  HeartHandshake, 
  Search,
  ExternalLink,
  Phone,
  Globe,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Calendar,
  ArrowRightLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import { clinics } from '../data/mockData';
import { getStorageItem, setStorageItem, LUMI_STORAGE_KEYS } from '../utils/storage';

interface ChildProfile {
  avatar: string;
  nickname: string;
  age: string;
  preferredTheme: string;
  readingLevel: string;
  supportStyle: string;
  sensitivities: string[];
  helpfulStrategies: string[];
}

const avatarOptions = ['🦊', '🐼', '🦁', '🐯', '🐬', '🦄'];
const readingLevelOptions = [
  'No lee todavía',
  'Reconoce letras',
  'Lee palabras cortas',
  'Lee frases simples',
];
const supportStyleOptions = ['Imágenes', 'Texto', 'Audio', 'Imágenes + texto', 'Imágenes + audio'];
const sensitivityOptions = ['Ruido', 'Luz', 'Texturas', 'Multitudes', 'Cambios de rutina', 'Contacto físico', 'Olores'];
const strategyOptions = ['Silencio', 'Audífonos', 'Respirar', 'Tomar agua', 'Descansar', 'Abrazo', 'Estar solo'];

const defaultChildProfile: ChildProfile = {
  avatar: avatarOptions[0],
  nickname: '',
  age: '',
  preferredTheme: '',
  readingLevel: readingLevelOptions[0],
  supportStyle: supportStyleOptions[0],
  sensitivities: [],
  helpfulStrategies: [],
};

// --- Parent Home ---

const ParentHome = () => {
  const categories = [
    { 
      path: 'autismo', 
      label: '¿Qué es el autismo?', 
      desc: 'Información clara y respetuosa sobre el neurodesarrollo.',
      icon: <BookText size={32} />,
      color: 'bg-indigo-50 border-indigo-100 text-indigo-700'
    },
    { 
      path: 'apoyo-casa', 
      label: 'Apoyo en casa', 
      desc: 'Consejos prácticos para el día a día y crisis sensoriales.',
      icon: <HeartHandshake size={32} />,
      color: 'bg-emerald-50 border-emerald-100 text-emerald-700'
    },
    { 
      path: 'perfil-nino',
      label: 'Perfil del niño',
      desc: 'Configura preferencias básicas para personalizar su experiencia.',
      icon: <HeartHandshake size={32} />,
      color: 'bg-violet-50 border-violet-100 text-violet-700'
    },
    {
      path: 'directorio', 
      label: 'Directorio México', 
      desc: 'Clínicas, asociaciones y centros especializados.',
      icon: <MapPin size={32} />,
      color: 'bg-blue-50 border-blue-100 text-blue-700'
    },
    { 
      path: 'recursos', 
      label: 'Recursos', 
      desc: 'Guías y materiales visuales para descargar e imprimir.',
      icon: <Download size={32} />,
      color: 'bg-amber-50 border-amber-100 text-amber-700'
    }
  ];

  return (
    <div className="space-y-12">
      <div className="max-w-2xl">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Guía para Padres y Cuidadores</h2>
        <p className="text-lg text-slate-600">
          Un espacio dedicado a brindarte información verificada, herramientas prácticas y apoyo en el camino del autismo.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <Link 
            key={cat.path} 
            to={cat.path}
            className={cn(
              "p-8 rounded-[32px] border-2 transition-all hover:shadow-md group flex items-start gap-6",
              cat.color
            )}
          >
            <div className="bg-white p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110">
              {cat.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">{cat.label}</h3>
              <p className="text-slate-600 font-medium">{cat.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="bg-slate-900 text-white p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Comunidad Lumi</h3>
          <p className="text-slate-400">Estamos trabajando en un foro seguro para conectar con otras familias.</p>
        </div>
        <div className="px-6 py-2 bg-white/10 rounded-full text-sm font-bold uppercase tracking-widest border border-white/20">Próximamente</div>
      </div>
    </div>
  );
};

const ChildProfilePage = () => {
  const [profile, setProfile] = useState<ChildProfile>(() => {
    return getStorageItem<ChildProfile>(LUMI_STORAGE_KEYS.childProfile, defaultChildProfile) ?? defaultChildProfile;
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setStorageItem(LUMI_STORAGE_KEYS.childProfile, profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const toggleArrayValue = (key: 'sensitivities' | 'helpfulStrategies', value: string) => {
    setProfile((prev) => {
      const hasValue = prev[key].includes(value);
      return {
        ...prev,
        [key]: hasValue ? prev[key].filter((item) => item !== value) : [...prev[key], value],
      };
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Perfil del niño</h2>
        <p className="text-slate-500">Configura datos básicos y preferencias de apoyo.</p>
      </div>

      <div className="card-lumi space-y-8">
        <section className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Avatar animado</p>
          <div className="flex flex-wrap gap-3">
            {avatarOptions.map((avatar) => (
              <button
                key={avatar}
                type="button"
                onClick={() => setProfile((prev) => ({ ...prev, avatar }))}
                className={cn(
                  'w-14 h-14 rounded-2xl border-2 text-3xl bg-white transition-all hover:scale-105',
                  profile.avatar === avatar ? 'border-lumi-olive shadow-sm' : 'border-slate-200'
                )}
              >
                {avatar}
              </button>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Nombre o apodo</span>
            <input
              value={profile.nickname}
              onChange={(e) => setProfile((prev) => ({ ...prev, nickname: e.target.value }))}
              placeholder="Ej. Alex"
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-lumi-olive"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Edad</span>
            <input
              value={profile.age}
              onChange={(e) => setProfile((prev) => ({ ...prev, age: e.target.value }))}
              placeholder="Ej. 7"
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-lumi-olive"
            />
          </label>
        </section>

        <label className="space-y-2 block">
          <span className="text-sm font-semibold text-slate-700">Color o tema preferido</span>
          <input
            value={profile.preferredTheme}
            onChange={(e) => setProfile((prev) => ({ ...prev, preferredTheme: e.target.value }))}
            placeholder="Ej. Azul, naturaleza, espacio..."
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-lumi-olive"
          />
        </label>

        <section className="grid md:grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Nivel de lectura</span>
            <select
              value={profile.readingLevel}
              onChange={(e) => setProfile((prev) => ({ ...prev, readingLevel: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-lumi-olive"
            >
              {readingLevelOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Forma de apoyo preferida</span>
            <select
              value={profile.supportStyle}
              onChange={(e) => setProfile((prev) => ({ ...prev, supportStyle: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-lumi-olive"
            >
              {supportStyleOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Sensibilidades comunes</p>
          <div className="flex flex-wrap gap-2">
            {sensitivityOptions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleArrayValue('sensitivities', item)}
                className={cn(
                  'px-4 py-2 rounded-full border text-sm font-medium transition-all',
                  profile.sensitivities.includes(item)
                    ? 'bg-amber-100 border-amber-300 text-amber-800'
                    : 'bg-white border-slate-200 text-slate-600'
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Estrategias que ayudan</p>
          <div className="flex flex-wrap gap-2">
            {strategyOptions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleArrayValue('helpfulStrategies', item)}
                className={cn(
                  'px-4 py-2 rounded-full border text-sm font-medium transition-all',
                  profile.helpfulStrategies.includes(item)
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600'
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-lumi-olive transition-all"
          >
            Guardar perfil
          </button>
          {saved && <span className="text-sm font-semibold text-emerald-700">Perfil guardado en este dispositivo.</span>}
        </div>
      </div>
    </div>
  );
};

// --- Autism Info ---

const AutismInfo = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-8">
      <section className="space-y-6">
        <h2 className="text-4xl font-bold text-slate-900">Entendiendo el Autismo</h2>
        <p className="text-xl text-slate-600 leading-relaxed">
          El Trastorno del Espectro Autista (TEA) es una condición del neurodesarrollo que acompaña a la persona a lo largo de su vida. 
          Influye en cómo las personas perciben el mundo e interactúan con los demás.
        </p>
      </section>

      <div className="grid gap-6">
        <div className="card-lumi bg-indigo-50/50 border-indigo-100">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-indigo-600" /> Comunicación y Lenguaje
          </h3>
          <p className="text-slate-600">Puede variar desde personas que no hablan hasta personas con un vocabulario muy amplio pero dificultades en el uso social del lenguaje.</p>
        </div>
        <div className="card-lumi bg-emerald-50/50 border-emerald-100">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-emerald-600" /> Interacción Social
          </h3>
          <p className="text-slate-600">Dificultad para entender normas sociales no escritas, expresiones faciales o tonos de voz.</p>
        </div>
        <div className="card-lumi bg-amber-50/50 border-amber-100">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-amber-600" /> Procesamiento Sensorial
          </h3>
          <p className="text-slate-600">Hipersensibilidad o hiposensibilidad a sonidos, luces, texturas, olores o sabores.</p>
        </div>
      </div>

      <div className="card-lumi border-l-8 border-l-lumi-olive">
        <h3 className="font-bold text-lg uppercase tracking-tight text-lumi-olive mb-2">Recordatorio importante</h3>
        <p className="text-slate-700 italic">"Si conoces a una persona con autismo, conoces solo a UNA persona con autismo." - Stephen Shore. No hay dos personas iguales en el espectro.</p>
      </div>
    </div>
  );
};

// --- Clinics Directory ---

const ClinicsDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClinics = clinics.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Directorio de Apoyo en México</h2>
          <p className="text-slate-500">Centros y asociaciones verificados informativamente.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por estado o nombre..." 
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClinics.map((clinic) => (
          <motion.div 
            layout
            key={clinic.id} 
            className="card-lumi hover:border-blue-200 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold leading-tight">{clinic.name}</h3>
                <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                  {clinic.city}
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2"><MapPin size={14} /> {clinic.state}</div>
                <div className="flex items-center gap-2"><Phone size={14} /> {clinic.phone}</div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Servicios</p>
                <div className="flex flex-wrap gap-2">
                  {clinic.services.map((s, idx) => (
                    <span key={idx} className="bg-slate-50 border border-slate-200 px-2 py-1 rounded text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <a 
              href={clinic.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-2xl text-sm font-bold hover:bg-lumi-olive transition-all"
            >
              Visitar Sitio <ExternalLink size={14} />
            </a>
          </motion.div>
        ))}
      </div>

      <div className="bg-lumi-soft-blue p-8 rounded-[32px] border border-blue-200 text-sm text-blue-900">
        <p><strong>Aviso:</strong> Los datos presentados son para fines informativos. Lumi no tiene relación comercial con estas instituciones. Verifica siempre la información directamente.</p>
      </div>
    </div>
  );
};

// --- Resources ---

const Resources = () => {
  const items = [
    { title: 'Rutina Visual Diario', type: 'PDF', icon: <Calendar />, color: 'bg-orange-100' },
    { title: 'Tarjetas de Emociones', type: 'ZIP / PNG', icon: <HeartHandshake />, color: 'bg-pink-100' },
    { title: 'Guía para el Dentista', type: 'PDF', icon: <BookText />, color: 'bg-indigo-100' },
    { title: 'Plantilla Primero / Después', type: 'Imprimible', icon: <ArrowRightLeft />, color: 'bg-emerald-100' },
  ];

  return (
    <div className="space-y-12">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold">Recursos Descargables</h2>
        <p className="text-slate-500">Material especializado para usar en casa, escuela o consultorio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-slate-800">
        {items.map((item, idx) => (
          <div key={idx} className="card-lumi flex items-center justify-between group cursor-pointer hover:border-lumi-olive transition-colors">
            <div className="flex items-center gap-6">
              <div className={cn("p-4 rounded-2xl", item.color)}>
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-lg">{item.title}</h4>
                <p className="text-sm opacity-50 font-medium">{item.type}</p>
              </div>
            </div>
            <div className="p-2 rounded-full border border-slate-200 group-hover:bg-lumi-olive group-hover:text-white transition-all">
              <Download size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Module Router ---

export default function ParentModule() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <Routes>
        <Route path="/" element={null} />
        <Route path="*" element={
          <button 
            onClick={() => navigate('/padres')}
            className="flex items-center gap-2 text-slate-400 hover:text-lumi-olive font-bold uppercase tracking-widest text-sm mb-10 transition-colors"
          >
            <ChevronLeft size={20} /> Regresar a la Guía
          </button>
        } />
      </Routes>

      <Routes>
        <Route path="/" element={<ParentHome />} />
        <Route path="/autismo" element={<AutismInfo />} />
        <Route path="/apoyo-casa" element={<div className="text-center py-20"><h2 className="text-3xl font-bold uppercase tracking-widest opacity-20">Contenido en construcción</h2></div>} />
        <Route path="/perfil-nino" element={<ChildProfilePage />} />
        <Route path="/directorio" element={<ClinicsDirectory />} />
        <Route path="/recursos" element={<Resources />} />
      </Routes>
    </div>
  );
}
