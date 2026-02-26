// src/App.tsx
import { useState } from 'react'
import './App.css'
import BaseMap from './components/BaseMap'
import Search from './components/Search'
import Logo from './components/Logo'
import GoogleMap from './components/GoogleMap'

function App() {
  const [isListOpen, setIsListOpen] = useState(false);
  const [view, setView] = useState<'list' | 'province'>('list');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  const handleProvinceClickFromMap = (provinceName: string) => {
    setSelectedProvince(provinceName);
    setView('province');
    setIsListOpen(true);
  };

  return (
    <div className='relative h-screen w-full overflow-hidden bg-slate-50'>
      
      <div className='absolute inset-0 z-0 flex items-center justify-center'>
        {/* ส่ง selectedProvince ลงไปให้ BaseMap ด้วย */}
        <BaseMap 
          selectedProvince={selectedProvince} 
          onProvinceClick={handleProvinceClickFromMap} 
        />
      </div>

      <div className='hidden absolute inset-0 z-10 items-center justify-center pointer-events-none'>
        <GoogleMap />
      </div>

      <div className='absolute inset-0 z-2 flex items-baseline-last p-10 pointer-events-none'>
        <Logo />
      </div>

      <div className='absolute top-0 left-0 right-0 z-3 flex justify-center p-4 md:p-6'>
        <Search 
          isListOpen={isListOpen}
          setIsListOpen={setIsListOpen}
          view={view}
          setView={setView}
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
        />
      </div>
    </div>
  )
}

export default App