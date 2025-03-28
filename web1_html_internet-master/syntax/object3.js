// 실용성 배제, 어디까지 ex
var o = {
  v1 : 'v1',
  v2 : 'v2',
  f1 : function () {
    console.log(this.v1); // 자기 객체 참조, o이름이 바뀌어도 오류 x
  },
  f2 : function () {
    console.log(this.v2);
  }
};

o.f1();
o.f2();
