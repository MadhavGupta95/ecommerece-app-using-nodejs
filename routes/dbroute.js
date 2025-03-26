import path from "node:path";
import express, { Router } from "express";
import fs from 'fs/promises'

const router = express.Router();

// router.get('/shraddha', async(req,res)=>{
//     try {
//         const filePath = path.join(path.resolve(), "db", "material.json");
//         const result = await fs.readFile(filePath, 'utf-8');
//         // console.log(typeof(result));
//         const parsedResult = JSON.parse(result)
//         return res.json(parsedResult)
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).json({
//             message : "Error in shraddha",
//             success : false
//         })
//     }
// })

// set limit
router.get("/shraddha", async(req,res)=>{
    try {
        const {limit} = req.query
        const product = await fs.readFile("./db/material.json", 'utf-8')
        const parsedProduct = JSON.parse(product)
        if(!limit){
            return res.status(200).json({
                data: parsedProduct,
                success: true
            });
        }
        if(isNaN(limit)){
            return res.status(400).json({
                message : "Cannot be a character",
                success : false
            })
        }
        if(limit<=0){
            return res.status(400).json({
                message : "Invalid",
                success : false
            })
        }
        const limitedProducts = parsedProduct.slice(0, limit);
        return res.status(200).json({
            data: limitedProducts,
            success: true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message : "Error in shraddha",
            success : false
        })
    }

})

// define everything CRED (CReate, Edit, Delete)




export default router;
