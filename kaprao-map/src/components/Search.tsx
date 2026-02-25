import '../App.css'

function Search() {
  return (
    // search container
    <div className='w-full max-w-2x1'>
        <div className='flex items-center gap-3 bg-[#EDEDED] backdrop-blur-md shadow-x1 rounded-4xl px-4 py-3 transition-all hover:shadow-2xl'>
            {/* Search button */}
            <div className='flex-none'>
                <div className='rounded-lg cursor-pointer transition'>
                    <img src="../public/search_button.png" alt=""/>
                </div>
            </div>
            {/* Search box */}
            <div className='grow flex items-center text-slate-800'>
                <div className='text-sm md:text-base'>ค้นหา (จังหวัด ร้านอาหาร)</div>
            </div>
            {/* Setting button */}
            <div className='flex-none'>
                <div className='rounded-lg cursor-pointer transition'>
                    <img src="../public/settings_button.png" alt=""/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Search
