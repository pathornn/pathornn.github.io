// src/components/GoogleMap.tsx
import '../App.css';

interface GoogleMapProps {
  embedLink: string; 
  onClose: () => void; // ฟังก์ชันสำหรับกดปิด
}

function GoogleMap({ embedLink, onClose }: GoogleMapProps) {
  return (
    // ย้าย div คลุมและแอนิเมชันซ่อน/แสดงมาไว้ที่นี่
    // ใช้ z-10 เพื่อให้อยู่เหนือ BaseMap แต่อยู่ใต้ Search
    <div 
      className={`absolute inset-0 z-10 transition-opacity duration-300 bg-slate-50 ${
        embedLink ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      
      {/* ปุ่มปิดแผนที่: จะโชว์ก็ต่อเมื่อมีลิงก์ */}
      {embedLink && (
        <button 
          onClick={onClose}
          className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md px-6 py-2 rounded-full shadow-lg text-sm font-bold text-slate-600 hover:text-red-500 hover:scale-105 transition"
        >
          ✕ ปิดแผนที่ร้าน
        </button>
      )}

      {/* iframe ของ Google Map */}
      {embedLink && (
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={embedLink}
        ></iframe>
      )}
      
    </div>
  );
}

export default GoogleMap;