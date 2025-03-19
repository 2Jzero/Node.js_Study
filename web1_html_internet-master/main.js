var http = require('http'); // 웹서버 만들 때 필요한 모듈 가져오는 코드
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/') {
      if(queryData.id === undefined) {
          fs.readdir('./data', function(err, fileList) {
            var title = 'Welcome';
            var description = 'Hello, Node.js';
            var list = '<ul>';
            var i = 0;
            while(i < fileList.length) {
              list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
              i++;
            };
            list = list + '</ul>';
            var template = `
            <!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
              <h2>${title}</h2>
              <p>${description}</p>

            </body>
            </html>
            `;
            response.writeHead(200);
            response.end(template);
          });

      } else {
        fs.readdir('./data', function(err, fileList) {
          var list = '<ul>';
          var i = 0;
          while(i < fileList.length) {
            list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
            i++;
          };

          list = list + '</ul>';
        fs.readFile(`data/${queryData.id}`,'utf8', function(err, description) {
          var title = queryData.id;
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>

          </body>
          </html>
          `;
          response.writeHead(200);
          response.end(template);
        });
      });
      }
    } else {
      response.writeHead(404);
      response.end('Not found');
    };
});
app.listen(3000);
