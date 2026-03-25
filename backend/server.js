const express = require('express');
const cors = require('cors');
require('dotenv').config();
const villagesRouter = require('./routes/villages');
const groundwaterRouter = require('./routes/groundwater');
const predictionRouter = require('./routes/prediction');
const aiRouter = require('./routes/ai');
const villageDataRouter = require('./routes/village');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/villages', villagesRouter);
app.use('/api/groundwater', groundwaterRouter);
app.use('/api/predictions', predictionRouter);
app.use('/api/ai', aiRouter);
app.use('/api', villageDataRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', pilot: 'JalSetu AI', date: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`JalSetu AI backend running on port ${PORT}`);
});
