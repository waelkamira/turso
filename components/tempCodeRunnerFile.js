
insertData(jsonData).catch(console.error);

// دالة استعلام البيانات (اختياري)
async function queryJsonData() {
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM meals',
    });
    console.log('Query result:', result);
  } catch (error) {
    console.error('Error querying data:', error);
  }
}

// استدعاء دالة الاستعلام (اختياري)
queryJsonData().catch(console.error);