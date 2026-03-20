const router = require("express").Router()

let users = []

router.post("/register", (req,res)=>{
  const {email, password} = req.body

  users.push({email, password, balance: 0})

  res.json({msg:"Ro‘yxatdan o‘tildi"})
})

router.post("/login", (req,res)=>{
  const {email, password} = req.body

  let user = users.find(u=>u.email===email && u.password===password)

  if(!user){
    return res.json({msg:"Xato login"})
  }

  res.json({msg:"Kirish OK", user})
})

router.get("/", (req,res)=>{
  res.json({msg:"AUTH OK"})
})

module.exports = router
