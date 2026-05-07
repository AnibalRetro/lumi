import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ChildModule from './components/ChildModule';
import ParentModule from './components/ParentModule';
import { createContext } from 'react';
import { AppData } from './types';
import { defaultData } from './data/defaultData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { storage } from './utils/storage';

export const AppDataContext = createContext<{data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; reset: ()=>void; clear: ()=>void;}>({data: defaultData, setData: ()=>{}, reset: ()=>{}, clear: ()=>{}});

function Home() {
  return <div className='grid md:grid-cols-2 gap-6 p-8'>
    <Link to='/nino' className='btn-child bg-blue-100 border-blue-200 text-center'>Modo niño</Link>
    <Link to='/padres' className='btn-child bg-green-100 border-green-200 text-center'>Modo padres</Link>
  </div>
}

export default function App(){
  const [data, setData] = useLocalStorage<AppData>('appData', defaultData);
  const reset = ()=> setData(defaultData);
  const clear = ()=> { storage.clearAll(); setData(defaultData); };
  const textClass = data.accessibility.textSize === 'muy-grande' ? 'text-2xl' : data.accessibility.textSize === 'grande' ? 'text-xl' : '';
  return <AppDataContext.Provider value={{data,setData,reset,clear}}>
    <Router>
      <div className={`min-h-screen ${data.accessibility.lowStimulus ? 'low-stimulus' : ''} ${textClass}`}>
        <header className='p-4 border-b bg-white flex justify-between'><Link to='/'>Lumi</Link><div>{data.profile.nickname ? `Hola, ${data.profile.nickname}` : 'Bienvenido'}</div></header>
        <main className='p-4'><Routes><Route path='/' element={<Home/>}/><Route path='/nino/*' element={<ChildModule/>}/><Route path='/padres/*' element={<ParentModule/>}/></Routes></main>
        <footer className='text-xs p-4 border-t'>Lumi es una herramienta de apoyo visual, educativo y familiar sin fines de lucro. No sustituye la evaluación, diagnóstico, tratamiento o acompañamiento de profesionales de salud, educación o terapia especializada.</footer>
      </div>
    </Router>
  </AppDataContext.Provider>
}
