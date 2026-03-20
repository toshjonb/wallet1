const router = require("express").Router()

router.get("/", (req,res)=>{
  res.json({msg:"WALLET OK"})
})

module.exports = router
