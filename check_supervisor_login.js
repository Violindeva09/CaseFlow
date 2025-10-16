const http = require('http');
function post(path, data) {
  const body = JSON.stringify(data);
  const opts = { hostname: 'localhost', port: 4000, path, method: 'POST', headers: { 'Content-Type': 'application/json' } };
  return new Promise((resolve, reject) => {
    const req = http.request(opts, (res) => {
      let buf = '';
      res.on('data', (c) => buf += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(buf || '{}') }); } catch (e) { resolve({ status: res.statusCode, body: buf }); } });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}
(async () => {
  try {
    const r = await post('/api/auth/login', { username: 'supervisor01', password: 'pass123' });
    console.log('Status', r.status, 'Body', r.body);
  } catch (e) { console.error('Error', e); process.exit(1); }
})();
