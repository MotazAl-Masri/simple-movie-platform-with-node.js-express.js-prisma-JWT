const router = require("express").Router();
const { redisTest } = require("../controllers/redisController");

router.get("/test", redisTest);

module.exports = router;
