const { generateToken04 } = require("../utils/zegoToken");

// Issue a Zego Token04 for the authenticated user
exports.issueToken = (req, res) => {
  try {
    // Debug: log environment variables
    console.log("ZEGO_APP_ID from env:", process.env.ZEGO_APP_ID);
    console.log("ZEGO_SERVER_SECRET length:", process.env.ZEGO_SERVER_SECRET?.length);
    
    const appId = parseInt(process.env.ZEGO_APP_ID, 10);
    const serverSecret = process.env.ZEGO_SERVER_SECRET;
    const effectiveTimeInSeconds = Number(process.env.ZEGO_TOKEN_TTL || 3600); // 1 hour default
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    if (!appId || Number.isNaN(appId)) {
      console.error("APP_ID validation failed - Raw:", process.env.ZEGO_APP_ID, "Parsed:", appId);
      return res.status(500).json({ message: "ZEGO_APP_ID is missing/invalid" });
    }
    if (!serverSecret || serverSecret.length !== 32) {
      return res.status(500).json({ message: "ZEGO_SERVER_SECRET must be a 32-byte string" });
    }

    const token = generateToken04(appId, String(userId), serverSecret, effectiveTimeInSeconds);
    return res.json({
      token,
      appId,
      userId: String(userId),
      expiresIn: effectiveTimeInSeconds,
    });
  } catch (error) {
    console.error("Zego token error:", error);
    return res.status(500).json({ message: "Failed to generate token", error });
  }
};

