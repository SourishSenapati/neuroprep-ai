import app from '../server.js';

export default async (req, res) => {
  return new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) {
        console.error('Handler error:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

