const router = require("express").Router()

router.get("/", (req,res)=>{
  res.json({msg:"AUTH OK"})
})

module.exports = router
