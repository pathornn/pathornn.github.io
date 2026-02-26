# คู่มือการทำงาน

## Package
- React + TypeScript + Vite ในการทำงานเป็นหลัก
- TailwindCSS ในการตกแต่ง
- Leaflet API สำหรับแมพแสดงสี
- Google Embed API สำหรับแสดงสถานที่
- JSON เก็บข้อมูล


## การทำงานเบื้องต้น
1. เรียกใช้ index.html
2. index.html จะเรียก main.tsx ผ่าน
```html
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
```
3. main.tsx เรียก App.tsx ผ่าน
```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
4. App.tsx จะทำหน้าที่ดึง Component ต่างๆมาแสดงในเว็บ !สำคัญมากๆ!
โดยแต่ละ Component จะอยู่ใน 'src/components'
5. แต่ละ Component จะแบ่งกันอยู่ในแต่ละ Layer เพื่อทับซ้อนกัน

## Components
> ### Logo.tsx
- แสดง logo

> ### BaseMap.tsx
- ดึงข้อมูลจาก 'data/cost-of-living.json' แล้วนำมาหาค่าเฉลี่ยของแต่ละจังหวัด
```tsx
function getAveragePrice(provinceNameTH: string): number{}
```
- กำหนดสีแต่ละจังหวัดเป็น 3 ช่วง
```tsx
function getColor(avgPrice: number){}
```
- นำ function getAveragePrice() และ getColor() มาใช้งานเพื่อกำหนดแต่ละจังหวัด
```tsx
function style(feature: any){}
```
- feature การแสดงผลเพิ่มเติม
```tsx
function onEachFeature(feature: any, layer: any){
 layer.on({
  mouseover: () => {}
  mouseout: () => {}
  // ใน click อัพเดท onProvinceClick()
  click: () => {}
 })
}
```

- ทำการ RETURN  แผนที่ด้วย LeafletAPI GEOjson

> ### Search.tsx
- Search Props เป็น interface สำหรับนำไปใช้งานต่อ
```tsx
interface SearchProps {}
```
- Search สำหรับเก็บคำค้นหาที่ผู้ใช้พิมพ์ โดย implement มาจาก SearchProps
```tsx
function Search {
 // เก็บ Search Query 
 const [searchQuery, setSearchQuery]

 // ดึงรายชื่อจังหวัดและร้านค้ามาเรียงลำดับตัวอักษร
 const provinces
 const stores

 // กรองข้อมูลจังหวัดและร้านอาหาร ให้เหลือเฉพาะที่ตรงกับ searchQuery ที่ผู้ใช้พิมพ์
 const filteredProvinces
 const filteredStores

 // ดึงข้อมูลร้านอาหารเฉพาะ "จังหวัดที่ผู้ใช้กำลังเลือกดูอยู่"
 const provinceStores
}

 // คำนวณหาราคา "กะเพราเฉลี่ย" ของร้านทั้งหมดในจังหวัดที่เลือก
 const getAveragePrice

 // ตรวจสอบว่าข้อมูลพิกัด/ตำแหน่งร้าน เป็น URL ที่ถูกต้องหรือไม่
 const getValidUrl

 // อัปเดตเมื่อคลิกร้านค้า
 const handleStoreClick

 // อัปเดตเมื่อคลิกจังหวัด
 const handleProvinceClick

 // กลับไปยัง list หน้าแรก
 const handleBackToList

 // ปิดหน้าต่าง Search
 const handleCloseSearch
```

> ### GoogleMap.tsx
- รับ Link มาจากการกดร้านค้าใน Search เพื่อมาแสดงผล