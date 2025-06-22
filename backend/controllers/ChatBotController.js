require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/Product");
const Pet = require("../models/Pet");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Xây prompt cho Gemini AI
 */
const buildPrompt = (petInfo, query, products) => {
  const productList = products
    .map(
      (p) =>
        `ID: ${p._id}, Tên: ${p.name}, Giá: ${p.price}₫, ${
          p.tags?.length ? `Tags: ${p.tags.join(", ")}, ` : ""
        }Mô tả: ${p.description}, Stock: ${p.stock}`
    )
    .join("\n");

  return `
Bạn là chuyên gia thú cưng. Dựa trên dữ liệu bên dưới, hãy phân tích và gợi ý sản phẩm phù hợp nhất.

THÔNG TIN THÚ CƯNG:
THÔNG TIN THÚ CƯNG:
${
  petInfo
    ? `- Tên: ${petInfo.name || "Không rõ"}
- Loài: ${petInfo.species || "Không rõ"}
- Giống: ${petInfo.breed || "Không rõ"}
- Giới tính: ${petInfo.gender || "Không rõ"}
- Ngày sinh: ${
        petInfo.birthDate
          ? new Date(petInfo.birthDate).toLocaleDateString("vi-VN")
          : "Không rõ"
      }
- Tuổi: ${
        petInfo.birthDate
          ? Math.floor(
              (new Date() - new Date(petInfo.birthDate)) / 31557600000
            ) + " tuổi"
          : "Không rõ"
      }
- Cân nặng: ${petInfo.weightKg ? petInfo.weightKg + " kg" : "Không rõ"}
- Sở thích: ${petInfo.hobbies?.length ? petInfo.hobbies.join(", ") : "Không có"}
- Sở ghét: ${
        petInfo.dislikes?.length ? petInfo.dislikes.join(", ") : "Không có"
      }
- Kiêng khem: ${
        petInfo.restrictions?.length
          ? petInfo.restrictions.join(", ")
          : "Không có"
      }
- Ghi chú: ${petInfo.notes || "Không có"}
- Lịch sử y tế: ${
        petInfo.medicalHistory?.length
          ? petInfo.medicalHistory.map((h) => h.description).join("; ")
          : "Không có"
      }
- Hồ sơ tiêm chủng: ${
        petInfo.vaccinationRecords?.length
          ? petInfo.vaccinationRecords
              .map(
                (v) =>
                  `${v.vaccineName} (${new Date(v.date).toLocaleDateString(
                    "vi-VN"
                  )}${
                    v.nextDoseDue
                      ? `, mũi kế: ${new Date(v.nextDoseDue).toLocaleDateString(
                          "vi-VN"
                        )}`
                      : ""
                  })`
              )
              .join("; ")
          : "Không có"
      }`
    : "Không có thông tin thú cưng"
}

DANH SÁCH SẢN PHẨM:
${productList}

YÊU CẦU KHÁCH HÀNG: "${query}"

Trả lời đúng format JSON:
{
  "reply": "Lời khuyên chi tiết",
  "recommendedProductIds": ["id1", "id2"],
  "analysisNote": "Tóm tắt nhanh"
}
`;
};

/**
 * Gọi Gemini AI, parse JSON
 */
const analyzePetAndRecommendProducts = async (petInfo, query, products) => {
  const prompt = buildPrompt(petInfo, query, products);

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const responseText = result?.response?.text()?.trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);

    return {
      reply: responseText || "Không thể phân tích phản hồi AI",
      recommendedProductIds: [],
      analysisNote: "Phản hồi không đúng định dạng JSON",
    };
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return {
      reply: "Đã xảy ra lỗi khi xử lý AI",
      recommendedProductIds: [],
      analysisNote: "Lỗi hệ thống AI",
    };
  }
};

/**
 * POST /chatbot/message
 */
const handleChatMessage = async (req, res) => {
  const { query, petId, userId } = req.body;
  if (!query) return res.status(400).json({ error: "Thiếu query!" });

  const lowerMsg = query.toLowerCase();
  if (["cảm ơn", "thank", "thanks"].some((w) => lowerMsg.includes(w))) {
    return res.json({
      reply: "Không có gì đâu 🐾",
      products: [],
      featuredProducts: [],
    });
  }
  if (["chào", "hi", "hello", "xin chào"].some((w) => lowerMsg.includes(w))) {
    return res.json({
      reply:
        "Xin chào! Mình có thể giúp bạn tìm sản phẩm phù hợp cho bé cưng 🐶🐱",
      products: [],
      featuredProducts: [],
    });
  }

  try {
    // Lấy thông tin pet (nếu có)
    const petInfo = petId
      ? await Pet.findById(petId)
      : await Pet.findOne({ owner: userId });

    // Lấy tất cả sản phẩm active, có stock
    const products = await Product.find({
      isActive: true,
      stock: { $gt: 0 },
    }).populate("category");

    // Lấy sản phẩm "bán chạy" theo flag isFeatured
    const featured = await Product.find({
      isActive: true,
      isFeatured: true,
      stock: { $gt: 0 },
    })
      .populate("category")
      .limit(4);

    if (!products.length) {
      return res.json({
        reply: "Hiện tại chưa có sản phẩm nào để gợi ý 😢",
        products: [],
        featuredProducts: featured.map((p) => ({
          id: p._id,
          name: p.name,
          price: p.price,
          description: p.description,
          imageUrl: p.imageUrl,
          category: p.category?.name,
          tags: p.tags,
        })),
      });
    }

    // Gọi AI để recommend
    const aiResponse = await analyzePetAndRecommendProducts(
      petInfo,
      query,
      products
    );

    // Lọc ra những sản phẩm AI gợi ý
    const matched = products.filter((p) =>
      aiResponse.recommendedProductIds.includes(p._id.toString())
    );

    const formattedRecommended = matched.map((p) => ({
      id: p._id,
      name: p.name,
      price: p.price,
      description: p.description,
      imageUrl: p.imageUrl,
      category: p.category?.name,
      tags: p.tags,
    }));

    // Format featured
    const formattedFeatured = featured.map((p) => ({
      id: p._id,
      name: p.name,
      price: p.price,
      description: p.description,
      imageUrl: p.imageUrl,
      category: p.category?.name,
      tags: p.tags,
    }));

    // Trả về
    res.json({
      reply: aiResponse.reply,
      products: formattedRecommended,
      featuredProducts: formattedFeatured,
      analysisNote: aiResponse.analysisNote,
      petAnalysis: petInfo
        ? {
            petName: petInfo.name,
            species: petInfo.species,
            breed: petInfo.breed,
            age: petInfo.birthDate
              ? Math.floor(
                  (new Date() - new Date(petInfo.birthDate)) / 31557600000
                )
              : null,
          }
        : null,
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({
      error: "Lỗi xử lý chatbot",
      reply: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
      products: [],
      featuredProducts: [],
    });
  }
};

const getUserPets = async (req, res) => {
  try {
    const { userId } = req.params;
    const pets = await Pet.find({ owner: userId }).select(
      "name species breed birthDate weightKg"
    );
    res.json({ pets });
  } catch (err) {
    console.error("Lỗi lấy danh sách thú cưng:", err);
    res.status(500).json({ error: "Không thể lấy danh sách thú cưng" });
  }
};

const analyzeHealth = async (req, res) => {
  const { petId, symptoms, concerns } = req.body;

  try {
    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ error: "Không tìm thấy thú cưng" });

    const prompt = `
Bạn là bác sĩ thú y. Hãy phân tích sức khỏe thú cưng dưới đây và đưa lời khuyên:

- Tên: ${pet.name}
- Loài: ${pet.species}
- Giống: ${pet.breed || "Không rõ"}
- Tuổi: ${
      pet.birthDate
        ? Math.floor((new Date() - new Date(pet.birthDate)) / 31557600000) +
          " tuổi"
        : "Không rõ"
    }
- Cân nặng: ${pet.weightKg || "Không rõ"}kg
- Tiền sử bệnh: ${
      pet.medicalHistory?.map((h) => h.description).join(", ") || "Không có"
    }
- Triệu chứng: ${symptoms || "Không có"}
- Mối quan tâm của chủ: ${concerns || "Không có"}

Yêu cầu:
1. Đánh giá sơ bộ
2. Lời khuyên chăm sóc
3. Khi nào nên đến bác sĩ thú y
4. Cách phòng ngừa

Lưu ý: Đây là tư vấn sơ bộ, không thay thế cho khám thú y thực tế.
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    res.json({
      analysis: result.response.text(),
      petInfo: {
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
      },
    });
  } catch (err) {
    console.error("Lỗi phân tích sức khỏe:", err);
    res.status(500).json({ error: "Lỗi khi phân tích sức khỏe thú cưng" });
  }
};

module.exports = {
  handleChatMessage,
  getUserPets,
  analyzeHealth,
};
