const http = require('http');
const options = { hostname: 'localhost', port: 4200, path: '/', method: 'GET' };
const req = http.request(options, (res) => {
  let buf = '';
  res.on('data', c => buf += c);
  res.on('end', () => {
    if (buf.includes('<app-root')) {
      console.log('OK: frontend root contains <app-root>');
      process.exit(0);
    } else {
      console.log('WARN: frontend root fetched but <app-root> not found');
      console.log('Response length:', buf.length);
      process.exit(2);
    }
  });
});
req.on('error', (e) => {
  console.error('ERR:', e.message);
  process.exit(1);
});
req.end();
