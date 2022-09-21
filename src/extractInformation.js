const PdfReader = require("pdfreader").PdfReader;
const testFolder = './receipts/';
const fs = require('fs');

function getFiles () {
  return fs.readdirSync(testFolder);
}

function getTextFromPdf (filename) {
  return new Promise((resolve, reject) => {
    let lines = []
    new PdfReader().parseFileItems(testFolder + filename, function(err, item){
      if (item && item.text) {
        lines.push(item.text)
      }

      if (!item) {
        resolve(lines)
      }
    });
  })
}

function extractDate (lines) {
  const line = lines.find(line => line.startsWith('Kassa'))
  const [_, date] = new RegExp(/.+(\d\d\d\d-\d\d-\d\d).+/).exec(line)

  return date
}

function extractProducts (lines) {
  let isAfterDashes = null
  const products = lines.filter(line => {
    if(isAfterDashes === false) {
      return false
    }

    if (line.startsWith('---')) { 
      if(isAfterDashes === null) {
        isAfterDashes = true
        return false
      }

      if (isAfterDashes === true) {
        isAfterDashes = false
        return false
      }
    }

    if(isAfterDashes === null) {
      return false
    }

    return true
  })

  return products.map(productLine => {
    const [_, label, price] = new RegExp(/(.+)\s(-?\d+,\d+)/).exec(productLine.trim())

    return {
      label: label.trim(),
      price: parseFloat(price.replace(',', '.')),
    }
  }).filter((o) => o)
}

async function readReceipt (filename) {
  const lines = await getTextFromPdf(filename)
  const products = extractProducts(lines)
  const date = extractDate(lines)
  const total = Math.round(products.reduce((acc, cur) => {
    acc += cur.price
    return acc
  }, 0))

  

  return {
    date,
    total,
    products,
  }
}

(async function () {
  const files = getFiles()

  let receipts = []
  for (let file of files) {
    const receipt = await readReceipt(file)
    receipts.push(receipt)
  }

  console.log(receipts[0])
  console.log(receipts[1])
})()