import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./ChatBot.css";

const ChatBot = ({ userId }) => {
  const [messages, setMessages] = useState([
    {
      text: "Xin chào! Tôi là trợ lí ảo PetID+ với AI thông minh. Tôi có thể phân tích thông tin thú cưng của bạn và gợi ý sản phẩm phù hợp. Bạn cần tôi giúp gì không?",
      sender: "bot",
      products: [],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userPets, setUserPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showPetSelector, setShowPetSelector] = useState(false);

  const chatBoxRef = useRef(null);
  const recognitionRef = useRef(null);

  // Fetch user's pets when component mounts
  useEffect(() => {
    if (userId && isOpen) {
      fetchUserPets();
    }
  }, [userId, isOpen]);

  const fetchUserPets = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9999/chatbot/user-pets/${userId}`
      );
      setUserPets(response.data.pets);
      if (response.data.pets.length > 0 && !selectedPet) {
        setSelectedPet(response.data.pets[0]);
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  useEffect(() => {
    // Khởi tạo Speech Recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "vi-VN";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      sender: "user",
      products: [],
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:9999/chatbot/message",
        {
          query: inputMessage,
          petId: selectedPet?._id,
          userId: userId,
        }
      );

      const botMessage = {
        text: response.data.reply,
        sender: "bot",
        products: response.data.products || [],
        analysisNote: response.data.analysisNote,
        petAnalysis: response.data.petAnalysis,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Auto-speak the response if it's not too long
      if (response.data.reply.length < 200) {
        speak(response.data.reply);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
          sender: "bot",
          products: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      alert("Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleProductClick = (product) => {
    const message = `Sản phẩm: ${product.name}\nGiá: ${product.price}₫\nMô tả: ${product.description}`;
    setMessages((prev) => [
      ...prev,
      {
        text: message,
        sender: "user",
        products: [],
      },
    ]);
    speak(`Sản phẩm ${product.name}, giá ${product.price} đồng`);
  };

  const formatMessageText = (text) => {
    return text
      .split("\n")
      .map((line, index) => (
        <div key={index}>
          {line.startsWith("**") && line.endsWith("**") ? (
            <strong>{line.slice(2, -2)}</strong>
          ) : (
            line
          )}
        </div>
      ));
  };

  return (
    <>
      <div className={`chatbot ${isOpen ? "open" : "closed"}`}>
        {isOpen && (
          <>
            <div className="chatbot-header">
              <div>
                <h3>AI PetID+</h3>
                {selectedPet && (
                  <div className="selected-pet-info">
                    <span>
                      🐾 Đang tư vấn cho: <strong>{selectedPet.name}</strong> (
                      {selectedPet.species})
                    </span>
                  </div>
                )}
              </div>
              <div className="header-actions">
                {userPets.length > 0 && (
                  <button
                    className="pet-selector-btn"
                    onClick={() => setShowPetSelector(!showPetSelector)}
                    title="Chọn thú cưng"
                  >
                    🐾
                  </button>
                )}

                <button className="close-btn" onClick={() => setIsOpen(false)}>
                  ✖
                </button>
              </div>
            </div>

            {/* Pet Selector Dropdown */}
            {showPetSelector && (
              <div className="pet-selector-dropdown">
                <h4>Chọn thú cưng:</h4>
                {userPets.map((pet) => (
                  <div
                    key={pet._id}
                    className={`pet-option ${
                      selectedPet?._id === pet._id ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedPet(pet);
                      setShowPetSelector(false);
                    }}
                  >
                    <strong>{pet.name}</strong> - {pet.species}
                    {pet.breed && ` (${pet.breed})`}
                    {pet.birthDate &&
                      ` - ${Math.floor(
                        (new Date() - new Date(pet.birthDate)) /
                          (365.25 * 24 * 60 * 60 * 1000)
                      )} tuổi`}
                  </div>
                ))}
              </div>
            )}

            <div className="chatbot-messages" ref={chatBoxRef}>
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.text && (
                    <div
                      className={`message-text ${
                        msg.isHealthAnalysis ? "health-analysis" : ""
                      }`}
                    >
                      {formatMessageText(msg.text)}
                    </div>
                  )}

                  {msg.petAnalysis && (
                    <div className="pet-analysis-info">
                      <small>
                        🔍 Phân tích dựa trên: {msg.petAnalysis.petName}(
                        {msg.petAnalysis.species}
                        {msg.petAnalysis.breed && `, ${msg.petAnalysis.breed}`}
                        {msg.petAnalysis.age && `, ${msg.petAnalysis.age} tuổi`}
                        )
                      </small>
                    </div>
                  )}

                  {msg.analysisNote && (
                    <div className="analysis-note">
                      <small>💡 {msg.analysisNote}</small>
                    </div>
                  )}

                  {msg.products.length > 0 && (
                    <div className="product-suggestions">
                      <h4>🛍️ Sản phẩm được AI gợi ý:</h4>
                      <div className="product-grid">
                        {msg.products.map((product, idx) => (
                          <div
                            key={idx}
                            className="product-card"
                            onClick={() => handleProductClick(product)}
                          >
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="product-image"
                              />
                            )}
                            <div className="product-info">
                              <h5>{product.name}</h5>
                              <p className="product-price">
                                {product.price.toLocaleString()}₫
                              </p>
                              {product.category && (
                                <p className="product-category">
                                  {product.category}
                                </p>
                              )}
                              {product.tags && product.tags.length > 0 && (
                                <div className="product-tags">
                                  {product.tags.map((tag, tagIdx) => (
                                    <span key={tagIdx} className="tag">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="message bot">
                  <div className="message-text">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    AI đang phân tích...
                  </div>
                </div>
              )}
            </div>

            <div className="chatbot-input">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  selectedPet
                    ? `Hỏi về ${selectedPet.name}...`
                    : "Nhập tin nhắn..."
                }
              />
              <button
                className={`voice-btn ${isListening ? "active" : ""}`}
                onClick={toggleVoiceRecognition}
                title="Ghi âm giọng nói"
              >
                {isListening ? "🔴" : "🎤"}
              </button>
              <button className="send-btn" onClick={handleSend}>
                Gửi
              </button>
            </div>
          </>
        )}
      </div>

      {/* Nút mở/ẩn chatbot */}
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          Trợ lý AI phân tích thú cưng
        </button>
      )}
    </>
  );
};

export default ChatBot;
