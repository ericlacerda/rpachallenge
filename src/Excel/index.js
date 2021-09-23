const ExcelJS = require('exceljs');

const createTemplate = (titles) => {
    return titles.map((title) => title.trim())
}

const extractDataFromRow = (row, template) => {
    return row.values.reduce((result, value, index) => {
        result[template[index]] = value
        return result;
    }, {});
}

const extractDataFromSheet = (worksheet, template, data) => {
    worksheet.eachRow((row => {
        if (row.number == 1) return
        data.push(extractDataFromRow(row, template))
    }))
}

const read = async (filename) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filename);
    data = []
    workbook.eachSheet((worksheet, sheetId) => {
        const template = createTemplate(worksheet.getRow(1).values)
        extractDataFromSheet(worksheet, template, data)
    });
    return data;
}

module.exports = read