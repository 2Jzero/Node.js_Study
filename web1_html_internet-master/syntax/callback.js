/*
function a() {
  console.log('A');
}
*/

// 익명 함수
var a = function() {
  console.log('A');
}

function slowFunc(callback) {
  callback(); // a 함수가 실행됨.
}

slowFunc(a);
