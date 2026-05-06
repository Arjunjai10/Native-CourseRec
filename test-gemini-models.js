const GEMINI_API_KEY = "AIzaSyDzHNUyW3L8RF1Rj35gdSLHqTVHsXfgT2I";

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
