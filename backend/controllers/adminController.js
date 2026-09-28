const User = require('../models/User');
const Prediction = require('../models/Prediction');

/**
 * Controller to fetch comprehensive, real-time administrative statistics,
 * user metrics, prediction activity, and ML inference service health.
 */
const getAdminDashboardData = async (req, res) => {
  try {
    // 1. Total counts from MongoDB
    const [totalUsers, totalPredictions] = await Promise.all([
      User.countDocuments(),
      Prediction.countDocuments(),
    ]);

    // 2. Identify the most active user by prediction volume
    const mostActiveAgg = await Prediction.aggregate([
      { $group: { _id: '$user', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    let mostActiveUser = null;
    if (mostActiveAgg.length > 0 && mostActiveAgg[0]._id) {
      const activeUserDoc = await User.findById(mostActiveAgg[0]._id).select('name email role');
      if (activeUserDoc) {
        mostActiveUser = {
          id: activeUserDoc._id,
          name: activeUserDoc.name,
          email: activeUserDoc.email,
          role: activeUserDoc.role,
          predictionsCount: mostActiveAgg[0].count,
        };
      }
    }

    // 3. Probe real ML FastAPI health endpoint
    const rawMlUrl = process.env.ML_API_URL || 'http://localhost:8000/predict';
    let mlHealthUrl = 'http://localhost:8000/health';
    try {
      const parsedUrl = new URL(rawMlUrl);
      mlHealthUrl = `${parsedUrl.protocol}//${parsedUrl.host}/health`;
    } catch {
      mlHealthUrl = 'http://localhost:8000/health';
    }

    let mlStatus = {
      status: 'offline',
      modelLoaded: false,
      latencyMs: null,
      serviceName: 'FastAPI ML Inference Service',
    };

    try {
      const start = performance.now();
      const mlRes = await fetch(mlHealthUrl, { signal: AbortSignal.timeout(3000) });
      const latencyMs = Math.round(performance.now() - start);

      if (mlRes.ok) {
        const mlData = await mlRes.json().catch(() => ({}));
        mlStatus = {
          status: mlData.status === 'healthy' ? 'healthy' : 'online',
          modelLoaded: !!mlData.model_loaded,
          latencyMs,
          serviceName: 'FastAPI ML Inference Service',
        };
      } else {
        mlStatus = {
          status: 'degraded',
          modelLoaded: false,
          latencyMs,
          serviceName: 'FastAPI ML Inference Service',
        };
      }
    } catch (mlErr) {
      mlStatus = {
        status: 'offline',
        modelLoaded: false,
        latencyMs: null,
        error: mlErr.message,
        serviceName: 'FastAPI ML Inference Service',
      };
    }

    // 4. Query all users and their individual prediction counts
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Aggregate prediction counts grouped by user
    const userPredictionCounts = await Prediction.aggregate([
      { $group: { _id: '$user', count: { $sum: 1 } } },
    ]);
    const countsMap = {};
    userPredictionCounts.forEach((item) => {
      if (item._id) {
        countsMap[item._id.toString()] = item.count;
      }
    });

    const mappedUsers = users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      predictionsCount: countsMap[u._id.toString()] || 0,
      createdAt: u.createdAt,
    }));

    // 5. Query recent real prediction activities with user details
    const recentPredictions = await Prediction.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentActivity = recentPredictions.map((p) => {
      const lat = p.Latitude != null ? Number(p.Latitude).toFixed(2) : '—';
      const lng = p.Longitude != null ? Number(p.Longitude).toFixed(2) : '—';
      const priceFormatted =
        p.usdPrice != null
          ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            }).format(p.usdPrice)
          : '—';

      return {
        id: p._id,
        userName: p.user?.name || 'Registered User',
        userEmail: p.user?.email || 'N/A',
        action: `Evaluated property at ${lat}°, ${lng}° → ${priceFormatted}`,
        usdPrice: p.usdPrice,
        createdAt: p.createdAt,
        type: 'prediction',
      };
    });

    // 6. Real ML Model Specifications
    const modelInfo = {
      name: 'Random Forest Regressor',
      architecture: 'RandomForestRegressor (scikit-learn)',
      r2Score: '0.806',
      r2Description: 'Approximately 0.806 variance explained on test split',
      dataset: 'California Housing',
      datasetRecords: 20640,
      featuresCount: 8,
      features: [
        'MedInc',
        'HouseAge',
        'AveRooms',
        'AveBedrms',
        'Population',
        'AveOccup',
        'Latitude',
        'Longitude',
      ],
    };

    return res.status(200).json({
      status: 'success',
      stats: {
        totalUsers,
        totalPredictions,
        mostActiveUser,
        mlStatus,
      },
      modelInfo,
      users: mappedUsers,
      recentActivity,
    });
  } catch (error) {
    console.error('[AdminController] Error fetching admin dashboard data:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve administrative data',
      error: error.message,
    });
  }
};

module.exports = {
  getAdminDashboardData,
};
