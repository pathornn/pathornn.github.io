import './App.css'
import BaseMap from './components/BaseMap'
import Search from './components/Search'
import Logo from './components/Logo'
import GoogleMap from './components/GoogleMap'


function App() {
  return (
    <div className='relative h-screen w-full overflow-hidden bg-slate-50'>
      
      {/* layer 0 เป็นพื้นหลังแผนที่ leaflet */}
      <div className='absolute inset-0 z-0 flex items-center justify-center'>
        <BaseMap />
      </div>

      {/* layer 1 เป็นพื้นหลังแผนที่ google map */}
      <div className='hidden absolute inset-0 z-0 items-center justify-center'>
        <GoogleMap />
      </div>

      {/* layer 2 สำหรับแสดงโลโก้  */}
      <div className='absolute inset-0 z-2 flex items-baseline-last p-10'>
        <Logo />
      </div>

    {/* layer 3 เป็น search สำหรับค้นหา */}
      <div className='absolute top-0 left-0 right-0 z-3 flex justify-center p-4 md:p-6'>
        <Search />
      </div>
    </div>
  )
}

export default App
