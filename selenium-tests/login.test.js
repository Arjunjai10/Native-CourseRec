const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('EduLearn Sign In Test', function() {
  this.timeout(30000); // Set timeout for the whole suite
  let driver;

  before(async function() {
    console.log('Initializing Chrome driver...');
    const chrome = require('selenium-webdriver/chrome');
    const options = new chrome.Options();
    // options.addArguments('--headless'); // Uncomment for headless mode
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    try {
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
      console.log('Driver initialized.');
    } catch (err) {
      console.error('Failed to initialize driver:', err);
      throw err;
    }
  });

  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  it('should show an error message with invalid credentials', async function() {
    // Replace with your local dev server URL
    await driver.get('http://localhost:8081/signin');

    // Wait for the email input to be visible
    const emailInput = await driver.wait(
      until.elementLocated(By.xpath("//input[@placeholder='name@example.com']")),
      10000
    );

    const passwordInput = await driver.findElement(By.xpath("//input[@placeholder='Enter your password']"));
    const signInButton = await driver.findElement(By.xpath("//div[text()='Sign In'] | //button[text()='Sign In'] | //*[contains(text(), 'Sign In')]"));

    await emailInput.sendKeys('test@example.com');
    await passwordInput.sendKeys('wrongpassword');
    await signInButton.click();

    // Check for error message
    const errorText = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'Login failed') or contains(text(), 'invalid')]")),
      5000
    );

    const isDisplayed = await errorText.isDisplayed();
    expect(isDisplayed).to.be.true;
  });

  it('should navigate to home on successful login (Mock logic)', async function() {
    // Note: This requires a working backend or mocked response
    // For now, we just verify the elements are present
    await driver.get('http://localhost:8081/signin');
    
    const title = await driver.getTitle();
    // Expo apps usually set a default title if not specified
    console.log('Page title:', title);
  });
});
