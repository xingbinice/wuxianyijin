const fs = require('fs');
const FormData = require('form-data');

// 测试城市数据上传
async function testCitiesUpload() {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream('cities_fixed.xlsx'));

    const response = await fetch('http://localhost:3003/api/upload/cities', {
      method: 'POST',
      body: form
    });

    const result = await response.json();
    console.log('城市数据上传结果:', result);
    return response.ok;
  } catch (error) {
    console.error('城市数据上传错误:', error);
    return false;
  }
}

// 测试薪资数据上传
async function testSalariesUpload() {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream('salaries.xlsx'));

    const response = await fetch('http://localhost:3003/api/upload/salaries', {
      method: 'POST',
      body: form
    });

    const result = await response.json();
    console.log('薪资数据上传结果:', result);
    return response.ok;
  } catch (error) {
    console.error('薪资数据上传错误:', error);
    return false;
  }
}

// 测试计算功能
async function testCalculate() {
  try {
    const response = await fetch('http://localhost:3003/api/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    const result = await response.json();
    console.log('计算结果:', result);
    return response.ok;
  } catch (error) {
    console.error('计算错误:', error);
    return false;
  }
}

// 运行所有测试
async function runTests() {
  console.log('开始测试Supabase集成...\n');

  console.log('1. 测试城市数据上传:');
  const citiesSuccess = await testCitiesUpload();
  console.log(`城市数据上传: ${citiesSuccess ? '✅ 成功' : '❌ 失败'}\n`);

  if (citiesSuccess) {
    console.log('2. 测试薪资数据上传:');
    const salariesSuccess = await testSalariesUpload();
    console.log(`薪资数据上传: ${salariesSuccess ? '✅ 成功' : '❌ 失败'}\n`);

    if (salariesSuccess) {
      console.log('3. 测试计算功能:');
      const calculateSuccess = await testCalculate();
      console.log(`计算功能: ${calculateSuccess ? '✅ 成功' : '❌ 失败'}\n`);
    }
  }
}

runTests();