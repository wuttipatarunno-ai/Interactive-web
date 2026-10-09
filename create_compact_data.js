const fs = require('fs');
const path = require('path');

const inputPath = 'C:\\Users\\Administrator\\.gemini\\antigravity\\scratch\\amazon_dashboard\\data\\products.json';
const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const mainCats = Object.keys(data.mainStats).sort();
const subCats = Object.keys(data.subStats).sort();

const compactProducts = data.products.map(p => {
  const mainIdx = mainCats.indexOf(p.mainCategory);
  const subKey = `${p.mainCategory} > ${p.subCategory}`;
  const subIdx = subCats.indexOf(subKey);
  return [
    p.id,
    p.name.replace(/["\\]/g, ' ').substring(0, 95).trim(),
    mainIdx >= 0 ? mainIdx : 0,
    subIdx >= 0 ? subIdx : 0,
    p.discountedPrice,
    p.actualPrice,
    p.discountPercent,
    p.rating,
    p.ratingCount
  ];
});

const compactBundle = {
  mainCats,
  subCats,
  products: compactProducts
};

const outputPath = 'C:\\Users\\Administrator\\.gemini\\antigravity\\scratch\\amazon_dashboard\\data\\compact_data.json';
fs.writeFileSync(outputPath, JSON.stringify(compactBundle));

console.log('Compact data size (KB):', (fs.statSync(outputPath).size / 1024).toFixed(1));
console.log('Total items:', compactProducts.length);
console.log('Main categories:', mainCats.length);
console.log('Sub categories:', subCats.length);
