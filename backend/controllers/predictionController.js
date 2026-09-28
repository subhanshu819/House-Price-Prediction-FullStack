const Prediction = require('../models/Prediction');

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000/predict';

// The 8 house features required by the Random Forest model
const REQUIRED_FEATURES = [
  'MedInc',
  'HouseAge',
  'AveRooms',
  'AveBedrms',
  'Population',
  'AveOccup',
  'Latitude',
  'Longitude',
];

// Support exact names and common camelCase aliases
const FEATURE_ALIASES = {
  MedInc: ['MedInc', 'medInc', 'medianIncome', 'medinc'],
  HouseAge: ['HouseAge', 'houseAge', 'housingMedianAge', 'houseage'],
  AveRooms: ['AveRooms', 'aveRooms', 'avgRooms', 'averooms'],
  AveBedrms: ['AveBedrms', 'aveBedrms', 'avgBedrooms', 'avebedrms'],
  Population: ['Population', 'population'],
  AveOccup: ['AveOccup', 'aveOccup', 'avgOccupancy', 'aveoccup'],
  Latitude: ['Latitude', 'latitude', 'lat'],
  Longitude: ['Longitude', 'longitude', 'lon', 'lng'],
};

/**
 * Controller to handle house price prediction requests.
 * Validates 8 input features, sends them to the ML FastAPI service,
 * and returns the prediction response.
 */
const predictHousePrice = async (req, res) => {
  const body = req.body || {};
  const inputPayload = {};
  const missingFeatures = [];

  // Validate that all 8 features are present and numeric
  for (const feature of REQUIRED_FEATURES) {
    const aliases = FEATURE_ALIASES[feature] || [feature];
    const matchedKey = aliases.find(
      (alias) => body[alias] !== undefined && body[alias] !== null && body[alias] !== ''
    );

    if (!matchedKey) {
      missingFeatures.push(feature);
      continue;
    }

    const numericValue = Number(body[matchedKey]);
    if (!Number.isFinite(numericValue)) {
      missingFeatures.push(`${feature} (must be a valid number)`);
      continue;
    }

    inputPayload[feature] = numericValue;
  }

  if (missingFeatures.length > 0) {
    return res.status(400).json({
      message: 'Validation failed: all 8 house features must be provided as valid numbers',
      missingFeatures,
    });
  }

  try {
    const mlResponse = await fetch(ML_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputPayload),
    });

    const responseData = await mlResponse.json().catch(() => ({}));

    console.error('ML API Debug:', {
      ML_API_URL,
      status: mlResponse.status,
      responseData,
    });

    if (!mlResponse.ok) {
      return res.status(mlResponse.status || 502).json({
        message: 'Prediction service returned an error',
        error: responseData.detail || responseData.message || 'Unknown ML API error',
      });
    }

    // Persist prediction to MongoDB
    try {
      await Prediction.create({
        user: req.user.id,
        MedInc: inputPayload.MedInc,
        HouseAge: inputPayload.HouseAge,
        AveRooms: inputPayload.AveRooms,
        AveBedrms: inputPayload.AveBedrms,
        Population: inputPayload.Population,
        AveOccup: inputPayload.AveOccup,
        Latitude: inputPayload.Latitude,
        Longitude: inputPayload.Longitude,
        usdPrice: responseData.usd_price,
      });
    } catch (dbErr) {
      console.error('[PredictionController] Failed to save prediction to DB:', dbErr.message);
    }

    return res.status(200).json(responseData);
  } catch (error) {
    return res.status(503).json({
      message: 'Unable to connect to ML prediction service',
      error: error.message,
    });
  }
};

module.exports = {
  predictHousePrice,
  predictPrice: predictHousePrice,
};
