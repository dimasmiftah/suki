const HLRTelkomsel = require('./HLRTelkomsel');
const puppeteer = require('puppeteer');

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
const messageContent = [
  'Jalan-jalan ke parangtritis',
  'Telanjang bulat gatau malu',
  'Aku bukan cowok romantis',
  'Tapi mau ngga jadi pacarku?',
];

const sendMessage = async () => {
  const randomRegion = randomProperty(HLRTelkomsel);
  const randomHLR = randomElement(randomRegion);
  const randomPhoneNumber = makeItTwenty(randomHLR);
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(`https://web.whatsapp.com/send?phone=${randomPhoneNumber}`, {
    waitUntil: 'networkidle2',
  });

  const messageInputSelector =
    '#main > footer > div._3SvgF._1mHgA.copyable-area > div.DuUXI > div > div._1awRl.copyable-text.selectable-text';
  try {
    //wait message input
    await page.waitForSelector(messageInputSelector, { timeout: 10000 });

    for (let i = 0; i < messageContent.length; i++) {
      //type message
      await page.type(messageInputSelector, messageContent[i]);
      // send message
      await page.click('._2Ujuu');
    }

    // wait for a bit
    page.waitForTimeout(3000);

    // open menu
    await page.click(
      '#side > header > div._1eNef > div > span > div:nth-child(3) > div'
    );

    // click logout
    await page.click(
      '#side > header > div._1eNef > div > span > div._2wfYK.lpKIg > span > div > ul > li:nth-child(7) > div'
    );

    // close browser
    await browser.close();
  } catch (error) {
    // close browser
    await browser.close();
    await sendMessage();
  }
};

sendMessage();
