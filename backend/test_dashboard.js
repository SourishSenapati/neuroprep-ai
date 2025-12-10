import fetch from 'node-fetch';

async function test() {
  try {
    const userId = 'user_' + Date.now();
    console.log('Testing with userId:', userId);
    const res = await fetch(`http://localhost:5000/api/dashboard?userId=${userId}`);
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Body:', text);
  } catch (e) {
    console.error(e);
  }
}

test();
