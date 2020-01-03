const express = require("express");
const router = express.Router();
const roomsController = require("../controllers/room");
const upload = require("../multer");
const authGaurd = require("../util/authGaurd");

router.get("/:hotelId", roomsController.getAllRooms);
router.post(
  "/:hotelId",
  upload.array("image"),
  authGaurd,
  roomsController.AddNewRoom
);
router.get("/:id/room", roomsController.getAroom);
router.delete("/:id", authGaurd, roomsController.deleteRoom);
router.put("/:id", authGaurd, roomsController.updateRoom);

module.exports = router;
