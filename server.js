const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

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
