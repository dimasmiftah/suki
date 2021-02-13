const HLRTelkomsel = require('./HLRTelkomsel');
const puppeteer = require('puppeteer');

const generatePhoneNumber = () => {
  const randomRegion = randomProperty(HLRTelkomsel);
  const randomHLR = randomElement(randomRegion);
  return makeItTwenty(randomHLR);
};

const randomProperty = (obj) => {
  const keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
};

const randomElement = (array) => {
  const idx = Math.floor(Math.random() * array.length);
  return array[idx];
};

const makeItTwenty = (number) => {
  let numberArray = number.split('');
  for (let i = 0; i <= 17 - numberArray.length; i++) {
    const randomNumber = String(Math.floor(Math.random() * 10));
    numberArray.push(randomNumber);
  }
  return numberArray.join('');
};

const sendMessage = async () => {
  const randomPhoneNumber = generatePhoneNumber();
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(`https://web.whatsapp.com/send?phone=${randomPhoneNumber}`, {
    waitUntil: 'networkidle2',
  });

  try {
    // wait message input to show up
    const messageInputSelector =
      '#main > footer > div._3SvgF._1mHgA.copyable-area > div.DuUXI > div > div._1awRl.copyable-text.selectable-text';
    await page.waitForSelector(messageInputSelector, { timeout: 20000 });

    const messageContent = [
      "i'm so sorry",
      'https://www.tiktok.com/@dimasmiftah?lang=en',
    ];
    for (let i = 0; i < messageContent.length; i++) {
      // type message
      await page.type(messageInputSelector, messageContent[i], { delay: 100 });
      // click send
      await page.click('._2Ujuu');
    }

    page.waitForTimeout(3000);
    // open menu
    await page.click(
      '#side > header > div._1eNef > div > span > div:nth-child(3) > div'
    );
    // click logout
    await page.click(
      '#side > header > div._1eNef > div > span > div._2wfYK.lpKIg > span > div > ul > li:nth-child(7) > div'
    );
    await browser.close();
  } catch (error) {
    await browser.close();
    await sendMessage();
  }
};

sendMessage();
