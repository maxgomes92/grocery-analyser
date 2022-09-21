const extractInformation = require('./extractInformation')
const fs = require('fs')

function generateTotalChart (receipts) {
  const data = receipts.reduce((acc, cur) => {
    if (!acc[cur.date]) {
      acc[cur.date] = {}
    }
    
    acc[cur.date].xLabel = cur.date
    acc[cur.date].total = acc[cur.date].total ? acc[cur.date].total + cur.total : cur.total

    return acc
  }, {})

  fs.writeFileSync('./src/data/total.json', JSON.stringify(Object.values(data), null, 4))
}

(async () => {
  const receipts = await extractInformation()

  generateTotalChart(receipts)
})()