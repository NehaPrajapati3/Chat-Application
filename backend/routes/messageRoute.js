import express from "express";
import { getMessage, sendMessage } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

router
  .route("/send/:id")
  .post(
    isAuthenticated,
    upload.fields([{ name: "file", maxCount: 1 }]),
    sendMessage
  );
router.route("/:id").get(isAuthenticated, getMessage);

export default router;