const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/admin");
const authGaurd = require("../util/authGaurd");
const adminAuth = require("../util/adminAuth");
const ccAuth = require("../util/ccAuth");

router.post("/createAdmin", adminControllers.createAdmin);
router.post('/createAcct', adminControllers.createAcct);
router.post('/acctLogin', adminControllers.acctLogin)
router.post("/cc", adminControllers.createCC);
router.post("/cclogin", adminControllers.ccLogin);
router.post("/adminLogin", adminControllers.adminLogin);
router.get("/", authGaurd, adminAuth, adminControllers.getAuthUser);
router.get("/ccAuth", authGaurd, ccAuth, adminControllers.getAuthCCUser);
router.get("/getUsers", authGaurd, adminAuth, adminControllers.getAllUsers);
router.delete(
  "/deleteUser/:id",
  authGaurd,
  adminAuth,
  adminControllers.deleteUser
);
router.get("/getAllHotels", authGaurd, adminAuth, adminControllers.getAllHotel);
router.get("/:id", authGaurd, adminAuth, adminControllers.getAHotel);
router.delete(
  "/deleteHotel/:id",
  authGaurd,
  adminAuth,
  adminControllers.deleteHotel
);
router.put("/approve/:id", authGaurd, adminAuth, adminControllers.ApproveHotel);
router.put("/suspend/:id", authGaurd, adminAuth, adminControllers.suspendHotel);
router.put("/addVR/:id", authGaurd, adminAuth, adminControllers.addvrtour);

module.exports = router;
