const fs = require('fs');
let c = fs.readFileSync('components/BraidsBooking.tsx', 'utf8');
c = c.replace("(window as any).__navigate?.('/braids/gallery')", "navigate('/braids/gallery')");
fs.writeFileSync('components/BraidsBooking.tsx', c, 'utf8');
console.log('done');
