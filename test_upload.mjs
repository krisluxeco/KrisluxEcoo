import fs from 'fs';

async function run() {
  const form = new FormData();
  form.append('name', 'Test Upload User');
  form.append('email', 'test@test.com');
  form.append('description', 'Test Description');
  
  // Attach a dummy file (Node 20+ fetch uses standard File/Blob)
  const blob = new Blob(['hello world'], { type: 'text/plain' });
  form.append('image', blob, 'test.txt');

  const res = await fetch('http://localhost:3000/api/user/custom-design', {
    method: 'POST',
    body: form
  });

  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);
}
run();
