import { useState } from 'react'
import '../App.css'
import kapraoData from '../data/priceKrapao.json'
import costOfLivingData from '../data/cost-of-living.json'

// สร้าง Interface สำหรับรับ Props จากตัวแม่
interface SearchProps {
  isListOpen: boolean;
  setIsListOpen: (isOpen: boolean) => void;
  view: 'list' | 'province';
  setView: (view: 'list' | 'province') => void;
  selectedProvince: string | null;
  setSelectedProvince: (province: string | null) => void;
  onStoreSelect: (embedLink: string) => void;
}

function Search({
  isListOpen,
  setIsListOpen,
  view,
  setView,
  selectedProvince,
  setSelectedProvince,
  onStoreSelect
}: SearchProps) {

  // เก็บ Search Query ไว้ที่เดิมเพราะใช้แค่ในหน้านี้
  const [searchQuery, setSearchQuery] = useState('');

  const provinces = kapraoData.data
    .map(item => item.province)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'th')); 

  const stores = kapraoData.data.flatMap(item => 
    item.store ? item.store.map(store => ({ ...store, provinceName: item.province })) : []
  ).sort((a, b) => a.name.localeCompare(b.name, 'th'));

  const filteredProvinces = provinces.filter(prov => 
    prov.includes(searchQuery)
  );

  const filteredStores = stores.filter(store => 
    store.name.includes(searchQuery) || 
    store.provinceName.includes(searchQuery) 
  );

  const provinceStores = stores.filter(s => s.provinceName === selectedProvince);
  
  const getAveragePrice = () => {
    if (provinceStores.length === 0) return 0;
    let total = 0;
    let count = 0;
    provinceStores.forEach(s => {
      const match = String(s.prices).match(/\d+/);
      if (match) {
        total += parseInt(match[0], 10);
        count++;
      }
    });
    return count > 0 ? Math.round(total / count) : 0;
  };

  const provinceCostData = costOfLivingData.cost_of_living.find(c => c.province === selectedProvince);
  const livingExpense = provinceCostData ? provinceCostData['living expenses'] : 0;
  const minimumWage = provinceCostData ? provinceCostData.Minimum_wage : 0;

  // ตรวจสอบว่าลิงก์ถูกต้องหรือไม่
  const getValidUrl = (locationData: string) => {
    if (!locationData) return null;
    const dataStr = String(locationData).trim();
    return dataStr.startsWith('http') ? dataStr : null;
  };

  // อัปเดตเมื่อคลิกร้านค้า
  const handleStoreClick = (storeName: string, provinceName: string, locationString: string) => {
    let url = getValidUrl(locationString);
    
    if (!url) {
      console.log(`[Auto-Generate] สร้างลิงก์ค้นหาให้: ${storeName}`);
      const query = encodeURIComponent(`${storeName} ${provinceName}`);
      url = `http://googleusercontent.com/maps.google.com/search?q=${query}&output=embed`;
    }

    onStoreSelect(url); 
    handleCloseSearch(); 
  };

  const handleProvinceClick = (provinceName: string) => {
    setSelectedProvince(provinceName);
    setView('province');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedProvince(null);
  };

  const handleCloseSearch = () => {
    setIsListOpen(false);
    setSearchQuery(''); 
    setView('list'); 
  };

  return (
    <div className='w-full max-w-2xl relative flex flex-col gap-2 z-50'>

        {/* -------------- Background กลับมาทำงานได้ปกติแล้ว ----------------- */}
        <div 
          className={`
              fixed inset-0 bg-white/50 backdrop-blur-sm z-40 transition-opacity duration-300 ease-out
              ${isListOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
          onClick={handleCloseSearch} 
        />
      
        {/* ---------------- Search Bar ---------------- */}
        <div 
            className={`flex items-center gap-3 bg-white/95 backdrop-blur-md shadow-xl rounded-full px-4 py-3 transition-all z-50 ${isListOpen ? 'ring-2 ring-orange-400' : 'hover:shadow-2xl cursor-pointer'}`}
            onClick={() => { if (!isListOpen) setIsListOpen(true) }} 
        >
            <div 
              className='flex-none cursor-pointer p-1 -ml-1 rounded-full hover:bg-slate-100 transition'
              onClick={(e) => {
                if (isListOpen) {
                  e.stopPropagation(); 
                  handleCloseSearch();
                }
              }}
            >
              {isListOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
              )}
            </div>

            <div className='grow flex items-center text-slate-800'>
              {isListOpen ? (
                <input 
                  type="text"
                  autoFocus 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="พิมพ์ชื่อจังหวัด หรือ ร้านอาหาร..."
                  className="w-full bg-transparent outline-none text-sm md:text-base text-slate-800 placeholder-slate-400"
                />
              ) : (
                <div className='text-sm md:text-base text-slate-500 font-medium select-none'>
                  ค้นหา (จังหวัด, ร้านอาหาร)
                </div>
              )}
            </div>

            <div className='flex-none'>
              <div className='rounded-lg hover:bg-slate-200 p-1 transition'>
                    {!isListOpen && 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>}
              </div>
            </div>
        </div>

        {/* ---------------- Dropdown Content ---------------- */}
        {isListOpen && (
            <div className="absolute top-[120%] left-0 right-0 bg-white shadow-2xl rounded-3xl overflow-hidden z-50 flex flex-col max-h-[75vh] animate-in fade-in zoom-in-95 slide-in-from-top-4 origin-top duration-200">
                <div className="overflow-y-auto custom-scrollbar flex-1 flex flex-col">

                  {/* VIEW 1: หน้า List รวม */}
                  {view === 'list' && (
                  <div className="p-4 space-y-6">
                      {filteredProvinces.length > 0 && (
                        <section>
                          <div className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-tighter px-3">
                              📍 จังหวัด
                          </div>
                          <div className="grid grid-cols-1 gap-1">
                              {filteredProvinces.map((prov, index) => (
                              <button
                                  key={`prov-${index}`}
                                  onClick={() => handleProvinceClick(prov)}
                                  className="text-left px-4 py-3 hover:bg-orange-100 rounded-2xl transition-all text-slate-700 font-medium flex justify-between items-center group"
                              >
                                  <span>{prov}</span>
                                  <span className="text-slate-300 group-hover:text-orange-500 transition-transform group-hover:translate-x-1">→</span>
                              </button>
                              ))}
                          </div>
                        </section>
                      )}

                      {filteredProvinces.length > 0 && filteredStores.length > 0 && (
                        <div className="h-px bg-slate-100 mx-3"></div>
                      )}

                      {filteredStores.length > 0 && (
                        <section>
                          <div className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-tighter px-3">
                              🍳 ร้านแนะนำ
                          </div>
                          <div className="flex flex-col gap-1">
                              {filteredStores.map((store, index) => (
                              <button
                                  key={`store-${index}`}
                                  onClick={() => handleStoreClick(store.name, store.provinceName, store.location)}
                                  className="text-left px-4 py-3 hover:bg-[#DFDFDF] rounded-2xl transition-all flex flex-col border border-transparent"
                              >
                                  <span className="text-slate-800 font-bold">{store.name}</span>
                                  <span className="text-xs text-slate-500 mt-1">จ.{store.provinceName} • {store.prices} ฿</span>
                              </button>
                              ))}
                          </div>
                        </section>
                      )}

                      {filteredProvinces.length === 0 && filteredStores.length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                          <p className="text-lg mb-2">🥲</p>
                          <p>ไม่พบจังหวัดหรือร้านค้าที่คุณค้นหา</p>
                        </div>
                      )}
                  </div>
                  )}

              {/* VIEW 2: หน้ารายละเอียดจังหวัด */}
              {view === 'province' && (
                <div className="p-4 flex flex-col h-full animate-in slide-in-from-right duration-300">
                  <button 
                    onClick={handleBackToList}
                    className="mb-4 text-sm font-bold text-orange-600 flex items-center gap-1 hover:bg-orange-50 w-fit px-3 py-1.5 rounded-full transition"
                  >
                    ← กลับไปหน้าค้นหา
                  </button>
                  
                  <div className="px-2 mb-4">
                    <h2 className="text-2xl font-black text-slate-800 mb-1">จังหวัด{selectedProvince}</h2>
                    <p className="text-slate-500 text-sm">สถิติและร้านกะเพราหมูกรอบในพื้นที่</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 px-2 mb-6">
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-orange-600 uppercase mb-1">กะเพราเฉลี่ย</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-orange-700">{getAveragePrice()}</span>
                        <span className="text-sm font-medium text-orange-600">บาท</span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">ค่าครองชีพ/เดือน</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-slate-700">{livingExpense.toLocaleString()}</span>
                        <span className="text-sm font-medium text-slate-500">บาท</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1">ค่าแรง: {minimumWage} ฿/วัน</span>
                    </div>
                  </div>

                  <div className="px-2 flex-1 flex flex-col min-h-0">
                    <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      🍳 ร้านกะเพราในจังหวัด ({provinceStores.length})
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
                      {provinceStores.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {provinceStores.map((store, index) => (
                            <button
                                key={`store-detail-${index}`}
                                onClick={() => handleStoreClick(store.name, store.provinceName, store.location)}
                                className="text-left p-4 hover:bg-[#DFDFDF] bg-slate-50 rounded-2xl transition-all flex justify-between items-center group border border-slate-100 hover:border-transparent"
                            >
                                <div className="flex flex-col">
                                  <span className="text-slate-800 font-bold">{store.name}</span>
                                  <span className="text-xs text-orange-600 font-medium mt-1">{store.prices} บาท</span>
                                </div>
                                <span className="text-slate-300 group-hover:text-slate-600 transition-transform group-hover:translate-x-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <p>ยังไม่มีข้อมูลร้านในจังหวัดนี้</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

                </div>
            </div>
        )}

    </div>
  )
}

export default Search