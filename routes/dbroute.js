import path from "node:path";
import express, { Router } from "express";
import fs from "fs/promises";
import { isAuthorized } from "../middleware/middleware.js";

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
router.get("/everything", isAuthorized, async (req, res) => {
  try {
    const { limit } = req.query;
    const product = await fs.readFile("./db/material.json", "utf-8");
    const parsedProduct = JSON.parse(product);
    if (!limit) {
      return res.status(200).json({
        data: parsedProduct,
        success: true,
      });
    }
    if (isNaN(limit)) {
      return res.status(400).json({
        message: "Cannot be a character",
        success: false,
      });
    }
    if (limit <= 0) {
      return res.status(400).json({
        message: "Invalid",
        success: false,
      });
    }
    const limitedProducts = parsedProduct.slice(0, limit);
    return res.status(200).json({
      data: limitedProducts,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Error in shraddha",
      success: false,
    });
  }
});

router.get("/products", isAuthorized, async (req, res) => {
  try {
    const { search } = req.query;
    const product = await fs.readFile("./db/material.json", "utf-8");
    const parsedProduct = JSON.parse(product);
    if (!search) {
      return res.json({
        data: parsedProduct,
        success: true,
      });
    }
    const filterProducts = parsedProduct.filter(
      (product) =>
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase())
    );

    if(filterProducts.length===0){
        return res.status(404).json({
            message : "No product of this name exists",
            success : false
        })
    }

    return res.json({
      data: filterProducts,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Error in products",
      success: false,
    });
  }
});

export default router;
