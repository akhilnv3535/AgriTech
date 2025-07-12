import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import axios from 'axios';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';

// Define types
interface PredictionResult {
  prediction: string;
  confidence: string;
  timestamp: string;
}

interface DataPoint {
  time: string;
  value: number;
}

interface RealtimeData {
  temperature: DataPoint[];
  humidity: DataPoint[];
  rain: DataPoint[];
  light: DataPoint[];
}

interface ThingSpeakFeed {
  created_at: string;
  field1: string; // temperature
  field2: string; // humidity
  field3: string; // rain
  field4: string; // light
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [cropPredicted, setCropPrediction] = useState("");
  const [realtimeData, setRealtimeData] = useState<RealtimeData>({
    temperature: [],
    humidity: [],
    rain: [],
    light: []
  });
  const [prevTemp, setPrevTemp] = useState<Number>();
  const [prevHumidity, setPrevHumidity] = useState<Number>();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. I can help you with crop recommendations, weather analysis, and agricultural insights. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Mock API call for prediction
  // const handlePredict = async () => {
  //   setIsLoading(true);
  //   try {
  //     // Simulate API call
  //     await new Promise(resolve => setTimeout(resolve, 2000));

  //     // Mock prediction result
  //     const mockResult = {
  //       prediction: Math.random() > 0.5 ? 'Positive' : 'Negative',
  //       confidence: (Math.random() * 0.4 + 0.6).toFixed(2), // 60-100%
  //       timestamp: new Date().toLocaleTimeString()
  //     };

  //     setPredictionResult(mockResult);
  //   } catch (error) {
  //     console.error('Prediction failed:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Fetch data from ThingSpeak API
  const fetchThingSpeakData = async () => {
    try {

      // console.log("THink speak api" + process.env.THINKSPEAK_API)
      const response = await fetch('https://api.thingspeak.com/channels/3005927/feeds.json?api_key=FTWU8TLVE7ANUC2G&results=100');
      const data = await response.json();

      if (data.feeds && data.feeds.length > 0) {
        const feeds = data.feeds.slice(-10); // Get last 10 readings

        const newData: RealtimeData = {
          temperature: feeds.map((feed: ThingSpeakFeed) => ({
            time: new Date(feed.created_at).toLocaleTimeString(),
            value: parseFloat(feed.field1) || 0
          })),
          humidity: feeds.map((feed: ThingSpeakFeed) => ({
            time: new Date(feed.created_at).toLocaleTimeString(),
            value: parseFloat(feed.field2) || 0
          })),
          rain: feeds.map((feed: ThingSpeakFeed) => ({
            time: new Date(feed.created_at).toLocaleTimeString(),
            value: parseFloat(feed.field3) || 0
          })),
          light: feeds.map((feed: ThingSpeakFeed) => ({
            time: new Date(feed.created_at).toLocaleTimeString(),
            value: parseFloat(feed.field4) || 0
          }))
        };
        const latestFeed = feeds[feeds.length - 1];
        setPrevTemp(parseFloat(latestFeed.field1));
        setPrevHumidity(parseFloat(latestFeed.field2));
        setRealtimeData(newData);
        // console.log(realtimeData);
      }
    } catch (error) {
      console.error('Error fetching ThingSpeak data:', error);
    }
  };

  // Fetch real-time data
  const predictCrop = async () => {
    const url = 'http://127.0.0.1:5000/predict';
    const data = {
      Nitrogen: parseFloat("50"),
      Phosporus: parseFloat("60"),
      Potassium: parseFloat("60"),
      // Temperature: parseFloat("35"),
      // Humidity: parseFloat("75"),
      Temperature: prevTemp,
      Humidity: prevHumidity,
      Ph: parseFloat("6"),
      Rainfall: parseFloat("250")
    };
    console.log(realtimeData);

    try {
      const response = await axios.post(url, data);
      console.log(response.data);
      setCropPrediction(response.data);

      const mockResult = {
        prediction: Math.random() > 0.5 ? 'Positive' : 'Negative',
        confidence: (Math.random() * 0.4 + 0.6).toFixed(2), // 60-100%
        timestamp: new Date().toLocaleTimeString()
      };

      setPredictionResult(mockResult);
    } catch (err) {
      console.error('Error sending data:', err);
    }
  }

  // Chatbot API integration with OpenRouter
  const sendChatMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsChatLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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', // ⚠ Move to env/server for production
          'Referer': window.location.origin,
          'X-Title': 'Agricultural Dashboard'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            {
              role: 'system',
              content:
                'You are an agricultural AI assistant specializing in crop recommendations, weather analysis, and farming insights. Provide helpful, accurate information about agriculture, crops, weather patterns, and farming techniques. Keep responses concise but informative.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data?.choices?.[0]?.message?.content ?? 'Sorry, I couldn\'t process your request.';

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat API error:', error);

      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m having trouble connecting to the chat service right now. Please try again later or check your API configuration.',
        sender: 'bot',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage(currentMessage);
    }
  };


  useEffect(() => {
    // Initial fetch
    fetchThingSpeakData();
    // Fetch data every 30 seconds
    const interval = setInterval(fetchThingSpeakData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Animated background */}
      <div className="animated-bg">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>

      <div className="content-wrapper">
        {/* Header */}
        <div className="header-section">
          <h1 className="main-title">
            <span className="title-gradient">Real-time Prediction</span>
            <br />
            <span className="title-accent">Dashboard</span>
          </h1>
          <p className="subtitle">Monitor live data streams and generate AI-powered predictions</p>
        </div>

        {/* Prediction Section */}
        <div className="prediction-section">
          <div className="glass-card prediction-card">
            <div className="card-glow"></div>
            <div className="prediction-content">
              <button
                // onClick={handlePredict}
                onClick={predictCrop}
                disabled={isLoading}
                className={`predict-button ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Analyzing Data...</span>
                  </>
                ) : (
                  <>
                    <span className="button-icon">🔮</span>
                    <span>Generate Prediction</span>
                  </>
                )}
              </button>

              {/* Prediction Result */}
              {predictionResult && (
                <div className="prediction-result">
                  <h3 className="result-title">Prediction Result</h3>
                  <div className="result-grid">
                    <div className="result-item">
                      <div className="result-label">Prediction</div>
                      <div className={`result-value prediction-${predictionResult.prediction.toLowerCase()}`}>
                        {predictionResult.prediction}
                      </div>
                    </div>
                    <div className="result-item">
                      <div className="result-label">Confidence</div>
                      <div className="result-value confidence-value">{predictionResult.confidence}%</div>
                    </div>
                    {/* <div className="result-item">
                      <div className="result-label">Timestamp</div>
                      <div className="result-value time-value">{predictionResult.timestamp}</div>
                    </div> */}
                    <div className="result-item">
                      <div className="result-label">Crop Prediction</div>
                      <div className="result-value confidence-value">{cropPredicted}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Real-time Graphs */}
        <div className="charts-grid">
          {/* Temperature Graph */}
          <div className="chart-container">
            <div className="glass-card chart-card">
              <div className="chart-header">
                <div className="chart-indicator temp-indicator"></div>
                <h3 className="chart-title">Temperature</h3>
                <span className="chart-unit">°C</span>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer>
                  <LineChart data={realtimeData.temperature}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                    <YAxis domain={[15, 35]} stroke="rgba(255,255,255,0.6)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '12px',
                        backdropFilter: 'blur(20px)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#ff6b6b"
                      strokeWidth={3}
                      dot={{ fill: '#ff6b6b', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 8, fill: '#ff6b6b' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Humidity Graph */}
          <div className="chart-container">
            <div className="glass-card chart-card">
              <div className="chart-header">
                <div className="chart-indicator humidity-indicator"></div>
                <h3 className="chart-title">Humidity</h3>
                <span className="chart-unit">%</span>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer>
                  <AreaChart data={realtimeData.humidity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '12px',
                        backdropFilter: 'blur(20px)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#4ecdc4"
                      fill="url(#humidityGradient)"
                      strokeWidth={3}
                    />
                    <defs>
                      <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Rain Graph */}
          <div className="chart-container">
            <div className="glass-card chart-card">
              <div className="chart-header">
                <div className="chart-indicator rain-indicator"></div>
                <h3 className="chart-title">Rain</h3>
                <span className="chart-unit">mm</span>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer>
                  <BarChart data={realtimeData.rain}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '12px',
                        backdropFilter: 'blur(20px)'
                      }}
                    />
                    <Bar dataKey="value" fill="url(#rainGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#45b7d1" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#45b7d1" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Light Graph */}
          <div className="chart-container">
            <div className="glass-card chart-card">
              <div className="chart-header">
                <div className="chart-indicator light-indicator"></div>
                <h3 className="chart-title">Light</h3>
                <span className="chart-unit">lux</span>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer>
                  <LineChart data={realtimeData.light}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '12px',
                        backdropFilter: 'blur(20px)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#ffa726"
                      strokeWidth={3}
                      dot={{ fill: '#ffa726', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 8, fill: '#ffa726' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="status-section">
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span className="status-text">Live Data Stream Active</span>
          </div>
        </div>
      </div>


      {/* Chat Window */}
      {isChatOpen && (
        <div className="chat-modal">
          <div className="chat-container">
            <div className="chat-header">
              <div className="chat-header-content">
                <Bot size={20} />
                <span>Agricultural AI Assistant</span>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="chat-close-button"
              >
                <X size={20} />
              </button>
            </div>

            <div className="chat-messages">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`chat - message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  <div className="message-avatar">
                    {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className="message-content">
                    <p>{message.text}</p>
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="chat-message bot-message">
                  <div className="message-avatar">
                    <Bot size={16} />
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-input-container">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about crops, weather, or farming tips..."
                className="chat-input"
                disabled={isChatLoading}
              />
              <button
                onClick={() => sendChatMessage(currentMessage)}
                disabled={isChatLoading || !currentMessage.trim()}
                className="chat-send-button"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )
      }


      {/* Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="chat-toggle-button"
      >
        <MessageCircle size={24} />
        <div className="chat-button-pulse"></div>
      </button>

      {/* Chat Modal */}
      {/*  */}

      <style>{`
        /* Global body and html reset for full screen */
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow-x: hidden;
        }

        .dashboard-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          overflow-y: auto;
          overflow-x: hidden;
        }

        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }

        .bg-orb-1 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, #ff6b6b, transparent);
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .bg-orb-2 {
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, #4ecdc4, transparent);
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }

        .bg-orb-3 {
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, #45b7d1, transparent);
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
          padding: 1.5rem;
          width: 100%;
          box-sizing: border-box;
          min-height: 100vh;
        }

        .header-section {
          text-align: center;
          margin-bottom: 2rem;
          animation: slideInDown 0.8s ease-out;
        }

        .main-title {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 1rem;
          line-height: 1.1;
        }

        .title-gradient {
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
          animation: shimmer 2s ease-in-out infinite alternate;
        }

        .title-accent {
          color: white;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
          font-weight: 300;
          margin-top: 1rem;
        }

        @keyframes shimmer {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }

        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .prediction-section {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .prediction-card {
          width: 100%;
          max-width: 500px;
          padding: 2rem;
          position: relative;
        }

        .card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1));
          border-radius: 24px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .prediction-card:hover .card-glow {
          opacity: 1;
        }

        .prediction-content {
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .predict-button {
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          border: none;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          padding: 0.9rem 2rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }

        .predict-button:hover:not(.loading) {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(255, 107, 107, 0.4);
        }

        .predict-button.loading {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .button-icon {
          font-size: 1.2rem;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .prediction-result {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: slideInUp 0.5s ease-out;
        }

        .result-title {
          color: white;
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .result-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
        }

        .result-item {
          text-align: center;
        }

        .result-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .result-value {
          font-size: 1.3rem;
          font-weight: 700;
        }

        .prediction-positive {
          color: #4ecdc4;
          text-shadow: 0 0 20px rgba(78, 205, 196, 0.5);
        }

        .prediction-negative {
          color: #ff6b6b;
          text-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
        }

        .confidence-value {
          color: #45b7d1;
          text-shadow: 0 0 20px rgba(69, 183, 209, 0.5);
        }

        .time-value {
          color: #ffa726;
          text-shadow: 0 0 20px rgba(255, 167, 38, 0.5);
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .chart-container {
          animation: fadeInUp 0.8s ease-out;
        }

        .chart-container:nth-child(1) { animation-delay: 0.1s; }
        .chart-container:nth-child(2) { animation-delay: 0.2s; }
        .chart-container:nth-child(3) { animation-delay: 0.3s; }
        .chart-container:nth-child(4) { animation-delay: 0.4s; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chart-card {
          padding: 1.25rem;
          height: 100%;
          min-height: 350px;
        }

        .chart-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          gap: 0.75rem;
        }

        .chart-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .temp-indicator { background: #ff6b6b; }
        .humidity-indicator { background: #4ecdc4; }
        .rain-indicator { background: #45b7d1; }
        .light-indicator { background: #ffa726; }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        .chart-title {
          color: white;
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0;
        }

        .chart-unit {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          margin-left: auto;
        }

        .chart-wrapper {
          height: 260px;
          width: 100%;
        }

        .status-section {
          display: flex;
          justify-content: center;
          padding-bottom: 2rem;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          padding: 0.8rem 1.5rem;
          animation: slideInUp 0.8s ease-out;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #4ecdc4;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-text {
          color: white;
          font-weight: 500;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .content-wrapper {
            padding: 1rem;
          }
          
          .main-title {
            font-size: 2.5rem;
          }
          
          .charts-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .chart-container {
            min-width: 280px;
          }
          
          .chart-card {
            min-height: 320px;
          }
          
          .chart-wrapper {
            height: 220px;
          }
        }

        @media (max-width: 480px) {
          .main-title {
            font-size: 2rem;
          }
          
          .subtitle {
            font-size: 1rem;
          }
          
          .prediction-card {
            padding: 1.5rem;
          }
          
          .chart-card {
            padding: 1rem;
            min-height: 280px;
          }
          
          .chart-wrapper {
            height: 180px;
          }
        }
      `}</style>
    </div >
  );
};

export default Dashboard;