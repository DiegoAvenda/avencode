const fs = require('fs');
const buf = Buffer.from([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,2,0,0,0,0,0,226,211,68,227]);
fs.writeFileSync('c:\\Users\\eliza\\projects\\avencode\\src\\assets\\avencode.png', buf);
console.log('Created avencode.png');