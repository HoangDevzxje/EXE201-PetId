const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Pet = require("../models/Pet");
const Category = require("../models/Category");

// AI Pet Analysis and Product Recommendation
const analyzePetAndRecommendProducts = async (petInfo, query, products) => {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Tạo danh sách sản phẩm với thông tin chi tiết
  const productList = products
    .map(
      (p) =>
        `ID: ${p._id}, Tên: ${p.name}, Giá: ${p.price}₫, ${
          p.tags ? `Tags: ${p.tags.join(", ")}, ` : ""
        }Mô tả: ${p.description}, Stock: ${p.stock}`
    )
    .join("\n");

  const prompt = `
Bạn là một chuyên gia về thú cưng và sản phẩm chăm sóc thú cưng. Hãy phân tích thông tin thú cưng và đưa ra gợi ý sản phẩm phù hợp.

THÔNG TIN THÚ CƯNG:
${
  petInfo
    ? `
- Tên: ${petInfo.name || "Không rõ"}
- Loài: ${petInfo.species || "Không rõ"}
- Giống: ${petInfo.breed || "Không rõ"}  
- Giới tính: ${petInfo.gender || "Không rõ"}
- Tuổi: ${
        petInfo.birthDate
          ? Math.floor(
              (new Date() - new Date(petInfo.birthDate)) /
                (365.25 * 24 * 60 * 60 * 1000)
            ) + " tuổi"
          : "Không rõ"
      }
- Cân nặng: ${petInfo.weightKg ? petInfo.weightKg + "kg" : "Không rõ"}
- Ghi chú: ${petInfo.notes || "Không có"}
- Lịch sử y tế: ${
        petInfo.medicalHistory?.length > 0
          ? petInfo.medicalHistory.map((h) => h.description).join(", ")
          : "Không có"
      }
`
    : "Thông tin thú cưng chưa được cung cấp"
}

DANH SÁCH SẢN PHẨM CÓ SẴN:
${productList}

YÊU CẦU CỦA KHÁCH HÀNG: "${query}"

NHIỆM VỤ:
1. Phân tích nhu cầu dựa trên thông tin thú cưng và yêu cầu
2. Đưa ra lời khuyên chăm sóc phù hợp với loài, giống, tuổi, và tình trạng sức khỏe
3. Gợi ý tối đa 3-5 sản phẩm phù hợp nhất từ danh sách (chỉ trả về ID sản phẩm)
4. Giải thích tại sao những sản phẩm này phù hợp

Trả lời theo format JSON:
{
  "reply": "Lời khuyên và giải thích chi tiết",
  "recommendedProductIds": ["id1", "id2", "id3"],
  "analysisNote": "Phân tích ngắn gọn về nhu cầu của thú cưng"
}
`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const responseText = result.response.text();

    // Parse JSON response
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.log("Could not parse JSON, returning text response");
    }

    return {
      reply: responseText,
      recommendedProductIds: [],
      analysisNote: "Phân tích tự động",
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
};

// Enhanced message handler with pet analysis
router.post("/message", async (req, res) => {
  const { query, petId, userId } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const lowerMsg = query.toLowerCase();

  // Handle greetings
  if (["cảm ơn", "thank", "thanks"].some((word) => lowerMsg.includes(word))) {
    return res.json({
      reply: "Không có gì, rất vui được giúp bạn chăm sóc thú cưng!",
      products: [],
    });
  }

  if (
    ["chào", "hi", "hello", "xin chào"].some((word) => lowerMsg.includes(word))
  ) {
    return res.json({
      reply:
        "Chào bạn! Tôi có thể giúp bạn tìm sản phẩm phù hợp cho thú cưng. Hãy cho tôi biết bạn cần gì nhé!",
      products: [],
    });
  }

  try {
    // Lấy thông tin thú cưng nếu có
    let petInfo = null;
    if (petId) {
      petInfo = await Pet.findById(petId);
    } else if (userId) {
      // Lấy thú cưng đầu tiên của user nếu không chỉ định petId
      petInfo = await Pet.findOne({ owner: userId });
    }

    // Lấy danh sách sản phẩm và categories
    const [products, categories] = await Promise.all([
      Product.find({ isActive: true, stock: { $gt: 0 } }).populate("category"),
      Category.find({ isActive: true }),
    ]);

    if (products.length === 0) {
      return res.json({
        reply: "Xin lỗi, hiện chưa có sản phẩm nào trong hệ thống.",
        products: [],
      });
    }

    // Sử dụng AI để phân tích và gợi ý sản phẩm
    const aiResponse = await analyzePetAndRecommendProducts(
      petInfo,
      query,
      products
    );

    // Lấy sản phẩm được gợi ý dựa trên ID
    const recommendedProducts = products.filter((product) =>
      aiResponse.recommendedProductIds.includes(product._id.toString())
    );

    // Format sản phẩm cho response
    const formattedProducts = recommendedProducts.map((product) => ({
      id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category?.name,
      tags: product.tags,
    }));

    return res.json({
      reply: aiResponse.reply,
      products: formattedProducts,
      analysisNote: aiResponse.analysisNote,
      petAnalysis: petInfo
        ? {
            petName: petInfo.name,
            species: petInfo.species,
            breed: petInfo.breed,
            age: petInfo.birthDate
              ? Math.floor(
                  (new Date() - new Date(petInfo.birthDate)) /
                    (365.25 * 24 * 60 * 60 * 1000)
                )
              : null,
          }
        : null,
    });
  } catch (error) {
    console.error("Error in chatbot:", error);
    res.status(500).json({
      error: "Lỗi khi xử lý yêu cầu",
      reply: "Xin lỗi, đã có lỗi xảy ra khi phân tích. Vui lòng thử lại sau.",
      products: [],
    });
  }
});

// Endpoint để lấy thông tin thú cưng của user
router.get("/user-pets/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const pets = await Pet.find({ owner: userId }).select(
      "name species breed birthDate weightKg"
    );
    res.json({ pets });
  } catch (error) {
    console.error("Error fetching user pets:", error);
    res.status(500).json({ error: "Lỗi khi lấy thông tin thú cưng" });
  }
});

// Endpoint để phân tích sức khỏe thú cưng
router.post("/health-analysis", async (req, res) => {
  const { petId, symptoms, concerns } = req.body;

  try {
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ error: "Không tìm thấy thú cưng" });
    }

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const healthPrompt = `
Bạn là một chuyên gia thú y. Hãy phân tích tình trạng sức khỏe của thú cưng và đưa ra lời khuyên.

THÔNG TIN THÚ CƯNG:
- Tên: ${pet.name}
- Loài: ${pet.species}
- Giống: ${pet.breed || "Không rõ"}
- Tuổi: ${
      pet.birthDate
        ? Math.floor(
            (new Date() - new Date(pet.birthDate)) /
              (365.25 * 24 * 60 * 60 * 1000)
          ) + " tuổi"
        : "Không rõ"
    }
- Cân nặng: ${pet.weightKg ? pet.weightKg + "kg" : "Không rõ"}
- Lịch sử y tế: ${
      pet.medicalHistory?.map((h) => h.description).join(", ") || "Không có"
    }

TRIỆU CHỨNG: ${symptoms || "Không có"}
MỐI QUAN TÂM: ${concerns || "Không có"}

Hãy đưa ra:
1. Đánh giá sơ bộ tình trạng
2. Lời khuyên chăm sóc
3. Khi nào cần đến bác sĩ thú y
4. Biện pháp phòng ngừa

LƯU Ý: Đây chỉ là lời khuyên tham khảo, không thay thế việc khám thú y chuyên nghiệp.
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: healthPrompt }] }],
    });

    res.json({
      analysis: result.response.text(),
      petInfo: {
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
      },
    });
  } catch (error) {
    console.error("Health analysis error:", error);
    res.status(500).json({ error: "Lỗi khi phân tích sức khỏe" });
  }
});

module.exports = router;
