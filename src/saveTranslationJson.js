// saveTranslationJson.js

require('@babel/register')({
  presets: ['@babel/preset-env'],
  extensions: ['.js'],
});

const fs = require('fs');
const path = require('path');
const {translationKeys} = require('./translations/index');

const outputDir = path.join(__dirname, 'locales', 'ko');
const outputFile = path.join(outputDir, 'translation.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {recursive: true});
}

fs.writeFileSync(outputFile, JSON.stringify(translationKeys, null, 2), 'utf8');

console.log('translation.json 파일이 생성되었습니다:', outputFile);
