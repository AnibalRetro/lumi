import { useContext, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { AppDataContext } from '../App';
import * as Icons from 'lucide-react';

const nav = [
  ['rutina', 'Mi rutina', 'Calendar', 'bg-orange-100 border-orange-200'],
  ['emociones', 'Cómo me siento', 'Heart', 'bg-yellow-100 border-yellow-200'],
  ['necesito', 'Qué necesito', 'MessageCircle', 'bg-green-100 border-green-200'],
  ['me-duele', 'Me duele', 'Cross', 'bg-red-100 border-red-200'],
  ['cambio', 'Cambio de planes', 'RefreshCw', 'bg-purple-100 border-purple-200'],
  ['logros', 'Mis logros', 'Trophy', 'bg-cyan-100 border-cyan-200'],
] as const;

const Icon = ({ name }: { name: string }) => {
  const Cmp = (Icons as any)[name] || Icons.Circle;
  return <Cmp size={28} />;
};

function Home() {
  return <div className='space-y-6'>
    <h2 className='text-3xl font-bold font-child'>¿Qué quieres hacer hoy?</h2>
    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>{nav.map(([p, l, i, c]) => <Link key={p} to={p} className={`btn-child ${c} flex items-center gap-3`}><Icon name={i} /> {l}</Link>)}</div>
  </div>;
}

function Routine() {
  const { data, setData } = useContext(AppDataContext); const r = data.routines[0];
  const done = r.activities.filter(a => a.status === 'hecho').length;
  const mark = (id: string) => setData(d => ({ ...d, routines: d.routines.map((rr, i) => i ? rr : { ...rr, activities: rr.activities.map(a => a.id === id ? { ...a, status: a.status === 'hecho' ? 'pendiente' : 'hecho' } : a) }), progress: { ...d.progress, routinesCompleted: d.progress.routinesCompleted + 1 } }));
  return <div className='card-lumi space-y-4'><h2 className='text-3xl font-child font-bold'>{r.name}</h2><p className='text-slate-600'>Llevas {done} de {r.activities.length} actividades</p><div className='w-full bg-slate-100 rounded-full h-3'><div className='bg-lumi-olive h-3 rounded-full' style={{ width: `${(done / Math.max(r.activities.length, 1)) * 100}%` }} /></div>{r.activities.map(a => <button key={a.id} onClick={() => mark(a.id)} className='w-full p-4 rounded-2xl border bg-white flex justify-between'><span>{a.name}</span><span className='text-sm uppercase'>{a.status}</span></button>)}<div className='grid grid-cols-3 gap-2 text-sm'><button className='p-2 rounded-xl bg-amber-50'>Necesito más tiempo</button><button className='p-2 rounded-xl bg-blue-50'>Pausa</button><button className='p-2 rounded-xl bg-purple-50'>Hubo un cambio</button></div></div>;
}

function Emotions() { const { data, setData } = useContext(AppDataContext); const [e, setE] = useState(''); const [i, setI] = useState(''); const em = data.emotions.find(x => x.id === e); return <div className='space-y-4'><h2 className='text-3xl font-child font-bold'>¿Cómo me siento?</h2>{!e && <div className='grid md:grid-cols-3 gap-3'>{data.emotions.map(x => <button key={x.id} onClick={() => setE(x.id)} className={`p-4 rounded-2xl border ${x.color}`}>{x.name}</button>)}</div>}{e && !i && <div className='flex gap-2'>{['poquito', 'medio', 'mucho'].map(x => <button key={x} onClick={() => setI(x)} className='btn-child bg-white border-slate-200'>{x}</button>)}</div>}{em && i && <div className='card-lumi'><p className='text-2xl font-child mb-2'>Estoy {em.name.toLowerCase()} {i}.</p><p className='mb-2'>¿Qué necesito?</p><div className='flex flex-wrap gap-2'>{em.strategies.map(s => <button key={s} onClick={() => setData(d => ({ ...d, progress: { ...d.progress, emotionsLogged: d.progress.emotionsLogged + 1 } }))} className='px-4 py-2 rounded-full bg-slate-100'>{s}</button>)}</div></div>}</div>; }

function Needs() { const { data, setData } = useContext(AppDataContext); const [phrase, setPhrase] = useState(''); const grouped = data.needs.filter(n => n.active).reduce((acc: any, n) => ((acc[n.category] ||= []).push(n), acc), {}); return <div className='space-y-4'><h2 className='text-3xl font-child font-bold'>¿Qué necesito?</h2>{phrase && <div className='bg-slate-900 text-white rounded-3xl p-6 text-4xl font-child'>{phrase}</div>}{Object.entries(grouped).map(([cat, items]: any) => <div key={cat} className='card-lumi'><h3 className='font-bold mb-2'>{cat}</h3><div className='flex flex-wrap gap-2'>{items.map((n: any) => <button key={n.id} onClick={() => { setPhrase(n.phrase); setData(d => ({ ...d, progress: { ...d.progress, needsUsed: d.progress.needsUsed + 1 } })); }} className='px-4 py-2 rounded-2xl border bg-white'>{n.name}</button>)}</div></div>)}</div>; }

function Pain() { const { data, setData } = useContext(AppDataContext); const [area, setArea] = useState(''); const [intensity, setIntensity] = useState(''); const add = (action: string) => setData(d => ({ ...d, painLogs: [{ id: Date.now().toString(), date: new Date().toISOString(), area, intensity: intensity as any, action }, ...d.painLogs], progress: { ...d.progress, painReports: d.progress.painReports + 1 } })); return <div className='space-y-4'><h2 className='text-3xl font-child font-bold'>¿Dónde te duele?</h2>{!area && <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>{data.painAreas.map(a => <button key={a.id} onClick={() => setArea(a.name)} className='p-3 rounded-2xl bg-white border'>{a.name}</button>)}</div>}{area && !intensity && <div className='flex gap-2'>{['poquito', 'medio', 'mucho'].map(x => <button key={x} onClick={() => setIntensity(x)} className='btn-child bg-white border-slate-200'>{x}</button>)}</div>}{area && intensity && <div className='card-lumi'><p className='text-2xl font-child'>Me duele {area.toLowerCase()} {intensity}.</p><div className='flex flex-wrap gap-2 mt-3'>{['Pedir ayuda', 'Avisar a mamá/papá', 'Descansar', 'Tomar agua', 'Ir a un lugar tranquilo'].map(a => <button key={a} onClick={() => add(a)} className='px-4 py-2 rounded-full bg-red-50'>{a}</button>)}</div></div>}</div>; }

function Change() { const { data, setData } = useContext(AppDataContext); const active = data.changePlans.find(c => c.active) || data.changePlans[0]; return <div className='card-lumi space-y-3'><h2 className='text-3xl font-child font-bold'>Hoy algo cambió</h2><p><b>Antes:</b> {active.before}</p><p><b>Ahora:</b> {active.now}</p><p><b>Esto sigue igual:</b> {active.same}</p><p><b>Puedes hacer:</b> {active.canDo}</p><div className='flex flex-wrap gap-2'>{['Estoy triste', 'Estoy enojado', 'Necesito ayuda', 'Quiero respirar', 'Quiero descansar'].map(x => <button key={x} onClick={() => setData(d => ({ ...d, progress: { ...d.progress, planChangesViewed: d.progress.planChangesViewed + 1 } }))} className='px-4 py-2 rounded-full bg-purple-50'>{x}</button>)}</div></div>; }

function Ach() { const { data } = useContext(AppDataContext); return <div className='card-lumi'><h2 className='text-3xl font-child font-bold mb-3'>Mis logros</h2><div className='grid md:grid-cols-3 gap-3 mb-3'>{['Completé una rutina', 'Pedí ayuda', 'Dije cómo me siento', 'Usé zona de calma', 'Intenté algo nuevo'].map(x => <div key={x} className='p-4 rounded-2xl bg-emerald-50'>{x}</div>)}</div><p className='text-lumi-olive font-bold'>Buen intento. Lo lograste. Gracias por intentarlo.</p><pre className='text-xs mt-3 bg-slate-50 p-3 rounded-xl'>{JSON.stringify(data.progress, null, 2)}</pre></div>; }

export default function () { return <Routes><Route path='/' element={<Home />} /><Route path='rutina' element={<Routine />} /><Route path='emociones' element={<Emotions />} /><Route path='necesito' element={<Needs />} /><Route path='me-duele' element={<Pain />} /><Route path='cambio' element={<Change />} /><Route path='logros' element={<Ach />} /></Routes>; }
