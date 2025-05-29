require("dotenv").config();
const Product = require("../models/Product");

const getSuggestions = async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Thiếu query yêu cầu" });
  }

  const lowerMsg = query.toLowerCase();

  // Xử lý xã giao
  if (["cảm ơn", "thank", "thanks"].some((word) => lowerMsg.includes(word))) {
    return res.json({ reply: "Không có gì, rất vui được giúp bạn!" });
  }

  if (
    ["chào", "hi", "hello", "xin chào"].some((word) => lowerMsg.includes(word))
  ) {
    return res.json({
      reply: "Xin chào! Tôi là trợ lí ảo PetID+. Bạn cần tôi giúp gì không?",
      products: [],
    });
  }

  try {
    const products = await Product.find({});

    if (products.length === 0) {
      return res.json({
        reply:
          "Xin lỗi, tôi chưa tìm thấy sản phẩm phù hợp với yêu cầu của bạn.",
        products: [],
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

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Danh sách sản phẩm hiện có:
${productList}

Khách hàng hỏi: "${query}"

Dựa trên danh sách, hãy đưa ra phản hồi phù hợp và gợi ý các sản phẩm liên quan (nếu có). 
Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp.
Nếu không có sản phẩm phù hợp, hãy nói rõ không có sản phẩm phù hợp.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text =
      result.response.text() || "Xin lỗi, tôi chưa có câu trả lời phù hợp.";

    // Tìm sản phẩm phù hợp dựa trên query
    const matchedProducts = await findMatchingProducts(query, products);

    return res.json({
      reply: text,
      products: matchedProducts,
    });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Lỗi khi gọi AI" });
  }
};

async function findMatchingProducts(query, products) {
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const productList = products.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      tags: p.tags,
    }));

    const prompt = `
Danh sách sản phẩm:
${JSON.stringify(productList)}

Tìm các sản phẩm phù hợp với câu hỏi: "${query}"

Trả về một mảng JSON chứa ID của các sản phẩm phù hợp nhất, tối đa 3 sản phẩm.
Chỉ trả về mảng JSON, không có bất kỳ văn bản nào khác.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const responseText = result.response.text();
    const matchedIds = JSON.parse(responseText);

    return products.filter((p) => matchedIds.includes(p._id.toString()));
  } catch (error) {
    console.error("Error finding matching products:", error);
    return [];
  }
}

module.exports = {
  getSuggestions,
};
