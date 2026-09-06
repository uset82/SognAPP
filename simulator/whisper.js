const https = require('https');

function transcribeWithWhisper(audioBase64, mimeType, language, apiKey) {
  const buffer = Buffer.from(audioBase64, 'base64');
  const boundary = `----sognsafe${Date.now()}`;
  const filename = mimeType.includes('webm') ? 'speech.webm' : 'speech.m4a';
  const lang = language === 'no' ? 'no' : 'en';

  const preamble = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="model"\r\n\r\nwhisper-1\r\n` +
      `--${boundary}\r\nContent-Disposition: form-data; name="language"\r\n\r\n${lang}\r\n` +
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`
  );
  const closing = Buffer.from(`\r\n--${boundary}--\r\n`);
  const body = Buffer.concat([preamble, buffer, closing]);

  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        hostname: 'api.openai.com',
        path: '/v1/audio/transcriptions',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length,
        },
        timeout: 18000,
      },
      (upstream) => {
        let data = '';
        upstream.on('data', (chunk) => {
          data += chunk;
        });
        upstream.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error('malformed whisper response'));
          }
        });
      }
    );
    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('timeout'));
    });
    request.write(body);
    request.end();
  });
}

module.exports = { transcribeWithWhisper };
