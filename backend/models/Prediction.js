const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  MedInc: {
    type: Number,
    required: true,
  },
  HouseAge: {
    type: Number,
    required: true,
  },
  AveRooms: {
    type: Number,
    required: true,
  },
  AveBedrms: {
    type: Number,
    required: true,
  },
  Population: {
    type: Number,
    required: true,
  },
  AveOccup: {
    type: Number,
    required: true,
  },
  Latitude: {
    type: Number,
    required: true,
  },
  Longitude: {
    type: Number,
    required: true,
  },
  usdPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Prediction = mongoose.model('Prediction', predictionSchema);

module.exports = Prediction;
