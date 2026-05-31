import http from 'http';

const req = http.request('http://localhost:5000/threads/thread-test-123/comments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpY29kaW5ndGVzdCIsImlkIjoidXNlci10dWxxdFJQMHdXYlE1NWd5OWxVMWsiLCJpYXQiOjE3Nzg3NTg2MjV9.BYRhnTGgrWcbxmbHikcUs_gjdepFH3msMnPfP8yBnZE'
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Response status:', res.statusCode);
    console.log('Response body:', data);
  });
});

req.write(JSON.stringify({ content: 'test comment' }));
req.end();
