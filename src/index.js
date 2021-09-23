const read = require("./Excel");
const forms = require("./Selenium/form");
const stock = require("./Selenium/stock");
// const { exec, spawn } = require('child_process');

const excelFileName = 'challenge.xlsx';
const targetPageInput = 'http://rpachallenge.com/';
const targetPageStock = 'http://rpachallenge.com/assets/rpaStockMarket/index.html';

// -- EXECUTA UM PROGRAMA FEITO EM C# PARA ATUALIZAR O CHROMEDRIVER --
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
    console.log(await forms(targetPageInput, rows));   
    await stock(targetPageStock);    
    
}


run()