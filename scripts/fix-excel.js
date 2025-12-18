const XLSX = require('xlsx');
const fs = require('fs');

// 读取原始Excel文件
const workbook = XLSX.readFile('cities.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(worksheet);

// 修正字段名
const fixedData = data.map(row => {
  const newRow = {};
  Object.keys(row).forEach(key => {
    const trimmedKey = key.trim(); // 去除空格
    if (trimmedKey === 'city_namte' || trimmedKey === 'city_namte') {
      newRow['city_name'] = row[key];
    } else {
      newRow[trimmedKey] = row[key];
    }
  });
  return newRow;
});

// 创建新的工作簿
const newWorkbook = XLSX.utils.book_new();
const newWorksheet = XLSX.utils.json_to_sheet(fixedData);
XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Cities');

// 保存修正后的文件
XLSX.writeFile(newWorkbook, 'cities_fixed.xlsx');

console.log('Excel文件已修正，保存为 cities_fixed.xlsx');
console.log('修正后的数据：', fixedData);