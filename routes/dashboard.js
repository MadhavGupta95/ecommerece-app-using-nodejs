import express from "express";
import { isAuthorized } from "../middleware/middleware.js";
import { v4 as uuidV4 } from "uuid";
import fs from "fs/promises";
const router = express.Router();

// create the product div
router.post("/dashboard", isAuthorized, async (req, res) => {
  try {
    const { user } = req;
    if (!user || !user.id) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const { title, price, description, category, rating } = req.body;
    if (!title || !price || !description || !category || !rating) {
      return res.status(400).json({
        message: "Please provide all the details",
        success: false,
      });
    }
    const product = {
      id: uuidV4(),
      title,
      price,
      description,
      category,
      rating,
      userID: user.id,
    };
    const products = await fs.readFile("./db/material.json", "utf-8");
    const parsedProducts = JSON.parse(products);
    parsedProducts.push(product);
    await fs.writeFile("./db/material.json", JSON.stringify(parsedProducts));

    return res.json({
      data: product,
      message: "Product added successfully",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Error in creating product",
      success: false,
    });
  }
});

// get the data
router.get("/dashboard", isAuthorized, async (req, res) => {
  try {
    const {user} = req
    const items = await fs.readFile('./db/material.json', 'utf-8')
    const parsedData = JSON.parse(items);
    return res.json({
      data : parsedData.filter((data)=>data.userID === user.id),
      success : true
    })
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "error in fetching data",
      success: false,
    });
  }
});

// update the prodcut details
router.patch("/dashboard/:id", isAuthorized, async (req, res) => {
  try {
    const { user } = req;
    const { title, price, description, category, rating } = req.body;
    const { id: productId } = req.params;
    const product = await fs.readFile("./db/material.json", "utf-8");
    const parsedProducts = JSON.parse(product);
    const prod = parsedProducts.find((pro) => pro.id === productId);
    // check if product exists
    if (!prod) {
      return res.status(404).json({
        message: "No product found",
        success: false,
      });
    }

    // check if product belongs to user
    if (prod.userID !== user.id) {
      return res.status(401).json({
        message: "Unauthorized user",
        success: false,
      });
    }

    // everything good, update the product
    if (prod.title !== undefined) {
      (prod.title = title), (prod.price = price);
      prod.description = description;
      prod.category = category;
      prod.rating = rating;
    }

    await fs.writeFile("./db/material.json", JSON.stringify(parsedProducts));

    return res.json({
      data: prod,
      success: true,
      message: "product details updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Error in editing part",
      success: false,
    });
  }
});

// delete a product

router.delete("/dashboard/:id", isAuthorized, async (req, res) => {
  try {
    const { user } = req;
    const { title, price, description, category, rating } = req.body;
    const { id: productId } = req.params;

    // check if product exists
    const product = await fs.readFile("./db/material.json", "utf-8");
    const parsedProducts = JSON.parse(product);
    const prod = parsedProducts.find((pro) => pro.id === productId);
    // check if product exists
    if (!prod) {
      return res.status(404).json({
        message: "No product found",
        success: false,
      });
    }

    // check if product belongs to user
    if (prod.userID !== user.id) {
      return res.status(401).json({
        message: "Unauthorized user",
        success: false,
      });
    }

    // everything cool
    const productIndex = parsedProducts.findIndex(
      (product) => product.id === productId
    );

    parsedProducts.splice(productIndex, 1)[0];
    await fs.writeFile("./db/material.json", JSON.stringify(parsedProducts));

    return res.json({
      data: prod,
      success: true,
      message: "product deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Error in editing part",
      success: false,
    });
  }
});
export default router;
