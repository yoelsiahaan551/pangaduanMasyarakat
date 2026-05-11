import express from "express"

const router = express.Router()

// GET ALL COMMENTS
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Data comments"
  })
})

export default router