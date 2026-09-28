const Prediction = require('../models/Prediction');

/**
 * Controller to retrieve the prediction history for the logged-in user.
 * Fetches all Prediction documents belonging to req.user.id,
 * sorted by createdAt descending (newest first).
 */
const getPredictionHistory = async (req, res) => {
  try {
    const predictions = await Prediction.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    return res.status(200).json(predictions);
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to retrieve prediction history',
      error: error.message,
    });
  }
};

const deletePrediction = async (req, res) => {
  try {
    const prediction = await Prediction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!prediction) {
      return res.status(404).json({
        message: 'Prediction not found',
      });
    }

    return res.status(200).json({
      message: 'Prediction deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete prediction',
      error: error.message,
    });
  }
};

module.exports = {
  getPredictionHistory,
  deletePrediction,
};
