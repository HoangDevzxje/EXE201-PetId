import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./ChatBot.css";

const ChatBot = ({ userId }) => {
  const [messages, setMessages] = useState([
    {
      text: "Xin chào! Tôi là trợ lý ảo PetID+ với AI thông minh. Hãy hỏi tôi bất cứ điều gì về thú cưng nhé 🐶🐱",
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

  useEffect(() => {
    if (userId && isOpen) {
      fetchUserPets();
    }
  }, [userId, isOpen]);

  const fetchUserPets = async () => {
    try {
      const res = await axios.get(
        `http://localhost:9999/chatbot/user-pets/${userId}`
      );
      setUserPets(res.data.pets);
      if (res.data.pets.length && !selectedPet) {
        setSelectedPet(res.data.pets[0]);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách thú cưng:", err);
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "vi-VN";
      recognitionRef.current.continuous = false;

      recognitionRef.current.onresult = (event) => {
        setInputMessage(event.results[0][0].transcript);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      alert("Trình duyệt không hỗ trợ giọng nói.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening((prev) => !prev);
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN";
      utterance.rate = 0.95;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      { text: inputMessage, sender: "user", products: [] },
    ]);
    const question = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:9999/chatbot/message", {
        query: question,
        petId: selectedPet?._id,
        userId,
      });

      const data = res.data;

      const botMessage = {
        text: data.reply,
        sender: "bot",
        products: data.products || [],
        analysisNote: data.analysisNote,
        petAnalysis: data.petAnalysis,
      };

      setMessages((prev) => [...prev, botMessage]);

      if (data.reply.length < 200) {
        speak(data.reply);
      }
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        {
          text: "❌ Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
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
      e.preventDefault();
      handleSend();
    }
  };

  const handleProductClick = (product) => {
    const message = `Sản phẩm: ${product.name}\nGiá: ${product.price}₫\nMô tả: ${product.description}`;
    setMessages((prev) => [
      ...prev,
      { text: message, sender: "user", products: [] },
    ]);
    speak(`Sản phẩm ${product.name}, giá ${product.price} đồng`);
  };

  const formatMessageText = (text) =>
    text.split("\n").map((line, i) => <div key={i}>{line}</div>);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, [messages, isOpen]);

  return (
    <>
      <div className={`chatbot ${isOpen ? "open" : "closed"}`}>
        {isOpen && (
          <>
            <div className="chatbot-header">
              <div>
                <h3>Tư vấn sức khỏe 24/7</h3>
                {selectedPet && (
                  <div className="selected-pet-info">
                    🐾 Đang tư vấn cho: <strong>{selectedPet.name}</strong> (
                    {selectedPet.species})
                  </div>
                )}
              </div>
              <div className="header-actions">
                {userPets.length > 0 && (
                  <button
                    className="pet-selector-btn"
                    onClick={() => setShowPetSelector(!showPetSelector)}
                  >
                    🐾
                  </button>
                )}
                <button className="close-btn" onClick={() => setIsOpen(false)}>
                  ✖
                </button>
              </div>
            </div>

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
                    {pet.breed && ` (${pet.breed})`} -{" "}
                    {pet.birthDate &&
                      `${Math.floor(
                        (new Date() - new Date(pet.birthDate)) / 31557600000
                      )} tuổi`}
                  </div>
                ))}
              </div>
            )}

            <div className="chatbot-messages" ref={chatBoxRef}>
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.text && (
                    <div className="message-text">
                      {formatMessageText(msg.text)}
                    </div>
                  )}
                  {msg.petAnalysis && (
                    <div className="pet-analysis-info">
                      🔍 Dựa trên: {msg.petAnalysis.petName} (
                      {msg.petAnalysis.species}
                      {msg.petAnalysis.breed && `, ${msg.petAnalysis.breed}`}
                      {msg.petAnalysis.age && `, ${msg.petAnalysis.age} tuổi`})
                    </div>
                  )}
                  {msg.analysisNote && (
                    <div className="analysis-note">💡 {msg.analysisNote}</div>
                  )}
                  {msg.products.length > 0 && (
                    <div className="product-suggestions">
                      <h4>🛍️ Gợi ý sản phẩm:</h4>
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
                              <p>{product.price.toLocaleString()}₫</p>
                              <p>{product.category}</p>
                              <div className="product-tags">
                                {product.tags?.map((tag, i) => (
                                  <span key={i} className="tag">
                                    {tag}
                                  </span>
                                ))}
                              </div>
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

      {!isOpen && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          Tư vấn sức khỏe 24/7
        </button>
      )}
    </>
  );
};

export default ChatBot;
