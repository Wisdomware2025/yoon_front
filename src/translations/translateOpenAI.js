const fs = require('fs');
const path = require('path');
const axios = require('axios');

const targetLangs = [
  // 'en',
  // 'jh',
  // 'th',
  // 'km',
  // 'vi',
  // 'mn',
  'uz',
  // 'si',
  // 'id',
  // 'my',
  // 'ne',
];

const translate = async (text, lang) => {
  const prompt = `Translate the following JSON from Korean to ${lang}.
Return only the translated JSON without any explanations, comments, or extra text.
Keep all the keys exactly as they are.
Do not change the structure of the JSON.
Respond with valid JSON only.\n${JSON.stringify(text, null, 2)}`;

  const res = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4-turbo',
      messages: [
        {role: 'system', content: 'You are a helpful assistant.'},
        {role: 'user', content: prompt},
      ],
      temperature: 0.2,
      max_tokens: 4096,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
    },
  );

  const content = res.data.choices[0].message.content;

  try {
    const start = content.indexOf('{');
    const jsonString = content.slice(start);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(`${lang} 번역실패`);
    console.log(`${lang} 번역실패, 응답 내용:`, content);

    return null;
  }
};

(async () => {
  for (const lang of targetLangs) {
    const result = await translate(baseJson, lang);
    if (result) {
      const dir = path.join(__dirname, 'locales', lang);
      fs.mkdirSync(dir, {recursive: true});
      fs.writeFileSync(
        path.join(dir, 'translation.json'),
        JSON.stringify(result, null, 2),
        'utf8',
      );
      console.log(`${lang}/translation.json 파일 생성 완료`);
    }
  }
})();
