var args = process.argv; // 실행기위치, 실행된파일위치 그 뒤는 입력딘 값 배열로 반환
console.log(args[2]);
console.log('A');
console.log('B');
if(args[2] === 'siesta') {
console.log('C1');
} else {
console.log('C2');
}
console.log('D');
