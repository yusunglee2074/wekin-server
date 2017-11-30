const excel = require('node-excel-export')


const styles = {
  headerDark: {
    fill: {
      fgColor: {
        rgb: 'FF000000'
      }
    },
    font: {
      color: {
        rgb: 'FFFFFFFF'
      },
      sz: 14,
      bold: true,
      underline: true
    }
  },
  cellPink: {
    fill: {
      fgColor: {
        rgb: 'FFFFCCFF'
      }
    }
  },
  cellGreen: {
    fill: {
      fgColor: {
        rgb: 'FF00FF00'
      }
    }
  }
};




//Here you specify the export structure
const specification = {
  name: { // <- the key should match the actual data key
    displayName: '메이커 이름', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  },
  phone: {
    displayName: '메이커 번호',
    headerStyle: styles.headerDark,
    width: '10' // <- width in chars (when the number is passed as string)
  },
  title: {
    displayName: '위킨 제목',
    headerStyle: styles.headerDark,
    width: 220 // <- width in pixels
  },
  price: {
    displayName: '가격',
    headerStyle: styles.headerDark,
    width: 220 // <- width in pixels
  }
}

const model = require('./model')

const dataset = []

model.ActivityNew.findAll({
  include: [ 'Host' ],
  where: {
    status: 3
  }
})
.then(activities => {
  for (let i = 0, length = activities.length; i < length; i++) {
    let item = activities[i]
    dataset.push({
      name: item.Host.name,
      phone: item.Host.tel,
      title: item.title,
      price: item.base_price
    })
  }
const merges = [
]

const report = excel.buildExport(
  [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
    {
      name: 'Report', // <- Specify sheet name (optional)
      merges: merges, // <- Merge cell ranges
      specification: specification, // <- Report specification
      data: dataset // <-- Report data
    }
  ]
);



var fs = require('fs');


fs.writeFile("./test.xlsx", report, function (err) {

})
})

