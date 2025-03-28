// array, object
// 함수가 값이 될 수 있다.
var f = function() {
  console.log(1+1);
  console.log(1+2);

}; // 익명함수

var a = [f]; // 배열에 담아서 사용가능
a[0]();

var o = {  // 객체에 담아서 사용가능
  func : f
};
o.func();
