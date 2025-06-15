import { useState, useEffect, useRef } from 'react';
 const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Bot', text: 'Hey there! How can I help you today?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [conversations, setConversations] = useState([
    { id: 1, title: 'New Chat', active: true }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'User',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Generate bot response after a short delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        sender: 'Bot',
        text: generateBotResponse(input),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 700);

    setInput('');
};
  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const generateBotResponse = (userMessageText) => {
    const lowerCaseMessage = userMessageText.toLowerCase();
    let botResponse = `I'm not sure how to respond to "${userMessageText}". Can you please rephrase or ask about rooms, broker fees, or contact info?`; // Default fallback

    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('namaste')) {
      botResponse = "Hi there! How can I assist you with finding a room in Kathmandu?";
    } else if (lowerCaseMessage.includes('room') || (lowerCaseMessage.includes('find') || lowerCaseMessage.includes('search') || lowerCaseMessage.includes('rent'))) {
      botResponse = "Great! Are you looking for a **single room**, **shared room**, **apartment**, or **hostel**? You can also search by area or college.";
    } else if (lowerCaseMessage.includes('broker fees') || lowerCaseMessage.includes(' cost')) {
      botResponse = "We're proud to say we have **0% broker fees**! You connect directly with landlords, saving you money.";
    } else if (lowerCaseMessage.includes('contact') || lowerCaseMessage.includes('support')) {
      botResponse = "You can reach our support team at **help@ghardera.com** amnor call us at **+9779812233214**.";
    } else if (lowerCaseMessage.includes('list property') || lowerCaseMessage.includes('landlord')) {
      botResponse = "Are you a landlord interested in listing your property? Visit our 'List Your Property' page for more details on how to get started!";
    } else if (lowerCaseMessage.includes('safety') || lowerCaseMessage.includes('secure')) {
      botResponse = "Your safety is our priority. All properties are **verified**, and we offer secure payment options. Check out our safety tips for more info on our website.";
    } else if (lowerCaseMessage.includes('thank you') || lowerCaseMessage.includes('thanks')) {
      botResponse = "You're most welcome! Happy to help. Is there anything else I can assist you with today?";
    } else if (lowerCaseMessage.includes('about us')) {
      botResponse = "GharDera connects students with affordable, safe, and comfortable accommodation in Kathmandu, with no broker fees. Our goal is to simplify your housing search.";
    } else if (lowerCaseMessage.includes('location') || lowerCaseMessage.includes('area')) {
      botResponse = "We have rooms available across various prime locations in Kathmandu, often near major colleges and universities. What specific area or college are you interested in?";
    } else if (lowerCaseMessage.includes('how it works')) {
      botResponse = "Our process is simple: **Search & Filter**, **Connect Directly** with landlords, **Visit & Verify** the property, and then **Book Instantly**! We guide you every step of the way.";
    } else if (lowerCaseMessage.includes('what types of rooms')) {
      botResponse = "We offer various room types including **single rooms** for privacy, **shared rooms** for a budget-friendly option, **apartments** for more space, and **hostels** for a community feel.";
    } else if (lowerCaseMessage.includes('payment options')) {
      botResponse = "We provide a secure payment system for instant booking. This includes **digital agreements** and **online payments** for your convenience.";
    } else if (lowerCaseMessage.includes('student community')) {
      botResponse = "Our platform helps you connect with fellow students, share experiences, and get recommendations from verified reviews. It's a great way to build your network in a new city!";
    } else if (lowerCaseMessage.includes('college')) {
      botResponse = "To help me find a room near your college, could you please tell me which college you're attending or planning to attend?";
    } else if (lowerCaseMessage.includes('price') || lowerCaseMessage.includes('budget')) {
      botResponse = "Prices vary depending on the room type, location, and amenities. What's your approximate budget range, and which area are you considering?";
    }
    return botResponse;
  };

  const startNewConversation = () => {
    setConversations([
      ...conversations.map(conv => ({ ...conv, active: false })),
      { id: conversations.length + 1, title: `Chat ${conversations.length + 1}`, active: true }
    ]);
    setMessages([
      { id: 1, sender: 'Bot', text: 'Hey there! How can I help you today?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setIsSidebarOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white p-4 rounded-full shadow-lg z-50 hover:scale-105 transition-transform"
        aria-label="Toggle Chat"
      >
        💬
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-end md:items-center animate-fadeIn">
          <div className="bg-white w-full h-[90vh] md:w-[80vw] md:h-[80vh] md:max-w-3xl md:rounded-2xl flex flex-col shadow-xl animate-slideIn">
            <div className="bg-white p-4 border-b flex justify-between items-center rounded-t-2xl">
              <div className="flex items-center space-x-2">
                <button
                  className="md:hidden p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  aria-label="Toggle Sidebar"
                >
                  ☰
                </button>
                <h1 className="text-lg font-semibold text-gray-900">Chatbot</h1>
              </div>
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
                aria-label="Close Chat"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className={`w-64 bg-gray-50 p-4 border-r absolute md:static h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} z-50 md:z-auto`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
                  <button
                    className="md:hidden p-2 rounded-full hover:bg-gray-200"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Close Sidebar"
                  >
                    ✕
                  </button>
                </div>
                <button
                  className="w-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white py-2 px-4 rounded-full mb-4 hover:brightness-110 transition"
                  onClick={startNewConversation}
                >
                  New Chat
                </button>
                <ul className="space-y-2 overflow-y-auto max-h-[calc(100%-120px)]">
                  {conversations.map((conv) => (
                    <li
                      key={conv.id}
                      className={`p-3 rounded-lg cursor-pointer flex items-center space-x-2 ${conv.active ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                      onClick={() => {
                        setConversations(conversations.map(c => ({
                          ...c,
                          active: c.id === conv.id
                        })));
                        setIsSidebarOpen(false);
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                        {conv.title[0]}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{conv.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-3 flex ${message.sender === 'User' ? 'justify-end' : 'justify-start'} items-end space-x-2`}
                    >
                      {message.sender !== 'User' && (
                        <div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center text-white text-sm font-medium">
                          B
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                          message.sender === 'User'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md'
                            : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${message.sender === 'User' ? 'text-white/80' : 'text-gray-500'}`}>
                          {message.timestamp}
                        </p>
                      </div>
                      {message.sender === 'User' && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                          U
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
                  <div className="flex items-center bg-gray-100 rounded-full p-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Message..."
                      className="flex-1 bg-transparent px-4 py-2 text-sm text-gray-900 focus:outline-none"
                      aria-label="Type a message"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white hover:brightness-110 transition"
                      aria-label="Send Message"
                    >
                      ➤
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Chatbot;
