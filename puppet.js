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

const puppetToBuffer = async (url, path) => {
    
    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        handleSIGINT : false,
        args: [
        '--disable-web-security',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials'
    ]});
    const page = await browser.newPage();
    const viewSource = await page.goto(url, { waitUntil : 'networkidle2' });
    const data = await viewSource.buffer()
    await browser.close();
    return data
};

module.exports = { puppetToBuffer }