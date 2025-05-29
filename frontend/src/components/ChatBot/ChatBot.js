import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./ChatBot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Xin chào! Tôi là trợ lí ảo PetID+. Bạn cần tôi giúp gì không?",
      sender: "bot",
      products: [],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const chatBoxRef = useRef(null);
  const recognitionRef = useRef(null);

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
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          text: response.data.reply,
          sender: "bot",
          products: response.data.products || [],
        },
      ]);
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
    speak(message);
  };

  return (
    <>
      <div className={`chatbot ${isOpen ? "open" : "closed"}`}>
        {isOpen && (
          <>
            <div className="chatbot-header">
              <h3>AI PetID+ giúp bạn tìm kiếm sản phẩm mong muốn</h3>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ✖
              </button>
            </div>
            <div className="chatbot-messages" ref={chatBoxRef}>
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.text && <div className="message-text">{msg.text}</div>}
                  {msg.products.length > 0 && (
                    <div className="product-suggestions">
                      <h4>Sản phẩm gợi ý:</h4>
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
                              <p className="product-price">{product.price}₫</p>
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
                  <div className="message-text">Đang xử lý...</div>
                </div>
              )}
            </div>
            <div className="chatbot-input">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Nhập tin nhắn..."
              />
              <button
                className={`voice-btn ${isListening ? "active" : ""}`}
                onClick={toggleVoiceRecognition}
              >
                🎤
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
          💬
        </button>
      )}
    </>
  );
};

export default ChatBot;
