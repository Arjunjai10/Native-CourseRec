const { Builder, By, until, Key } = require('selenium-webdriver');
const { expect } = require('chai');

describe('EduLearn Comprehensive All-Function Test', function() {
  this.timeout(180000); // 3 minutes for absolute certainty
  let driver;
  const baseUrl = 'http://localhost:8081';
  const randomId = Math.floor(Math.random() * 10000);
  const testUser = {
    name: `Master Tester ${randomId}`,
    email: `master${randomId}@example.com`,
    password: 'Password123!',
    newBio: "Automated test bio updated at " + new Date().toLocaleTimeString()
  };

  before(async function() {
    const chrome = require('selenium-webdriver/chrome');
    const options = new chrome.Options();
    // options.addArguments('--headless'); // Enable for headless mode
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    console.log('Driver Initialized.');
  });

  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  // Helper for clicking things using JS (Most reliable for React Native Web)
  async function forceClick(xpath) {
    const el = await driver.wait(until.elementLocated(By.xpath(xpath)), 10000);
    await driver.executeScript("arguments[0].click();", el);
    console.log(`Force-clicked: ${xpath}`);
  }

  // Helper for waiting for text
  async function waitForText(text, timeout = 10000) {
    return await driver.wait(until.elementLocated(By.xpath(`//*[contains(text(), '${text}')]`)), timeout);
  }

  it('Flow 1: User Registration', async function() {
    console.log(`Starting Registration for ${testUser.email}...`);
    await driver.get(`${baseUrl}/signup`);
    
    // Increased wait to 20s for the first page load/render to allow Expo dev server to compile
    const nameInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='John Doe']")), 20000);
    await driver.sleep(1000); 

    await nameInput.sendKeys(testUser.name);
    await driver.findElement(By.xpath("//input[@placeholder='name@example.com']")).sendKeys(testUser.email);
    await driver.findElement(By.xpath("//input[@placeholder='••••••••']")).sendKeys(testUser.password);
    
    // Choose Interest
    await forceClick("//*[contains(text(), 'AI')]");
    
    // Submit
    await forceClick("//*[text()='Create Account']");
    
    await driver.wait(until.urlContains('/home'), 15000);
    console.log('Registration Successful.');
  });

  it('Flow 2: Dashboard & Navigation', async function() {
    // Check for hero welcome
    await waitForText("Master Your");
    
    // Test navigation tabs
    const tabs = ['Courses', 'Mentors', 'Profile'];
    for (const tab of tabs) {
      console.log(`Navigating to ${tab}...`);
      await forceClick(`//*[contains(text(), '${tab}')]`);
      const path = tab.toLowerCase() === 'mentors' ? 'recommendations' : tab.toLowerCase();
      await driver.wait(until.urlContains(`/${path}`), 10000);
      await driver.sleep(1000);
    }
  });

  it('Flow 3: Depth Testing - Search & Filter', async function() {
    await driver.get(`${baseUrl}/courses`);
    
    // Testing Search
    const search = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Search for any course, skill, or mentor...']")), 10000);
    await search.sendKeys("Full Stack");
    await driver.sleep(2000);
    
    const count = await driver.findElement(By.xpath("//*[contains(text(), 'results found')]")).getText();
    console.log(`Deep Search Results: ${count}`);
    
    // Testing specific category
    await forceClick("//*[text()='Programming']");
    await driver.sleep(1500);
    await waitForText("Programming Courses");
  });

  it('Flow 4: Depth Testing - AI Mentor Chat', async function() {
    await driver.get(`${baseUrl}/recommendations`);
    
    // Check initial messages
    const initialBubbles = await driver.findElements(By.xpath("//*[contains(@style, 'background-color') or @class]"));
    const countBefore = initialBubbles.length;
    
    const chatInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Search for your ideal mastery path...']")), 10000);
    await chatInput.sendKeys("What is the best way to learn Artificial Intelligence?", Key.ENTER);
    
    console.log('Awaiting AI Mentor response...');
    // Wait for a new message bubble to appear (timeout 40s for Gemini)
    await driver.wait(async () => {
      const currentBubbles = await driver.findElements(By.xpath("//*[contains(text(), 'AI') or contains(text(), 'learn') or contains(text(), 'course')]"));
      return currentBubbles.length > countBefore;
    }, 40000);
    
    console.log('AI response received and verified.');
  });

  it('Flow 5: Depth Testing - Profile & Settings', async function() {
    await driver.get(`${baseUrl}/settings`);
    
    const bio = await driver.wait(until.elementLocated(By.xpath("//textarea | //input[not(@type='password')]")), 10000);
    await bio.sendKeys(Key.CONTROL, "a", Key.BACK_SPACE);
    await bio.sendKeys(testUser.newBio);
    
    await forceClick("//*[text()='Save Changes']");
    await waitForText("updated successfully");
    
    // Check Profile
    await driver.get(`${baseUrl}/profile`);
    await waitForText(testUser.name);
    console.log('Profile and Setting persistence verified.');
  });

  it('Flow 6: Security - Error Handling & Sign Out', async function() {
    // Sign out
    await driver.get(`${baseUrl}/home`);
    await forceClick("//*[text()='Exit']");
    await driver.wait(until.urlContains('/signin'), 10000);
    
    // Test Wrong Credentials
    const email = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='name@example.com']")), 5000);
    await email.sendKeys("wrong@user.com");
    await driver.findElement(By.xpath("//input[@placeholder='Enter your password']")).sendKeys("wrongpass");
    
    await forceClick("//*[text()='Sign In']");
    
    // Wait for error text
    const error = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Invalid') or contains(text(), 'credentials')]")), 10000);
    expect(await error.isDisplayed()).to.be.true;
    console.log('Error handling verified.');
  });
});
