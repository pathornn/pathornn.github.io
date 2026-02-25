import { useState } from 'react'
import '../App.css'

import { MapContainer, GeoJSON } from 'react-leaflet' // เอา TileLayer ออก
import 'leaflet/dist/leaflet.css'

// IMPORT ข้อมูล
import thailandGeoJSON from '../data/thailand-provinces.json'
import kapraoData from '../data/priceKrapao.json'

// MAPPING
import { provinceMapping } from '../constants/provinces'

function BaseMap() {
  function getAveragePrice(provinceNameTH: string): number {
    // 1. ป้องกัน Error ถ้าชื่อจังหวัดส่งมาเป็น undefined หรือ null
    if (!provinceNameTH) return 0;
    
    // 2. ค้นหาชื่อจังหวัด (ใช้ includes เผื่อข้อมูลบางที่มีคำว่า "จ." นำหน้า)
    const searchName = provinceNameTH.trim();
    const provinceInfo = kapraoData.data.find(
      p => p.province && p.province.trim() === searchName
    );

    // ถ้าหาจังหวัดไม่เจอ หรือไม่มีร้านเลย ให้จบการทำงานส่ง 0 กลับไป
    if (!provinceInfo || !provinceInfo.store || provinceInfo.store.length === 0) {
      // ลองเอา Comment บรรทัดล่างออกเพื่อดูว่าจังหวัดไหนบ้างที่หาไม่เจอจริงๆ
      // console.warn(`หาไม่เจอ: ${searchName}`);
      return 0;
    }

    let totalPrice = 0;
    let validStoresCount = 0;

    provinceInfo.store.forEach(store => {
      // 3. แก้บั๊กชื่อฟิลด์ซ้ำ และดึงราคาออกมา
      const rawPrice = store.prices || store.prices || store.Prices || store.Price || null; 
      
      if (rawPrice) {
        // 4. แก้ปัญหาข้อมูลเป็นช่วงราคา (เช่น "40-60" -> ให้ดึงเลขแรกมาคือ 40)
        // \d+ จะดึงกลุ่มตัวเลขกลุ่มแรกที่เจอออกมา
        const match = String(rawPrice).match(/\d+/); 
        
        if (match) {
          const price = parseInt(match[0], 10);
          
          // 5. กรองเฉพาะราคาที่ดูเหมือนจะเป็นข้าวกะเพราจริงๆ (10 บาท ถึง 1,000 บาท)
          if (!isNaN(price) && price >= 10 && price <= 1000) {
            totalPrice += price;
            validStoresCount++;
          }
        }
      }
    });
    
    // คืนค่าเฉลี่ย
    return validStoresCount > 0 ? Math.round(totalPrice / validStoresCount) : 0;
  }

  //กำหนดสี
  function getColor(avgPrice: number) {
    // ใช้ if-else ให้อ่านง่ายและชัวร์กว่าแบบ Ternary ซ้อนกัน
    if (avgPrice > 60) {
      return "#800026"; // แดงเข้ม (แพง)
    } else if (avgPrice > 50) {
      return "#FD8D3C"; // ส้ม (ปานกลาง)
    } else if (avgPrice > 0) {
      return "#FFEDA0"; // เหลือง (ถูก)
    } else {
      return "#E2E8F0"; // เทาอ่อน (กรณีไม่มีข้อมูล ให้เข้ากับพื้นขาวของคุณ)
    }
  }

  // Style Polygon ของแต่ละจังหวัด
  function style(feature: any) {
    const provinceEN = feature.properties.NAME_1;
    // ใช้ Fallback เผื่อแปลชื่อไม่ได้ ให้เป็นชื่ออังกฤษไว้ก่อน
    const provinceTH = provinceMapping[provinceEN] || provinceEN; 
    console.log("ชื่อจังหวัดที่กำลังหา:", provinceTH);
    const avgPrice = getAveragePrice(provinceTH);

    // เอาไว้เช็กใน Console (กด F12) ว่าจังหวัดไหนได้ราคาเท่าไหร่ สีอะไร
    // console.log(`[${provinceTH}] ราคา: ${avgPrice} -> สี: ${getColor(avgPrice)}`);

    return {
      fillColor: getColor(avgPrice),
      weight: 1.5,        // ปรับขอบให้หนาขึ้นนิดนึง
      opacity: 1,
      color: '#FFFFFF',   // ใช้เส้นขอบสีขาวตัดกับพื้นสีเทา/เหลือง
      dashArray: '',
      fillOpacity: 1      // 1 = ทึบ 100% (เพื่อตัดปัญหาเรื่องสีเพี้ยนจากพื้นหลัง)
    }
  }

  //จัดการ Event
  function onEachFeature(feature: any, layer: any){
    const provinceEN = feature.properties.NAME_1;
    const provinceTH = provinceMapping[provinceEN] || provinceEN
    const avgPrice = getAveragePrice(provinceTH)

    // ใช้ Backtick (`) เพื่อให้แสดงตัวเลขได้
    const priceText = avgPrice > 0 ? `${avgPrice} บาท` : 'ไม่มีข้อมูล'
    
    layer.bindTooltip(`
      <div class="text-center font-sans">
        <b class="text-sm">${provinceTH}</b><br/>
        <span class="text-slate-600">ราคากะเพราเฉลี่ย:</span> 
        <span class="font-bold text-red-600">${priceText}</span>
      </div>
    `, { direction: 'top', sticky: true })

    layer.on({
      mouseover: (e: any) => {
        const targetLayer = e.target
        targetLayer.setStyle({
          weight: 2,
          color: '#ffffff',
          dashArray: '',
          fillOpacity: 1
        })
      },
      mouseout: (e: any) => {
        const targetLayer = e.target;
        targetLayer.setStyle(style(feature))
      },
      click: (e: any) => {
        const map = e.target._map;
        map.fitBounds(e.target.getBounds())
      }
    })
  }

  return(
    <div className="h-full w-full relative bg-[#ffffff]">
      <MapContainer 
        center={[13.7563, 101.5018]}
        zoom={6}
        scrollWheelZoom={true}
        // ใส่ !bg-transparent เพื่อลบสีพื้นหลังปริยายของ Leaflet ออก
        className='h-full w-full bg-transparent!' 
        zoomControl={false}
      >
        <GeoJSON 
          data={thailandGeoJSON as any} 
          style={style} 
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  )
}

export default BaseMap