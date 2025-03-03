import express from 'express'
const app = express()
const user = 'madhav'
import authRoutes from './routes/auth.js'
import pageRoutes from './routes/pages.js'

const PORT = 5050
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/", pageRoutes)

app.listen(PORT,()=>{
    console.log( `hello ${user}, your server is running on port ${PORT}`)
})

