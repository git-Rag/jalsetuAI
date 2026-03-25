const express = require('express');
const cors = require('cors');
require('dotenv').config();
const villagesRouter = require('./routes/villages');
const groundwaterRouter = require('./routes/groundwater');
const predictionRouter = require('./routes/prediction');
const aiRouter = require('./routes/ai');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/villages', villagesRouter);
app.use('/api/groundwater', groundwaterRouter);
app.use('/api/predictions', predictionRouter);
app.use('/api/ai', aiRouter);

app.get('/api/village-data', (req, res) => {
  const location = req.query.location || 'Sehore';
  const payload = {
    village: location,
    waterLevel: 'Moderate',
    risk: 'Medium',
    recommendation: 'Reduce irrigation usage; improve groundwater recharge with check dams',
    trendInsight: 'Groundwater levels are declining over the past 3 months.',
    tankerPrediction: 'Likely need: 2–3 tankers/week if no rainfall.',
    suggestedActions: ['Reduce irrigation usage', 'Promote rainwater harvesting', 'Repair local water infrastructure'],
    aiSummary: 'Local groundwater is under stress, and proactive conservation with infrastructure repair is recommended.',
  };

  setTimeout(() => {
    res.json(payload);
  }, 350);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', pilot: 'JalSetu AI', date: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 65535;
app.listen(PORT, () => {
  console.log(`JalSetu AI backend running on port ${PORT}`);
});
