import express from "express";
import { PrismaClient } from "@prisma/client";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const prisma = new PrismaClient();

// create new review
app.post("/review", async (req, res) => {
    try {
        const { movieName, review } = req.body;
        const reviewItem = await prisma.review.create({
        data: {
            movieName, 
            review
        },
        });
        res.json(reviewItem);
    } catch (error) {
        console.error("Failed to create review:", error);
        res.status(500).json({ error: "Internal server error" });
    };
});

// get reviews
app.get("/reviews", async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: {
                updatedAt: 'desc'
            }
        });
        res.json(reviews);
    } catch {
        console.error("Failed to get reviews:", error);
        res.status(500).json({ error: "Internal server error" })       
    }
});

// updates a review by id
app.put("/review/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { review } = req.body;   
    const reviewItem = await prisma.review.update({
      where : {
        id: id,
      },
      data: {
        review: review,  
      },
    });
    res.json(reviewItem);
  });

// deletes a review by id
app.delete("/review/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);   
    const review = await prisma.review.delete({
      where: {
        id: id,
      },
    });
    res.json(review);
  });

app.listen(8000, () => {
    console.log("Server running on http://localhost:8000 🎉 🚀");
  });