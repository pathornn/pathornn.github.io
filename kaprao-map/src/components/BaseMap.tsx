// src/components/BaseMap.tsx
import { useRef, useEffect } from 'react' // <--- นำเข้า useEffect
import { MapContainer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import thailandGeoJSON from '../data/thailand-provinces.json'
import kapraoData from '../data/priceKrapao.json'
import { provinceMapping } from '../constants/provinces'

// อัปเดต Interface รับ Props เพิ่ม
interface BaseMapProps {
  selectedProvince: string | null;
  onProvinceClick: (provinceName: string) => void;
}

function BaseMap({ selectedProvince, onProvinceClick }: BaseMapProps) {
  const geoJsonRef = useRef<any>(null);
  const selectedLayerRef = useRef<any>(null);

  // ----------------------------------------------------
  // เพิ่ม useEffect ควบคุมการซูมและไฮไลต์เมื่อ State เปลี่ยน
  // ----------------------------------------------------
  useEffect(() => {
    if (!geoJsonRef.current) return;

    // ถ้าไม่มีจังหวัดที่เลือก (เช่น กดปุ่มย้อนกลับ หรือปิดหน้าต่าง) ให้ล้างการไฮไลต์
    if (!selectedProvince) {
      if (selectedLayerRef.current) {
        geoJsonRef.current.resetStyle(selectedLayerRef.current);
        selectedLayerRef.current = null;
      }
      return;
    }

    // วนลูปหา Layer ของจังหวัดที่ตรงกับ selectedProvince
    geoJsonRef.current.eachLayer((layer: any) => {
      const provinceEN = layer.feature.properties.NAME_1;
      const provinceTH = provinceMapping[provinceEN] || provinceEN;

      if (provinceTH === selectedProvince) {
        // 1. ซูมแผนที่ไปที่จังหวัดนั้น
        const map = layer._map || geoJsonRef.current._map;
        if (map) {
          map.fitBounds(layer.getBounds(), { padding: [50, 50] });
        }

        // 2. เคลียร์สีไฮไลต์จังหวัดเดิม (ถ้ามี)
        if (selectedLayerRef.current && selectedLayerRef.current !== layer) {
          geoJsonRef.current.resetStyle(selectedLayerRef.current);
        }

        // 3. ใส่ไฮไลต์ให้จังหวัดใหม่
        layer.setStyle({ weight: 5, color: '#0f172a' });
        selectedLayerRef.current = layer;
      }
    });
  }, [selectedProvince]); // โค้ดนี้จะทำงานทุกครั้งที่ selectedProvince เปลี่ยน
  // ----------------------------------------------------

  // คำนวณราคาเฉลี่ย
  function getAveragePrice(provinceNameTH: string): number {
    if (!provinceNameTH) return 0;
    const searchName = provinceNameTH.trim();
    const provinceInfo = kapraoData.data.find(p => p.province && p.province.trim() === searchName);
    if (!provinceInfo || !provinceInfo.store || provinceInfo.store.length === 0) return 0;
    
    let totalPrice = 0;
    let validStoresCount = 0;
    provinceInfo.store.forEach(store => {
      // @ts-ignore
      const rawPrice = store.prices || null; 
      if (rawPrice) {
        const match = String(rawPrice).match(/\d+/); 
        if (match) {
          const price = parseInt(match[0], 10);
          if (!isNaN(price) && price >= 10 && price <= 1000) {
            totalPrice += price;
            validStoresCount++;
          }
        }
      }
    });
    return validStoresCount > 0 ? Math.round(totalPrice / validStoresCount) : 0;
  }

  // กำหนดสี
  function getColor(avgPrice: number) {
    if (avgPrice > 60) return "#800026"; 
    else if (avgPrice > 50) return "#FD8D3C"; 
    else if (avgPrice > 0) return "#FFEDA0"; 
    else return "#E2E8F0"; 
  }


  // นำมาใช้งานลงสีจังหวัด
  function style(feature: any) {
    const provinceEN = feature.properties.NAME_1;
    const provinceTH = provinceMapping[provinceEN] || provinceEN; 
    const avgPrice = getAveragePrice(provinceTH);
    return {
      fillColor: getColor(avgPrice),
      weight: 1.5,
      opacity: 1,
      color: '#FFFFFF',
      dashArray: '',
      fillOpacity: 1
    }
  }

  // feature การแสดงผลเพิ่มเติม
  function onEachFeature(feature: any, layer: any){
    const provinceEN = feature.properties.NAME_1;
    const provinceTH = provinceMapping[provinceEN] || provinceEN;

    layer.on({
      mouseover: (e: any) => {
        const targetLayer = e.target;
        if (selectedLayerRef.current === targetLayer) return;
        targetLayer.setStyle({ weight: 3, color: '#333333', fillOpacity: 0.8 });
      },
      mouseout: (e: any) => {
        const targetLayer = e.target;
        if (selectedLayerRef.current === targetLayer) return;
        if (geoJsonRef.current) geoJsonRef.current.resetStyle(targetLayer);
      },
      click: (e: any) => {
        // เมื่อคลิกที่แผนที่ แค่บอก App.tsx ว่าเลือกจังหวัดอะไรก็พอ
        // (ส่วนพฤติกรรมการซูมและไฮไลต์ ปล่อยให้ useEffect ด้านบนเป็นคนจัดการเอง)
        onProvinceClick(provinceTH); 
      }
    })
  }

  return(
    <div className="h-full w-full relative bg-slate-50">
      <MapContainer 
        center={[13.7563, 101.5018]}
        zoom={6}
        scrollWheelZoom={true}
        className='h-full w-full bg-transparent!' 
        zoomControl={false}
      >
        <GeoJSON 
          ref={geoJsonRef} 
          data={thailandGeoJSON as any} 
          style={style} 
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  )
}

export default BaseMap