const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');


// const browser = await puppeteer.launch({headless: false,
//     devtools: true,args: [
//     '--disable-web-security',
//     '--disable-features=IsolateOrigins',
//     '--disable-site-isolation-trials'
// ]});
// const page = await browser.newPage();
let browser

const openbrowser = async function () {
    return puppeteer.launch({
    headless: false,
    devtools: true,
    handleSIGINT : false,
    args: [
    '--disable-web-security',
    '--disable-features=IsolateOrigins',
    '--disable-site-isolation-trials'
]})};

const puppetToBuffer = async (url, path) => {
    
    // const browser = await puppeteer.launch({
    //     headless: false,
    //     devtools: true,
    //     handleSIGINT : false,
    //     args: [
    //     '--disable-web-security',
    //     '--disable-features=IsolateOrigins',
    //     '--disable-site-isolation-trials'
    // ]});
    browser = browser || await openbrowser()
    const page = await browser.newPage();
    const viewSource = await page.goto(url, { waitUntil : 'networkidle2' });
    const data = await viewSource.buffer()
    await page.close();
    return data
};

const closeBrowser = async function() {
    if (browser) {
        await browser.close()
    }
}

module.exports = { puppetToBuffer, closeBrowser, openbrowser }