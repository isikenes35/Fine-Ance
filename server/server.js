require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\n  🚀 Fine-ance API sunucusu çalışıyor: http://localhost:${PORT}\n`);
});
