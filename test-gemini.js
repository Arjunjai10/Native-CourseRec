const { courseAPI } = require('./app/utils/api');

async function testFetch() {
  const axios = require('axios');
  const res = await axios.get('http://localhost:5000/api/courses');
  const coursesData = res.data;
  
  const catalogString = coursesData.reduce((acc, course) => {
    if (!acc[course.category]) acc[course.category] = [];
    acc[course.category].push(`- ${course.title} (${course.level})`);
    return acc;  
  }, {});
  
  const formattedCatalog = Object.entries(catalogString)
    .map(([category, courses]) => `${category}:\n${courses.slice(0, 5).join('\n')}`)
    .join('\n\n');
  
  console.log("CATALOG GENERATED:", formattedCatalog.substring(0, 300) + '...');
}
testFetch();
