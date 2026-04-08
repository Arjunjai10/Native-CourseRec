const { Builder, By, until, Key } = require('selenium-webdriver');
const { expect } = require('chai');

describe('EduLearn Comprehensive All-Function Test', function() {
    this.timeout(90000); // Give it enough time for a full project journey
    let driver;
    const baseUrl = 'http://localhost:8081';
    
    // Test data
    const randomId = Math.floor(Math.random() * 10000);
    const testUser = {
        name: `User ${randomId}`,
        email: `tester${randomId}@example.com`,
        password: 'Password123!'
    };

    before(async function() {
        console.log('Driver Initialized.');
        const chrome = require('selenium-webdriver/chrome');
        const options = new chrome.Options();
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');

        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        
        console.log(`Checking app availability at ${baseUrl}...`);
        try {
            await driver.get(baseUrl);
            console.log('App reachable.');
        } catch (e) {
            console.error('App is NOT reachable at localhost:8081. Ensure npm run web is active.');
        }
    });

    after(async function() {
        if (driver) await driver.quit();
    });

    async function waitForElement(xpath, timeout = 12000) {
        return await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
    }

    async function jsClick(element) {
        await driver.executeScript("arguments[0].click();", element);
    }

    async function clearAndType(xpath, text) {
        const el = await waitForElement(xpath);
        await el.sendKeys(Key.CONTROL, "a", Key.BACK_SPACE);
        await el.sendKeys(text);
    }

    it('Flow 1: User Registration', async function() {
        await driver.get(`${baseUrl}/signup`);

        console.log(`Starting Registration for ${testUser.email}...`);
        await clearAndType("//input[@placeholder='John Doe']", testUser.name);
        await clearAndType("//input[@placeholder='name@example.com']", testUser.email);
        await clearAndType("//input[@placeholder='••••••••']", testUser.password);

        // Select specific interest
        const interest = await waitForElement("//*[contains(text(), 'Artificial Intelligence') or contains(text(), 'AI')]");
        await jsClick(interest);

        const btn = await waitForElement("//*[text()='Create Account']");
        await jsClick(btn);

        await driver.wait(until.urlContains('/home'), 15000);
        console.log('Registration Success.');
    });

    it('Flow 2: Dashboard & Navigation', async function() {
        await waitForElement("//*[contains(text(), 'Welcome Back')]");
        
        const tabs = ['Courses', 'Mentors', 'Profile'];
        for (const tab of tabs) {
            await driver.sleep(1500); // UI breathing room
            console.log(`Navigating to ${tab}...`);
            const navLink = await waitForElement(`//*[contains(text(), '${tab}')]`);
            await jsClick(navLink);
            
            const path = tab.toLowerCase() === 'mentors' ? 'recommendations' : tab.toLowerCase();
            await driver.wait(until.urlContains(`/${path}`), 10000);
        }
        console.log('All tabs verified.');
    });

    it('Flow 3: Depth Testing - Search & Filter', async function() {
        await driver.get(`${baseUrl}/courses`);
        await clearAndType("//input[contains(@placeholder, 'Search for')]", "Python");
        await driver.sleep(2000);
        
        // Wait for results header to update
        const header = await waitForElement("//*[contains(text(), 'Searching for')]");
        expect(await header.isDisplayed()).to.be.true;
        console.log('Search function verified.');
    });

    it('Flow 4: Depth Testing - Profile & Settings', async function() {
        await driver.get(`${baseUrl}/settings`);
        
        console.log('Updating user biography...');
        const bio = await waitForElement("//textarea[contains(@placeholder, 'Tell')] | //input[contains(@placeholder, 'Tell')]");
        await bio.sendKeys(Key.CONTROL, "a", Key.BACK_SPACE);
        await bio.sendKeys("This is an automated test update.");

        const save = await waitForElement("//*[text()='Save Changes']");
        await jsClick(save);

        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'updated successfully')]")), 8000);
        console.log('Profile update verified.');
    });

    it('Flow 5: Security - Error Handling & Sign Out', async function() {
        console.log('Signing out...');
        await driver.get(`${baseUrl}/home`);
        const exit = await waitForElement("//*[text()='Exit']");
        await jsClick(exit);

        await driver.wait(until.urlContains('/signin'), 10000);
        
        console.log('Testing invalid sign-in error handling...');
        // Wait for page to be ready
        await driver.sleep(2000);
        
        await clearAndType("//input[contains(@placeholder, 'example.com')]", "wrong@user.com");
        await clearAndType("//input[contains(@placeholder, 'password')]", "badpass");
        
        // Find the interactive Sign In button (not the title)
        const allSignInTexts = await driver.findElements(By.xpath("//*[text()='Sign In']"));
        let loginBtn;
        for (const el of allSignInTexts) {
            const fontSize = await el.getCssValue('font-size');
            // The title is huge (32px), the button text is smaller (16px)
            if (parseInt(fontSize) < 30) {
                loginBtn = el;
                break;
            }
        }
        
        if (!loginBtn) loginBtn = await waitForElement("//*[text()='Sign In']");
        await jsClick(loginBtn);

        console.log('Waiting for the invalid credentials message...');
        const error = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(), 'Invalid') or contains(text(), 'credentials')]")),
            15000
        );
        
        expect(await error.isDisplayed()).to.be.true;
        console.log('Invalid Sign-In handling verified.');
    });
});
