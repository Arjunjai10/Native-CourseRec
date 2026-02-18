const categories = {
  'Programming': [
    { name: 'Python', color: '#741ce9', icon: 'logo-python' },
    { name: 'JavaScript', color: '#f7df1e', icon: 'logo-javascript' },
    { name: 'Java', color: '#007396', icon: 'logo-java' },
    { name: 'C++', color: '#00599c', icon: 'code-slash' },
    { name: 'C#', color: '#239120', icon: 'code-working' },
    { name: 'Ruby', color: '#cc342d', icon: 'diamond' },
    { name: 'Go', color: '#00add8', icon: 'analytics' },
    { name: 'Rust', color: '#ce422b', icon: 'settings' },
    { name: 'PHP', color: '#777bb4', icon: 'code' },
    { name: 'Swift', color: '#fa7343', icon: 'logo-apple' },
    { name: 'Kotlin', color: '#0095d5', icon: 'logo-android' },
    { name: 'TypeScript', color: '#3178c6', icon: 'code-slash' },
  ],
  'Web Development': [
    { name: 'HTML/CSS', color: '#e34c26', icon: 'logo-html5' },
    { name: 'React', color: '#61dafb', icon: 'logo-react' },
    { name: 'Angular', color: '#dd0031', icon: 'logo-angular' },
    { name: 'Vue.js', color: '#42b883', icon: 'logo-vue' },
    { name: 'Node.js', color: '#339933', icon: 'logo-nodejs' },
    { name: 'Next.js', color: '#000000', icon: 'layers' },
    { name: 'Express', color: '#000000', icon: 'server' },
    { name: 'Django', color: '#092e20', icon: 'code-working' },
    { name: 'Flask', color: '#000000', icon: 'flask' },
    { name: 'Laravel', color: '#ff2d20', icon: 'logo-laravel' },
    { name: 'WordPress', color: '#21759b', icon: 'logo-wordpress' },
    { name: 'Tailwind CSS', color: '#06b6d4', icon: 'brush' },
  ],
  'Mobile Development': [
    { name: 'React Native', color: '#61dafb', icon: 'phone-portrait' },
    { name: 'Flutter', color: '#02569b', icon: 'phone-portrait' },
    { name: 'iOS Development', color: '#000000', icon: 'logo-apple' },
    { name: 'Android Development', color: '#3ddc84', icon: 'logo-android' },
    { name: 'Xamarin', color: '#3498db', icon: 'phone-portrait' },
    { name: 'Ionic', color: '#3880ff', icon: 'phone-portrait' },
  ],
  'Data Science': [
    { name: 'Machine Learning', color: '#ff6f00', icon: 'analytics' },
    { name: 'Deep Learning', color: '#ee4c2c', icon: 'git-network' },
    { name: 'Data Analysis', color: '#150458', icon: 'bar-chart' },
    { name: 'Pandas', color: '#150458', icon: 'grid' },
    { name: 'NumPy', color: '#013243', icon: 'calculator' },
    { name: 'TensorFlow', color: '#ff6f00', icon: 'git-network' },
    { name: 'PyTorch', color: '#ee4c2c', icon: 'flame' },
    { name: 'Scikit-learn', color: '#f7931e', icon: 'analytics' },
  ],
  'Cloud & DevOps': [
    { name: 'AWS', color: '#ff9900', icon: 'cloud' },
    { name: 'Azure', color: '#0089d6', icon: 'cloud' },
    { name: 'GCP', color: '#4285f4', icon: 'cloud' },
    { name: 'Docker', color: '#2496ed', icon: 'cube' },
    { name: 'Kubernetes', color: '#326ce5', icon: 'grid' },
    { name: 'Jenkins', color: '#d24939', icon: 'git-branch' },
    { name: 'Terraform', color: '#7b42bc', icon: 'git-network' },
    { name: 'CI/CD', color: '#fc6d26', icon: 'git-merge' },
  ],
  'Database': [
    { name: 'MySQL', color: '#4479a1', icon: 'server' },
    { name: 'PostgreSQL', color: '#336791', icon: 'server' },
    { name: 'MongoDB', color: '#47a248', icon: 'leaf' },
    { name: 'Redis', color: '#dc382d', icon: 'flash' },
    { name: 'Firebase', color: '#ffca28', icon: 'flame' },
    { name: 'SQL', color: '#cc2927', icon: 'server' },
  ],
  'Design': [
    { name: 'UI/UX Design', color: '#f24e1e', icon: 'color-palette' },
    { name: 'Figma', color: '#f24e1e', icon: 'color-fill' },
    { name: 'Adobe XD', color: '#ff61f6', icon: 'brush' },
    { name: 'Photoshop', color: '#31a8ff', icon: 'image' },
    { name: 'Illustrator', color: '#ff9a00', icon: 'color-wand' },
    { name: 'Graphic Design', color: '#ff7f50', icon: 'images' },
  ],
  'Business': [
    { name: 'Digital Marketing', color: '#4285f4', icon: 'megaphone' },
    { name: 'SEO', color: '#0f9d58', icon: 'search' },
    { name: 'Content Marketing', color: '#ea4335', icon: 'document-text' },
    { name: 'Social Media', color: '#1da1f2', icon: 'logo-twitter' },
    { name: 'Email Marketing', color: '#ea4335', icon: 'mail' },
    { name: 'Product Management', color: '#ff6f00', icon: 'briefcase' },
  ],
  'Security': [
    { name: 'Cybersecurity', color: '#dc2626', icon: 'shield-checkmark' },
    { name: 'Ethical Hacking', color: '#000000', icon: 'bug' },
    { name: 'Network Security', color: '#1e40af', icon: 'network' },
    { name: 'Penetration Testing', color: '#b91c1c', icon: 'key' },
  ],
  'Game Development': [
    { name: 'Unity', color: '#000000', icon: 'game-controller' },
    { name: 'Unreal Engine', color: '#0e1128', icon: 'game-controller' },
    { name: 'Godot', color: '#478cbf', icon: 'game-controller' },
    { name: 'Game Design', color: '#8b5cf6', icon: 'sparkles' },
  ],
};

const instructors = [
  'Dr. Angela Yu', 'Maximilian Schwarzmüller', 'Colt Steele', 'Brad Traversy',
  'Mosh Hamedani', 'Andrew Ng', 'Jose Portilla', 'Stephen Grider',
  'Jonas Schmedtmann', 'Frank Kane', 'Andrei Neagoie', 'Academind Team',
  'Traversy Media', 'The Net Ninja', 'Derek Banas', 'Sentdex',
  'Corey Schafer', 'Tech With Tim', 'Programming with Mosh', 'FreeCodeCamp',
  'CS50 Team', 'MIT OpenCourseWare', 'Stanford Online', 'Khan Academy',
  'Udacity Team', 'Pluralsight Authors', 'LinkedIn Learning', 'Coursera Team'
];

const platforms = [
  'YouTube', 'Coursera', 'Udemy', 'edX', 'freeCodeCamp', 
  'Khan Academy', 'Pluralsight', 'LinkedIn Learning', 'Udacity'
];

const levels = ['Beginner', 'Intermediate', 'Advanced'];

function generateCourses() {
  const courses = [];
  let id = 1;

  for (const [category, topics] of Object.entries(categories)) {
    for (const topic of topics) {
      const numCourses = Math.floor(Math.random() * 8) + 5;
      
      for (let i = 0; i < numCourses; i++) {
        const level = levels[Math.floor(Math.random() * levels.length)];
        const instructor = instructors[Math.floor(Math.random() * instructors.length)];
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        const rating = (4.3 + Math.random() * 0.7).toFixed(1);
        const reviews = Math.floor(Math.random() * 500000) + 5000;
        const students = Math.floor(Math.random() * 3000000) + 10000;
        const lectures = Math.floor(Math.random() * 400) + 20;
        const hours = Math.floor(Math.random() * 60) + 5;

        const courseTypes = [
          'Complete Guide', 'Masterclass', 'Bootcamp', 'Course',
          'Tutorial', 'Zero to Hero', 'Crash Course', 'Deep Dive',
          'Fundamentals', 'Advanced Course', 'Practical Guide', 'Workshop'
        ];
        const courseType = courseTypes[Math.floor(Math.random() * courseTypes.length)];

        const course = {
          id: String(id++),
          title: `${topic.name} ${courseType} ${2024 - Math.floor(Math.random() * 2)}`,
          description: `Master ${topic.name} with this comprehensive ${level.toLowerCase()} course. Learn through practical projects and real-world examples.`,
          instructor,
          rating: parseFloat(rating),
          reviewsCount: reviews,
          studentsEnrolled: students,
          price: `Free on ${platform}`,
          thumbnail: topic.icon,
          thumbnailColor: topic.color,
          category,
          level,
          duration: `${hours} hours`,
          lectures,
          language: 'English',
          lastUpdated: `${['January', 'February', 'December'][Math.floor(Math.random() * 3)]} 2024`,
          externalLink: getPlatformLink(platform, topic.name),
          includes: [
            { icon: 'play-circle', text: `${hours} hours on-demand video` },
            { icon: 'document-text', text: `${Math.floor(lectures / 10)} coding exercises` },
            { icon: 'download', text: `${Math.floor(Math.random() * 50) + 10} downloadable resources` },
            { icon: 'infinite', text: 'Full lifetime access' },
            { icon: 'phone-portrait', text: 'Access on mobile and TV' },
            { icon: 'ribbon', text: 'Certificate of completion' },
          ],
        };

        courses.push(course);
      }
    }
  }

  return courses;
}

function getPlatformLink(platform, topic) {
  const links = {
    'YouTube': `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' tutorial')}`,
    'Coursera': `https://www.coursera.org/search?query=${encodeURIComponent(topic)}`,
    'Udemy': `https://www.udemy.com/courses/search/?q=${encodeURIComponent(topic)}`,
    'edX': `https://www.edx.org/search?q=${encodeURIComponent(topic)}`,
    'freeCodeCamp': 'https://www.freecodecamp.org/learn',
    'Khan Academy': 'https://www.khanacademy.org/',
    'Pluralsight': `https://www.pluralsight.com/search?q=${encodeURIComponent(topic)}`,
    'LinkedIn Learning': `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(topic)}`,
    'Udacity': `https://www.udacity.com/courses/all?search=${encodeURIComponent(topic)}`
  };
  return links[platform] || links['YouTube'];
}

const allCourses = generateCourses();
console.log(`export const COURSES = ${JSON.stringify(allCourses, null, 2)};`);
console.log(`\n// Total courses: ${allCourses.length}`);

