import path from "node:path"
import express, {Router} from 'express'

const router = express.Router()

router.get("/", (req, res)=>{
    const filePath = path.join(path.resolve(), "pages" , "website.html")
    return res.sendFile(filePath)
})

export default router