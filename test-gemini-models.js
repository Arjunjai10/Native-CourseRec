const GEMINI_API_KEY = "AIzaSyClnSmm29WEXBXGtYiea9yZisakss7ZCtE";

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
    const data = await response.json();
    console.log("Available Models:");
    data.models.forEach(m => console.log(`- ${m.name}`));
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
