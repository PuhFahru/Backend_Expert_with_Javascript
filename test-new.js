import express from 'express';

const app = express();
app.use(express.json());

app.get('/test/:id', (req, res) => {
  process.stdout.write(`NEW TEST SERVER: id=${  req.params.id  }\n`);
  res.json({ new: true, id: req.params.id });
});

app.listen(5006, () => {
  process.stdout.write('New server on 5006\n');

  import('http').then((http) => {
    const req = http.request('http://localhost:5006/test/abc123', (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        process.stdout.write(`Result: ${  data  }\n`);
        process.exit(0);
      });
    });
    req.end();
  });
});
