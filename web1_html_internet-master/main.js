var http = require('http'); // 웹서버 만들 때 필요한 모듈 가져오기
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
  </body>
  </html>
  `;
}

function templateList(fileList) {
  var list = '<ul>';
  var i = 0;
  while (i < fileList.length) {
    list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
    i++;
  }
  list += '</ul>';
  return list;
}

function showPage(response, title, description, fileList) {
  var list = templateList(fileList);
  var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
  response.writeHead(200);
  response.end(template);
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    fs.readdir('./data', function (err, fileList) {
      if (queryData.id === undefined) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        showPage(response, title, description, fileList);
      } else {
        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
          showPage(response, title, description, fileList);
        });
      }
    });
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
});

app.listen(3000);
