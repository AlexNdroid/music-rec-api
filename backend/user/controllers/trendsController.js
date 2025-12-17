const Recommendation = require("../models/Recommendation");

//================== Obtener tendencias =================
const getTrending = async (req, res) => {
  try {
    const days = 7;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const trends = await Recommendation.aggregate([
      { $match: { createdAt: { $gte: fromDate } } },

      {
        $project: {
          _id: 1,              // 👈 ID REAL
          title: 1,
          artist: 1,
          likesCount: { $size: "$likes" },
          recommendations: { $literal: 1 }, // cada doc cuenta como 1
          createdAt: 1
        }
      },

      {
        $addFields: {
          trendScore: {
            $add: [
              { $multiply: ["$likesCount", 5] },
              { $multiply: ["$recommendations", 2] }
            ]
          }
        }
      },

      { $sort: { trendScore: -1, createdAt: -1 } },
      { $limit: 10 }
    ]);

    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo tendencias" });
  }
};


module.exports = {
  getTrending
}