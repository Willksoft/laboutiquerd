const fs = require('fs');
let c = fs.readFileSync('App.tsx', 'utf8');
const tag = '<main className="flex-grow">';
const idx = c.indexOf(tag);
if (idx === -1) { console.log('NOT FOUND'); process.exit(1); }
c = c.substring(0, idx) + '<ScrollToTop />\n      ' + c.substring(idx);
fs.writeFileSync('App.tsx', c, 'utf8');
console.log('ScrollToTop mounted before main');
