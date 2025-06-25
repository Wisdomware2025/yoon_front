const fs = require('fs');
const path = require('path');

require('@babel/register')({
  presets: ['@babel/preset-env'],
  extensions: ['.js'],
});

const {translationKeys} = require('./index');

fs.writeFileSync(
  path.join(__dirname, 'base.ko.json'),
  JSON.stringify(translationKeys, null, 2),
  'utf8',
);

console.log('base.ko.json 생성완료');
