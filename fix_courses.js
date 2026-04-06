const fs = require('fs');
let data = fs.readFileSync('data/courses.js', 'utf8');
data = data.replace(/"thumbnail": "git-network"/g, '"thumbnail": "git-network-outline"');
data = data.replace(/"thumbnail": "network"/g, '"thumbnail": "globe-outline"');
fs.writeFileSync('data/courses.js', data);
