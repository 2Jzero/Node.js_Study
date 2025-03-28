// array
var members = ['junZero', 'k8805', 'hoyi'];
console.log(members[1]);

var i = 0;

// array loop
while(i < members.length) {
  console.log('arr loop :', members[i]);
  i+=1;
}

// object
var roles = {
  'programmer' : 'junZero',
  'designer' : 'k8805',
  'manager' : 'hoyi'
};
console.log(roles.designer);
console.log(roles['designer']);

// object loop
for(var name in roles) {
  console.log('object :', name, 'value :', roles[name]);
}
