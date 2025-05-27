const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Text-based chat
router.post("/message", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const lowerMsg = query.toLowerCase();

  // Handle greetings
  if (["cảm ơn", "thank", "thanks"].some((word) => lowerMsg.includes(word))) {
    return res.json({ reply: "Không có gì, rất vui được giúp bạn!" });
  }

  if (
    ["chào", "hi", "hello", "xin chào"].some((word) => lowerMsg.includes(word))
  ) {
    return res.json({ reply: "Chào bạn! Bạn đang cần tìm sản phẩm gì ạ?" });
  }

  try {
    // Get products from database
    const products = await Product.find({});

    if (products.length === 0) {
      return res.json({
        reply: "Xin lỗi, hiện chưa có sản phẩm nào trong hệ thống.",
      });
    }

    const productList = products
      .map(
        (p) =>
          `- ${p.name}, giá: ${p.price}₫, ${
            p.tags ? `loại: ${p.tags.join(", ")},` : ""
          } mô tả: ${p.description}`
      )
      .join("\n");

    // Import the Google generative AI library
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Danh sách sản phẩm hiện có:
${productList}

Khách hàng hỏi: "${query}"

Hãy trả lời một cách thân thiện và hữu ích dựa trên danh sách sản phẩm trên. Nếu không có sản phẩm phù hợp, hãy trả lời lịch sự rằng không tìm thấy sản phẩm phù hợp.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const text = result.response.text();

    return res.json({ reply: text });
  } catch (error) {
    console.error("Error in chatbot:", error);
    res.status(500).json({ error: "Lỗi khi xử lý yêu cầu" });
  }
});

module.exports = router;
