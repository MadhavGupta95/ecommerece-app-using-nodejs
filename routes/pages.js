import path from "node:path";
import express, { Router } from "express";

const router = express.Router();

router.get("/", (req, res) => {
  const filePath = path.join(path.resolve(), "pages", "website.html");
  return res.sendFile(filePath);
});

router.get("/signup", (req, res) => {
    const filePath = path.join(path.resolve(), "pages", "signup.html");
    return res.sendFile(filePath);
  });

router.get('/login', (req, res)=>{
    const filePath = path.join(path.resolve(), "pages", "login.html")
    return res.sendFile(filePath)
})

router.get("/dashboard", (req, res)=>{
  const filePath = path.join(path.resolve(), "pages", "dashboard.html")
  return res.sendFile(filePath)
})


export default router;
