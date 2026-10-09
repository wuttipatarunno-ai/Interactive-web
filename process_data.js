const fs = require('fs');
const path = require('path');

function parseCSV(text) {
  const lines = [];
  let row = [''];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') { i++; }
      if (row.length > 1 || row[0] !== '') {
        lines.push(row);
      }
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== '') lines.push(row);
  return lines;
}

const sourceCsv = 'C:\\Users\\Administrator\\Downloads\\amazon.csv\\amazon.csv';
const targetDir = 'C:\\Users\\Administrator\\.gemini\\antigravity\\scratch\\amazon_dashboard';
const dataDir = path.join(targetDir, 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Copy original CSV
fs.copyFileSync(sourceCsv, path.join(dataDir, 'amazon.csv'));

const csvContent = fs.readFileSync(sourceCsv, 'utf8');
const rows = parseCSV(csvContent);

const products = [];
for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  if (r.length < 7) continue;

  const id = r[0] || `item-${i}`;
  const name = r[1] ? r[1].trim() : 'Unknown Product';
  const fullCategory = r[2] || 'Uncategorized';
  const discPriceStr = (r[3] || '').replace(/[^0-9.]/g, '');
  const actPriceStr = (r[4] || '').replace(/[^0-9.]/g, '');
  const discPercentStr = (r[5] || '').replace(/[^0-9.]/g, '');
  const ratingStr = (r[6] || '').replace(/[^0-9.]/g, '');
  const ratingCountStr = (r[7] || '').replace(/[^0-9]/g, '');

  const discountedPrice = parseFloat(discPriceStr) || 0;
  const actualPrice = parseFloat(actPriceStr) || 0;
  const discountPercent = parseFloat(discPercentStr) || 0;
  const rating = parseFloat(ratingStr) || 0;
  const ratingCount = parseInt(ratingCountStr, 10) || 0;

  const catParts = fullCategory.split('|');
  const mainCategory = catParts[0] ? catParts[0].trim() : 'Uncategorized';
  const subCategory = catParts[1] ? catParts[1].trim() : mainCategory;
  const leafCategory = catParts[catParts.length - 1] ? catParts[catParts.length - 1].trim() : subCategory;

  products.push({
    id,
    name,
    mainCategory,
    subCategory,
    leafCategory,
    fullCategory,
    discountedPrice,
    actualPrice,
    discountPercent,
    rating,
    ratingCount,
    img: r[14] || '',
    link: r[15] || ''
  });
}

// Compute statistics for main categories and sub categories
function computeCategoryStats(grouped) {
  const stats = {};
  for (const [key, items] of Object.entries(grouped)) {
    const discounts = items.map(p => p.discountPercent).sort((a, b) => a - b);
    const count = discounts.length;
    const sum = discounts.reduce((a, b) => a + b, 0);
    const avg = Number((sum / count).toFixed(2));
    const min = discounts[0];
    const max = discounts[count - 1];
    const median = count % 2 === 0
      ? Number(((discounts[count / 2 - 1] + discounts[count / 2]) / 2).toFixed(2))
      : discounts[Math.floor(count / 2)];

    // Quartiles
    const q1 = discounts[Math.floor(count * 0.25)];
    const q3 = discounts[Math.floor(count * 0.75)];

    // Distribution bins: 0-20%, 20-40%, 40-60%, 60-80%, 80-100%
    const bins = { '0-20%': 0, '20-40%': 0, '40-60%': 0, '60-80%': 0, '80-100%': 0 };
    discounts.forEach(d => {
      if (d < 20) bins['0-20%']++;
      else if (d < 40) bins['20-40%']++;
      else if (d < 60) bins['40-60%']++;
      else if (d < 80) bins['60-80%']++;
      else bins['80-100%']++;
    });

    // Average price and savings
    const avgActualPrice = Number((items.reduce((s, p) => s + p.actualPrice, 0) / count).toFixed(2));
    const avgDiscPrice = Number((items.reduce((s, p) => s + p.discountedPrice, 0) / count).toFixed(2));
    const avgRating = Number((items.reduce((s, p) => s + p.rating, 0) / count).toFixed(2));

    stats[key] = {
      category: key,
      count,
      avgDiscount: avg,
      medianDiscount: median,
      minDiscount: min,
      maxDiscount: max,
      q1,
      q3,
      bins,
      avgActualPrice,
      avgDiscPrice,
      avgRating
    };
  }
  return stats;
}

const mainGrouped = {};
const subGrouped = {};
products.forEach(p => {
  if (!mainGrouped[p.mainCategory]) mainGrouped[p.mainCategory] = [];
  mainGrouped[p.mainCategory].push(p);

  const subKey = `${p.mainCategory} > ${p.subCategory}`;
  if (!subGrouped[subKey]) subGrouped[subKey] = [];
  subGrouped[subKey].push(p);
});

const mainStats = computeCategoryStats(mainGrouped);
const subStats = computeCategoryStats(subGrouped);

const output = {
  summary: {
    totalProducts: products.length,
    mainCategoriesCount: Object.keys(mainStats).length,
    subCategoriesCount: Object.keys(subStats).length,
    overallAvgDiscount: Number((products.reduce((s, p) => s + p.discountPercent, 0) / products.length).toFixed(2))
  },
  mainStats,
  subStats,
  products
};

fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(output, null, 2));
console.log('Successfully parsed', products.length, 'products into', path.join(dataDir, 'products.json'));
