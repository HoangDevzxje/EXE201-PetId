require("dotenv").config();
const Product = require("../models/Product");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const getSuggestions = async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Thiếu hoặc sai định dạng query." });
  }

  const lowerMsg = query.toLowerCase();

  // Xử lý câu xã giao
  if (["cảm ơn", "thank", "thanks"].some((word) => lowerMsg.includes(word))) {
    return res.json({
      reply: "Không có gì đâu, rất vui được giúp bạn và bé cưng 🐶🐱!",
      products: [],
    });
  }

  if (
    ["chào", "hi", "hello", "xin chào"].some((word) => lowerMsg.includes(word))
  ) {
    return res.json({
      reply:
        "Xin chào! Mình là trợ lý ảo PetID+ 🤖. Bạn đang cần tìm sản phẩm gì cho thú cưng vậy nè?",
      products: [],
    });
  }

  try {
    const products = await Product.find({ isActive: true });

    if (!products.length) {
      return res.json({
        reply: "Hiện tại chưa có sản phẩm nào để gợi ý rồi bạn ơi 😢.",
        products: [],
      });
    }

    // Chuẩn bị danh sách sản phẩm gọn gàng
    const productListStr = products
      .map(
        (p) =>
          `- ${p.name}, giá: ${p.price}₫${
            p.tags?.length ? `, loại: ${p.tags.join(", ")}` : ""
          }, mô tả: ${p.description}`
      )
      .join("\n");

    // Prompt AI: thân thiện và chuyên nghiệp
    const prompt = `
Một bạn khách vừa hỏi: "${query}"

Dưới đây là danh sách sản phẩm hiện có:
${productListStr}

Bạn hãy trả lời bằng tiếng Việt, thân thiện và dễ hiểu.
Nếu có sản phẩm phù hợp, hãy gợi ý tối đa 3 món.
Nếu không có gì hợp, cứ nhẹ nhàng báo lại giúp mình nha.
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const aiReply =
      result?.response?.text()?.trim() ||
      "Xin lỗi nha, mình chưa nghĩ ra gợi ý phù hợp 😅.";

    // Tìm các sản phẩm phù hợp nhất
    const matchedProducts = await findMatchingProducts(query, products);

    return res.json({
      reply: aiReply,
      products: matchedProducts,
    });
  } catch (error) {
    console.error("Lỗi AI:", error);
    return res.status(500).json({
      error: "Lỗi khi xử lý AI",
      reply: "Oops, hệ thống đang bận chút xíu. Bạn thử lại sau nha!",
      products: [],
    });
  }
};

// Hàm tìm sản phẩm phù hợp bằng AI
async function findMatchingProducts(query, products) {
  try {
    const simplified = products.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      description: p.description,
      price: p.price,
      tags: p.tags,
    }));

    const prompt = `
Dưới đây là danh sách sản phẩm:
${JSON.stringify(simplified, null, 2)}

Khách hàng hỏi: "${query}"

Bạn hãy chọn tối đa 3 sản phẩm phù hợp nhất.
Trả về mảng JSON chứa ID, ví dụ: ["id1", "id2"]
Chỉ trả về mảng JSON, không thêm bất kỳ chữ nào khác nha.
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result?.response?.text()?.trim();
    if (!text || !text.startsWith("[")) return [];

    const matchedIds = JSON.parse(text);
    return products.filter((p) => matchedIds.includes(p._id.toString()));
  } catch (err) {
    console.error("Lỗi khi lọc sản phẩm:", err);
    return [];
  }
}

module.exports = {
  getSuggestions,
};
