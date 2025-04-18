import express from 'express'
const app = express()
const user = 'madhav'
import authRoutes from './routes/auth.js'
import pageRoutes from './routes/pages.js'
import dashboardRoutes from './routes/dashboard.js'
import dbRoutes from './routes/dbroute.js'

const PORT = 5050
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/", pageRoutes)
app.use("/api", dashboardRoutes)
app.use("/db", dbRoutes)

app.listen(PORT,()=>{
    console.log( `hello ${user}, your server is running on port ${PORT}`)
})

