const axios = require('axios');

async function testAPI() {
  try {
    const res = await axios.get('http://localhost:5000/api/courses');
    console.log(`Successfully fetched ${res.data.length} courses!`);
    console.log('Sample course:', res.data[0].title);
  } catch (err) {
    console.error('Failed to fetch courses:', err.message);
  }
}

testAPI();
