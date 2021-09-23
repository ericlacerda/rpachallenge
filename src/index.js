const read = require("./Excel");
const forms = require("./Selenium/form");
const play = require("./Playwright/form");
// const { exec, spawn } = require('child_process');

const excelFileName = 'challenge.xlsx';
const targetPage = 'http://rpachallenge.com/';

// const fullPath = __dirname + "\\util\\UpdateChrome.exe";
// exec( fullPath , (err, stdout, stderr) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(stdout);
// });


const run = async() => { 
    const rows = await read(excelFileName);
    console.log(await forms(targetPage, rows));   
     
     //console.log(await play(targetPage, rows));    
}


run()