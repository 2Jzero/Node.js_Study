const testFolder = './data'; //경로
const fs = require('fs');

fs.readdir(testFolder, function(err, fileList) { //배열로 반환
  console.log(fileList); // CSS, HTML, JAVASCRIPT
});
