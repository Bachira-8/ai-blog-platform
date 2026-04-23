const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post("/create", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.json({ message: "Blog Created", blog });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/single/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Blog Updated" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/user/:authorId", async (req, res) => {
  try {
    const blogs = await Blog.find({
      authorId: req.params.authorId
    }).sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/seo", (req, res) => {
  const { title, content } = req.body;

  let score = 0;

  if (title && title.length >= 10) score += 30;
  if (content && content.length >= 300) score += 40;
  if (content && content.includes("\n")) score += 20;
  if (title && content &&
      content.toLowerCase().includes(title.split(" ")[0].toLowerCase()))
    score += 10;

  res.json({
    score,
    message: `SEO Score: ${score}/100`
  });
});

router.post("/generate", async (req, res) => {
  try {
    const { topic } = req.body;

    const chat = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Write a clean, beginner-friendly blog about ${topic}.

          Rules:
          - Use simple English
          - Add clear headings
          - Use short paragraphs
          - Add bullet points where useful
          - Keep it readable for students
          - Do NOT use markdown symbols like ** or *
          - Format like a professional blog article

          Sections:
          1. Introduction
          2. Benefits
          3. Conclusion`
        }
      ],
      model: "llama-3.3-70b-versatile"
    });

    res.json({
      content: chat.choices[0].message.content
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Groq failed" });
  }
});

router.get("/stats/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const blogs = await Blog.find({ authorId: userId });

    const totalBlogs = blogs.length;

    let totalSeo = 0;

    blogs.forEach((blog) => {
      totalSeo += blog.seoScore || 0;
    });

    const avgSeo =
      totalBlogs > 0
        ? Math.round(totalSeo / totalBlogs)
        : 0;

    res.json({
      totalBlogs,
      avgSeo
    });

  } catch (error) {
    res.status(500).json({
      message: "Stats failed"
    });
  }
});


module.exports = router;