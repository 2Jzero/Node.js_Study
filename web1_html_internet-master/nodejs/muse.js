// var M = {
//   v:'v',
//   f:function() {
//     console.log(this.v);
//   }
// }

var part = require('./mpart.js');
console.log(part); // module.exports 값으로 대입한 객체
part.f();
