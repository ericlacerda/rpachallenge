const delay = require("delay");
const { Builder, By, until } = require("selenium-webdriver")
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const converter = require('json-2-csv');
const request = require('request');

const openPage = async (targetPage) => {

    let driver = await new Builder().forBrowser("chrome").build();
    await driver.get(targetPage);
    return driver;
}

const gettable = async (table, name) => {

    console.log("Extraindo tabela.")
    var headersTable = [];
    let rowsTable = await table.findElements(By.css('tr'));
    let json = await Promise.all(rowsTable.map(async (row, index) => {
        let schemas = [{}, {}];
        if (index == 0) {
            let headers = await row.findElements(By.css('th'));
            headersTable = await Promise.all(headers.map(header => header.getText()));
        } else {
            let body = await row.findElements(By.css('td'));
            let schema = schemas[0];
            bodyTable = await Promise.all(body.map(cell => cell.getText()));
            if (body.length == headersTable.length) {
                for (i = 0; i < body.length; i++) {
                    schema[headersTable[i]] = bodyTable[i];
                }
                return schema;
            } else {
                let schema1 = schemas[0];
                let schema2 = schemas[1];
                for (i = 0; i < headersTable.length; i++) {
                    schema1[headersTable[i]] = bodyTable[i];
                    schema2[headersTable[i]] = bodyTable[i + 2];
                }
                return [schema1, schema2];
            }
        }
    }));
    let todos = json.flatMap(values => values).filter(values => values);

    converter.json2csv(todos, (err, csv) => {
        if (err) {
            throw err;
        }
        //console.log(csv);
        fs.writeFileSync(".\\table\\" +name+".csv", csv);

    });
}


async function download(url, dest) {

    /* Create an empty file where we can save data */
    const file = fs.createWriteStream( dest);

    /* Using Promises so that we can use the ASYNC AWAIT syntax */
    await new Promise((resolve, reject) => {
      request({
        /* Here you should specify the exact link to the file you are trying to download */
        uri: url,
        gzip: true,
      })
          .pipe(file)
          .on('finish', async () => {
            console.log(`The file is finished downloading.`);
            resolve();
          })
          .on('error', (error) => {
            reject(error);
          });
    })
        .catch((error) => {
         // console.log(`Something happened: ${error}`);
        });
}

const stock = async (targetPage) => {
    let driver = null;
    let retorno;
    try {
        driver = await openPage(targetPage);

        const listItens = await driver.findElement(By.className('container1')).findElements(By.xpath("div"));


        //console.log(listItens.length)
        for (const itens of listItens) {
            const subs = await itens.findElements(By.xpath('*'));
            for (const sub of subs) {               
                if (await sub.getTagName() == "table") {
                    
                    await gettable(sub, await itens.getAttribute('class'));
                }
                else {
                    const imagens = await sub.findElements(By.tagName("img"))
                    for (const image of imagens) {
                        const SRC = await image.getAttribute("src");
                        let name = (await SRC).split("/");
                        await download(SRC,".\\Img\\" + name[name.length - 1]);                      
                    }
                    console.log(await sub.getText());
                }
            }
        }
        // -- PEGA TODAS AS TABELAS --
        // const listtable = await driver.findElement(By.className('container1')).findElements(By.tagName("table"));
        // console.log( listtable.length)
        // for (let index = 0; index < listtable.length; index++) {
            
        //     await gettable(listtable[index], `${index} table`);
            
        // }
        


    } catch (error) {
        console.log(error)
    } finally {
        await driver.quit();
    }
    return retorno;
}

module.exports = stock