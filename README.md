# Amazon Product Discount & Category Comparison Dashboard

Interactive Dashboard สำหรับวิเคราะห์และเปรียบเทียบสัดส่วนเปอร์เซ็นต์ส่วนลดสินค้า (**Product Discount Percentage**) ตามหมวดหมู่ (Category) จากชุดข้อมูล `amazon.csv` (1,465 รายการ)

---

## 🚀 จุดเด่นและฟังก์ชันการทำงานหลัก (Key Features)

1. **Category Comparison Mode (ฟังก์ชั่นเปรียบเทียบหมวดหมู่)**
   - **Multi-Category Selection:** เลือกระบุหมวดหมู่ที่ต้องการนำมาเปรียบเทียบเคียงข้างกัน (Side-by-side) ได้อย่างอิสระ
   - **2-Level Hierarchy:** สลับการวิเคราะห์ได้ทั้งระดับ **Main Category** (9 หมวดหลัก เช่น Computers, Electronics, Home&Kitchen) และระดับเจาะลึก **Sub Category** (29 หมวดย่อย เช่น Wearable Technology, Cables, Headphones, Kitchen Appliances)
   - **Quick Presets:** ปุ่มลัดเลือกกลุ่มข้อมูลทันที เช่น "⭐ Top 3 หมวดหลัก", "⚡ หมวดที่ลดเฉลี่ย > 50%", "เลือกทั้งหมด"

2. **Visual Comparison Charts (กราฟเปรียบเทียบเชิงลึก)**
   - **Mean & Median Bar Chart:** กราฟแท่งเปรียบเทียบค่าเฉลี่ยส่วนลด (Mean), ค่ามัธยฐาน (Median), พร้อม Whisker แสดงช่วงต่ำสุด-สูงสุด (Min-Max Range)
   - **Discount Bracket Distribution:** กราฟ Stacked Bar แจกแจงสัดส่วนเปอร์เซ็นต์ส่วนลดแบ่งตามช่วง (0-20%, 21-40%, 41-60%, 61-80%, 81-100%)
   - **Box Plot (Whisker Plot):** แผนภาพกล่องแสดงการกระจายตัวทางสถิติ Min, Q1, Median, Q3, Max สำหรับแต่ละหมวดหมู่
   - **Interactive Tooltip:** แสดงรายละเอียดตัวเลขอย่างครบถ้วนเมื่อชี้เมาส์เหนือจุดข้อมูล

3. **Executive KPI Summary Cards**
   - จำนวนสินค้าในกลุ่มที่เลือก (% ของข้อมูลทั้งหมด)
   - ค่าเฉลี่ยส่วนลด (Mean %) & ค่ามัธยฐาน (Median %)
   - ส่วนลดสูงสุด / ต่ำสุด และช่วงการลดราคา (Spread)
   - หมวดหมู่ที่ทำส่วนลดสูงสุด พร้อมค่าเฉลี่ย
   - คะแนนรีวิวเฉลี่ย (Customer Rating)

4. **Head-to-Head Comparison Matrix Table**
   - ตารางเปรียบเทียบสถิติหมวดหมู่แบบละเอียด (จำนวนสินค้า, ค่าเฉลี่ย, ค่ามัธยฐาน, Min-Max, ราคาปกติเฉลี่ย, ราคาขายเฉลี่ย, คะแนนรีวิว)
   - สามารถคลิกที่หัวตารางเพื่อจัดเรียง (Sort) ตามคอลัมน์ใดก็ได้

5. **Product Explorer & Filterable Data Table**
   - ช่องค้นหาชื่อสินค้า (Search by keyword)
   - ตัวกรองระดับส่วนลด (ทุกระดับ, ≥30%, ≥50%, ≥70% ลดล้างสต็อก)
   - จัดเรียงตามส่วนลดมาก-น้อย, คะแนนรีวิว, หรือราคา
   - มี Pagination เปิดดูข้อมูลสินค้า 1,465 ชิ้นได้อย่างรวดเร็ว

6. **Export & Theming**
   - ส่งออกข้อมูลสถิติเปรียบเทียบเป็นไฟล์ `.csv` ได้ด้วยคลิกเดียว
   - รองรับ Light Mode / Dark Mode

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```
amazon_dashboard/
├── index.html                   # ไฟล์หน้าแดชบอร์ดหลัก (Self-contained, เปิดดูได้ทันที)
├── README.md                    # เอกสารอธิบายการใช้งานและสถิติ
├── data/
│   ├── amazon.csv               # ไฟล์ข้อมูลดิบต้นฉบับ
│   ├── products.json            # ไฟล์ข้อมูลที่คลีนและคำนวณสถิติเบื้องต้นแล้ว
│   └── compact_data.json        # ชุดข้อมูลขนาดกะทัดรัดสำหรับฝังในเว็บแอป
└── scripts/
    ├── process_data.js          # สคริปต์แปลง CSV เป็น JSON สถิติ
    ├── create_compact_data.js   # สคริปต์บีบอัดข้อมูลให้โหลดเร็ว
    ├── build_dashboard.js       # สคริปต์คอมไพล์ HTML พร้อมฝังข้อมูล
    └── server.js                # Local HTTP Web Server สำหรับทดสอบ
```

---

## 🛠️ วิธีการเปิดใช้งาน (How to Run)

### วิธีที่ 1: ดับเบิลคลิกเปิดไฟล์โดยตรง (ไม่ต้องติดตั้งอะไรเพิ่ม)
เปิดไฟล์ `index.html` ด้วยเว็บเบราว์เซอร์ใดก็ได้ (Chrome, Edge, Firefox, Safari) ใช้งานได้ทันทีโดยไม่ต้องรันเซิร์ฟเวอร์

### วิธีที่ 2: รันผ่าน Local Web Server ด้วย Node.js
เปิด Terminal ในโฟลเดอร์นี้ แล้วรันคำสั่ง:
```bash
node scripts/server.js
```
จากนั้นเปิดเบราว์เซอร์ไปที่: **http://localhost:3000**

---

## 📊 สรุปข้อมูลเชิงลึกจากการวิเคราะห์ (Key Insights from amazon.csv)

1. **หมวดหมู่ที่ทำส่วนลดสูงที่สุด (Deepest Discounts):**
   - **Computers & Accessories:** ส่วนลดเฉลี่ย **54.02%** (มัธยฐาน 58%, ลดสูงสุดถึง 94%)
   - **Electronics:** ส่วนลดเฉลี่ย **50.83%** (มัธยฐาน 54%, ลดสูงสุด 91%)
   - ในระดับหมวดย่อย **Wearable Technology** (Smart Watch & สายรัดข้อมือ) ลดเฉลี่ยสูงถึง **69.82%** และกลุ่มสายชาร์จ **Cables & Accessories** ลดเฉลี่ย **55.98%**

2. **หมวดหมู่ที่เน้นการขายราคาเต็ม / ลดน้อย (Conservative Discounts):**
   - **Office Products:** ส่วนลดเฉลี่ยเพียง **12.35%** (มัธยฐาน 5%) โดยเฉพาะกลุ่มผลิตภัณฑ์กระดาษ (Office Paper Products) ลดเฉลี่ยเพียง 14.00%

3. **ช่วงส่วนลดที่พบมากที่สุด (Discount Distribution):**
   - สินค้ากว่า **65%** ในแพลตฟอร์มมีส่วนลดอยู่ในช่วง **40% - 80%** สะท้อนให้เห็นถึงกลยุทธ์การตั้งราคาแบบเน้นโปรโมชั่นส่วนลดสูงเพื่อดึงดูดผู้ซื้อ
