const fs = require('node:fs');
const path = require('node:path');
const { Resvg } = require('@resvg/resvg-js');
const source = fs.readFileSync(path.join(__dirname, 'SOGN-SAFE-Reference-Master.svg'), 'utf8');
const render = new Resvg(source);
fs.writeFileSync(path.join(__dirname, 'SOGN-SAFE-Reference-Master.png'), render.render().asPng());
fs.writeFileSync(path.join(__dirname, 'SOGN-SAFE-Reference-Outlined.svg'), render.toString());
const icon = source
  .replace('width="1254" height="1254" viewBox="0 0 1254 1254"', 'width="1024" height="1024" viewBox="184.5 91 884 859.5" preserveAspectRatio="none"')
  .replace(/<rect id="Paper"[^>]*\/>/, '')
  .replace(/<g id="Wordmark"[\s\S]*<\/g>/, '')
  .replace('filter="url(#tileShadow)"', '');
fs.writeFileSync(path.join(__dirname, 'SOGN-SAFE-App-Icon-Reference.svg'), icon);
fs.writeFileSync(path.join(__dirname, 'SOGN-SAFE-App-Icon-Reference.png'), new Resvg(icon).render().asPng());
console.log('Rendered full logo and 1024 icon. Outlined SVG contains text nodes:', render.toString().includes('<text'));
