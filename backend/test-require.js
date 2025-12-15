const db = require('./middlewares/dbMiddleware');
const auth = require('./middlewares/authMiddleware');
console.log('db:', Object.keys(db));
console.log('auth:', Object.keys(auth));
console.log('db === auth?', db === auth);