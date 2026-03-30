const jwt = require("jsonwebtoken");

const prisma = require("../generated/prisma");

const db = new prisma.PrismaClient();

//read the token from request header and verify it
const authMiddleware = async (req, res, next) => {
  console.log("Auth middleware called");
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token provided",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      return res.status(401).json({
        message: "user not found!!!",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

module.exports = {
  authMiddleware,
};
