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
  
  const [activeEmbedLink, setActiveEmbedLink] = useState<string>('');

  const handleProvinceClickFromMap = (provinceName: string) => {
    setSelectedProvince(provinceName);
    setView('province');
    setIsListOpen(true);
  };

  return (
    <div className='relative h-screen w-full overflow-hidden bg-slate-50'>
      
      {/* Layer 0: พื้นหลังแผนที่ Leaflet */}
      <div className='absolute inset-0 z-0 flex items-center justify-center'>
        <BaseMap selectedProvince={selectedProvince} onProvinceClick={handleProvinceClickFromMap} />
      </div>

      {/* Layer 1: Google Map */}
      <GoogleMap 
        embedLink={activeEmbedLink} 
        onClose={() => setActiveEmbedLink('')} 
      />

      {/* Layer 2: โลโก้ */}
      <div className='absolute inset-0 z-20 flex items-baseline-last p-10 pointer-events-none'>
        <Logo />
      </div>

      {/* Layer 3: Search (แก้ตรงนี้: เปลี่ยนเป็น hidden แทนการใช้ transform) */}
      <div className={`absolute top-0 left-0 right-0 z-30 flex justify-center p-4 md:p-6 ${activeEmbedLink ? 'hidden' : ''}`}>
        <Search 
          isListOpen={isListOpen}
          setIsListOpen={setIsListOpen}
          view={view}
          setView={setView}
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          onStoreSelect={setActiveEmbedLink} 
        />
      </div>
      
    </div>
  )
}

export default App