const { Builder, By, until, Key } = require('selenium-webdriver');
const { expect } = require('chai');

describe('EduLearn Full Project Flow', function() {
  this.timeout(60000); // 1 minute timeout for the full flow
  let driver;
  const baseUrl = 'http://localhost:8081';
  const randomId = Math.floor(Math.random() * 10000);
  const testUser = {
    name: `Test User ${randomId}`,
    email: `test${randomId}@example.com`,
    password: 'Password123!'
  };

  before(async function() {
    console.log('Initializing Chrome driver for Full Flow...');
    const chrome = require('selenium-webdriver/chrome');
    const options = new chrome.Options();
    // options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    try {
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
      console.log('Driver initialized.');
      
      console.log(`Checking if app is running at ${baseUrl}...`);
      try {
        await driver.get(baseUrl);
        console.log('App is reachable.');
      } catch (e) {
        console.warn('App might not be running. Ensure "npm run web" is active.');
      }
    } catch (err) {
      console.error('Driver initialization failed:', err);
      throw err;
    }
  });

  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  async function waitForElement(xpath, timeout = 10000) {
    return await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
  }

  it('1. Should Sign Up a new user', async function() {
    await driver.get(`${baseUrl}/signup`);

    const nameInput = await waitForElement("//input[@placeholder='John Doe']");
    const emailInput = await driver.findElement(By.xpath("//input[@placeholder='name@example.com']"));
    const passwordInput = await driver.findElement(By.xpath("//input[@placeholder='••••••••']"));

    await nameInput.sendKeys(testUser.name);
    await emailInput.sendKeys(testUser.email);
    await passwordInput.sendKeys(testUser.password);

    // Select an interest (e.g., Development)
    const interestChip = await driver.findElement(By.xpath("//*[text()='Development']"));
    await interestChip.click();

    const createButton = await driver.findElement(By.xpath("//*[text()='Create Account']"));
    await createButton.click();

    // After signup, it should redirect to home
    await driver.wait(until.urlContains('/home'), 10000);
    const welcomeText = await waitForElement("//*[contains(text(), 'Welcome Back')]");
    expect(await welcomeText.isDisplayed()).to.be.true;
  });

  it('2. Should navigate through different tabs', async function() {
    // Tests Navbar navigation
    const navItems = ['Courses', 'Mentors', 'Profile'];
    
    for (const item of navItems) {
      const navLink = await waitForElement(`//*[text()='${item}']`);
      await navLink.click();
      
      const path = item.toLowerCase() === 'mentors' ? 'recommendations' : item.toLowerCase();
      await driver.wait(until.urlContains(`/${path}`), 5000);
      console.log(`Successfully navigated to /${path}`);
    }
  });

  it('3. Should update settings', async function() {
    await driver.get(`${baseUrl}/settings`);

    const bioInput = await waitForElement("//textarea[@placeholder='Tell your students and colleagues about yourself...'] | //input[@placeholder='Tell your students and colleagues about yourself...']");
    const newBio = "I am a test bot exploring the EduLearn platform.";
    
    // Clear and type
    await bioInput.sendKeys(Key.CONTROL, "a", Key.BACK_SPACE);
    await bioInput.sendKeys(newBio);

    const saveButton = await driver.findElement(By.xpath("//*[text()='Save Changes']"));
    await saveButton.click();

    // Check for success message
    const successMsg = await waitForElement("//*[contains(text(), 'updated successfully')]");
    expect(await successMsg.isDisplayed()).to.be.true;
  });

  it('4. Should Sign Out', async function() {
    // Navigate home first to see the logout button in navbar
    await driver.get(`${baseUrl}/home`);
    
    const signOutBtn = await waitForElement("//*[text()='Exit']");
    await signOutBtn.click();

    await driver.wait(until.urlContains('/signin'), 5000);
    const signInTitle = await waitForElement("//*[text()='Sign In']");
    expect(await signInTitle.isDisplayed()).to.be.true;
  });
});
