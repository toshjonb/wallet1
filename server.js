const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())

// 🔥 JSON parser (POST requestlar uchun kerak)
app.use(express.json())

// 🔥 STATIC FILES (frontend uchun)
app.use(express.static("public"))

// ROUTES
app.use("/auth", require("./routes/auth"))
app.use("/wallet", require("./routes/wallet"))
app.use("/admin", require("./routes/admin"))

app.get("/", (req,res)=>{
  res.send("SMART HAMYON ISHLAYAPTI 🚀")
})

app.listen(3000, ()=>{
  console.log("SERVER RUNNING 3000")
})
