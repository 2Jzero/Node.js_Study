var http = require('http'); // 웹서버 만들 때 필요한 모듈 가져오기
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html'); // 민감한 태그 필터링해주는 것

function showMainPage(response, title, description, fileList) {
  var list = template.list(fileList);
  var html = template.html(title, list, `<h2>${title}</h2>${description}`,
  `<a href="/create">create</a>`);
  response.writeHead(200);
  response.end(html);
}

function showPage(response, sanitizedTitle, sanitizedDescription, fileList) {
  var list = template.list(fileList);
  var html = template.html(sanitizedTitle, list, `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
  `<a href="/create">create</a>
   <a href="/update?id=${sanitizedTitle}">update</a>
   <form action="delete_process" method="post">
   <input type="hidden" name="id" value="${sanitizedTitle}">
   <input type="submit" value ="delete">
   </form>
  `);
  response.writeHead(200);
  response.end(html);
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
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var sanitizedTitle = sanitizeHtml(title);
          var sanitizedDescription = sanitizeHtml(description, {
            allowedTags:['h1']
          });
          showPage(response, sanitizedTitle, sanitizedDescription, fileList);
        });
      }
    });
  } else if(pathname === '/create') {
    fs.readdir('./data', function (err, fileList) {
    var title = 'WEB - create';
    var list = template.list(fileList);
    var html = template.html(title, list, `
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
    response.end(html);
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
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
        var title = queryData.id;
        var list = template.list(fileList);
        var html = template.html(title, list,
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
        response.end(html);
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
      var filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function(err) {
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
