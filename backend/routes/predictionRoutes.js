const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const { predictHousePrice } = require('../controllers/predictionController');
const {
  getPredictionHistory,
  deletePrediction,
} = require('../controllers/predictionHistoryController');

const router = express.Router();

// POST /predict - Protected with authenticateToken
router.post('/predict', authenticateToken, predictHousePrice);

// GET /history - Protected with authenticateToken
router.get('/history', authenticateToken, getPredictionHistory);

// DELETE /history/:id - Protected with authenticateToken
router.delete('/history/:id', authenticateToken, deletePrediction);

module.exports = router;
