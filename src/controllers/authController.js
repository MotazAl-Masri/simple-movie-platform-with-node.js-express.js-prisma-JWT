const { db } = require("../config/DB.js");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utlis/generateToken.js");
const { notificationQueue } = require("../queues/notificationQueue.js"); // تأكد من المسار

const {
  validateUserRegistration,
  validateUserLogin,
} = require("../models/User.js");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 2. Check existence
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", status: "400 Bad Request" });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. DB Transaction (يفضل استخدام Prisma Transaction لو عندك عمليات معقدة)
    const newUser = await db.user.create({
      data: { name, email, password: hashedPassword },
    });

    // 5. JWT
    const token = generateToken(newUser.id, res);

    // 6. BullMQ - نصيحة: لا تستخدم await هنا إذا كنت لا تهتم بانتظار Redis
    // أو تأكد أن Redis متصل 100%. الـ await هنا هي سبب الـ "Sending Request" العالق.
    notificationQueue
      .add("sendNotification", {
        userId: newUser.id,
        email: newUser.email,
      })
      .catch((err) => console.error("Redis/BullMQ Error:", err));

    return res.status(201).json({
      message: "User registered successfully",
      data: { id: newUser.id, name: newUser.name, email: newUser.email, token },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id, res);

    return res.status(200).json({
      // الـ Login يفضل 200 وليس 201
      message: "User logged in successfully",
      data: { id: user.id, email: user.email, token },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("jwt");
  return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { registerUser, loginUser, logoutUser };
