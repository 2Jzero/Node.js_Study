var http = require('http'); // 웹서버 만들 때 필요한 모듈 가져오기
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control) {
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
    ${control}
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

function showMainPage(response, title, description, fileList) {
  var list = templateList(fileList);
  var template = templateHTML(title, list, `<h2>${title}</h2>${description}`,
  `<a href="/create">create</a>`);
  response.writeHead(200);
  response.end(template);
}

function showPage(response, title, description, fileList) {
  var list = templateList(fileList);
  var template = templateHTML(title, list, `<h2>${title}</h2>${description}`,
  `<a href="/create">create</a>
   <a href="/update?id=${title}">update</a>
   <form action="delete_process" method="post">
   <input type="hidden" name="id" value="${title}">
   <input type="submit" value ="delete">
   </form>
  `);
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
        showMainPage(response, title, description, fileList);
      } else {
        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
          var title = queryData.id;
          showPage(response, title, description, fileList);
        });
      }
    });
  } else if(pathname === '/create') {
    fs.readdir('./data', function (err, fileList) {
    var title = 'WEB - create';
    var list = templateList(fileList);
    var template = templateHTML(title, list, `
    <form action="/create_process" method="post">
      <p><input type="text" name="title" placeholder="제목"></p>
      <p>
        <textarea name="description" placeholder="내용"></textarea>
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
    `, '');
    response.writeHead(200);
    response.end(template);
  });
} else if(pathname === '/create_process') {
    var body = '';
    request.on('data', function(data) { // 콜백함수 실행될때마다 바디에다 데이터 +=
        body += data;
    });
    request.on('end', function() {
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8',
        function(err) {
          response.writeHead(302, {Location: `/?id=${title}`}); // 302 = redirect
          response.end();
        });
    });
} else if(pathname === '/update') {
  fs.readdir('./data', function (err, fileList) {
      fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
        var title = queryData.id;
        var list = templateList(fileList);
        var template = templateHTML(title, list,
          `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="제목" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="내용">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a> <a href="/delete">delete</a>`);
        response.writeHead(200);
        response.end(template);
      });
  });
} else if(pathname === '/update_process') {
  var body = '';
  request.on('data', function(data) { // 콜백함수 실행될때마다 바디에다 데이터 +=
      body += data;
  });
  request.on('end', function() {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function(err) {
        fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
          response.writeHead(302, {Location: `/?id=${title}`}); // 302 = redirect
          response.end();
      });
    });
  });
} else if(pathname === '/delete_process') {
  var body = '';
  request.on('data', function(data) { // 콜백함수 실행될때마다 바디에다 데이터 +=
      body += data;
  });
  request.on('end', function() {
      var post = qs.parse(body);
      var id = post.id;
      fs.unlink(`data/${id}`, function(err) {
        response.writeHead(302, {Location: `/`}); // 302 = redirect
        response.end();
      });
  });
} else {
      response.writeHead(404);
      response.end('Not found');
    }
});

app.listen(3000);
