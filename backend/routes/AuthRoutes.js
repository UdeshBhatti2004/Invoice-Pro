import express from "express"
import { Signup,Login,getProfile,updateProfile } from "../controllers/AuthControllers.js"
import authMiddlware from "../middleware/AuthMiddleware.js"

const router = express.Router()

router.post("/signup",Signup)
router.post("/login",Login)
router.get("/profile",authMiddlware,getProfile)
router.put("/profile", authMiddlware, updateProfile);


export default router