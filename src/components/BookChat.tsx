import React, { useState, useEffect, useRef } from 'react';
import { useColorMode } from '@docusaurus/theme-common';

// Define TypeScript interfaces
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatHistory {
  conversationId: string;
  messages: Message[];
}

const BookChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { colorMode } = useColorMode();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Check backend status on component mount
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const BACKEND_URL = 'http://localhost:8000';
        const response = await fetch(`${BACKEND_URL}/health`);
        if (!response.ok) {
          setError('Backend server is not running. Please start the backend server to use the chatbot.');
        }
      } catch (error) {
        setError('Backend server is not running. Please start the backend server to use the chatbot.');
      }
    };

    checkBackendStatus();
  }, []);

  // Auto-capture selected text
  useEffect(() => {
    const handleSelection = () => {
      const selected = window.getSelection()?.toString().trim();
      if (selected && selected.length > 10) { // Only capture meaningful selections
        setSelectedText(selected);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null); // Clear any previous errors

    try {
      // Call the backend /chat endpoint
      const BACKEND_URL = 'http://localhost:8000';
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: inputValue,
          selected_text: selectedText || null,
          conversation_id: getConversationId(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status} ${response.statusText}`);
      }

      // Create assistant message placeholder for streaming
      const assistantMessageId = Date.now().toString();
      const initialAssistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      // Add empty assistant message to display as streaming begins
      setMessages(prev => [...prev, initialAssistantMessage]);

      // Handle streaming response
      const reader = response.body?.getReader();
      if (reader) {
        let assistantContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Decode the response chunk
          const chunk = new TextDecoder().decode(value);
          assistantContent += chunk;

          // Update the assistant message with the streamed content
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, content: assistantContent }
                : msg
            )
          );
        }

        reader.releaseLock();
      } else {
        // Fallback if streaming isn't supported - just get the full response
        const data = await response.json();
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: data.answer || data.response || 'I processed your request successfully.' }
              : msg
          )
        );
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage = error.message || 'Failed to connect to the chat service';
      setError(`Failed to connect to the chat service: ${errorMessage}`);

      // Find the assistant message and update it with error
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          return [
            ...prev.slice(0, -1),
            {
              ...lastMessage,
              content: `I'm having trouble connecting to the knowledge base. Error: ${errorMessage}\n\nTo use the chatbot, please:\n\n1. Make sure you have Python installed\n2. Navigate to the backend directory: \`cd backend\`\n3. Install dependencies: \`pip install -r requirements.txt\`\n4. Start the backend: \`python -m uvicorn app.main:app --host 0.0.0.0 --port 8000\`\n\nThe chatbot will connect to \`http://localhost:8000\` by default.`,
            }
          ];
        }
        // If no assistant message exists, add an error message
        return [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: `I'm having trouble connecting to the knowledge base. Error: ${errorMessage}\n\nTo use the chatbot, please:\n\n1. Make sure you have Python installed\n2. Navigate to the backend directory: \`cd backend\`\n3. Install dependencies: \`pip install -r requirements.txt\`\n4. Start the backend: \`python -m uvicorn app.main:app --host 0.0.0.0 --port 8000\`\n\nThe chatbot will connect to \`http://localhost:8000\` by default.`,
            timestamp: new Date(),
          }
        ];
      });
    } finally {
      setIsLoading(false);
      setSelectedText(''); // Clear selected text after sending
    }
  };

  const getConversationId = (): string => {
    // Get or create conversation ID in localStorage
    let conversationId = localStorage.getItem('bookChatConversationId');
    if (!conversationId) {
      conversationId = `conv_${Date.now()}`;
      localStorage.setItem('bookChatConversationId', conversationId);
    }
    return conversationId;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <>
      {/* Floating chat button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          colorMode === 'dark'
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
        aria-label="Open chat"
        title="Book Assistant"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      {/* Chat modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-full max-w-[90%] sm:max-w-md h-[60vh] sm:h-[70vh] max-h-[600px] flex flex-col rounded-lg shadow-xl overflow-hidden border border-gray-300 dark:border-gray-600">
          <div
            className={`flex-1 overflow-y-auto p-4 ${
              colorMode === 'dark'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-900'
            }`}
          >
            {/* Chat header */}
            <div className={`flex justify-between items-center mb-4 p-2 rounded-t-lg ${
              colorMode === 'dark' ? 'bg-gradient-to-r from-blue-700 to-blue-800' : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
            }`}>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <h3 className="font-semibold">Book Assistant</h3>
              </div>
              <button
                onClick={clearChat}
                className={`text-sm px-2 py-1 rounded text-xs ${
                  colorMode === 'dark'
                    ? 'bg-blue-800 hover:bg-blue-700'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                New Chat
              </button>
            </div>

            {/* Messages container */}
            <div className="space-y-4 mb-4">
              {error && (
                <div className={`p-3 rounded-lg mb-4 ${
                  colorMode === 'dark' ? 'bg-red-900/30 border border-red-700 text-red-200' : 'bg-red-100 border border-red-200 text-red-800'
                }`}>
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <div className="text-sm">{error}</div>
                  </div>
                </div>
              )}
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="flex justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <p className="font-medium">Ask me anything about the book!</p>
                  {selectedText && (
                    <div className={`text-xs mt-3 p-3 rounded-lg ${
                      colorMode === 'dark' ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-100 border border-blue-200'
                    }`}>
                      <p className={`font-medium mb-1 ${
                        colorMode === 'dark' ? 'text-blue-300' : 'text-blue-800'
                      }`}>Selected text:</p>
                      <p className="italic">{selectedText.substring(0, 150)}{selectedText.length > 150 ? '...' : ''}</p>
                    </div>
                  )}
                  <p className="text-xs mt-4 max-w-xs mx-auto">I can help explain concepts, provide examples, and answer questions from the Physical AI and Humanoid Robotics book.</p>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg max-w-[85%] ${
                        message.role === 'user'
                          ? colorMode === 'dark'
                            ? 'bg-blue-700 text-white ml-auto rounded-br-none'
                            : 'bg-blue-500 text-white ml-auto rounded-br-none'
                          : colorMode === 'dark'
                            ? 'bg-gray-700 text-white rounded-bl-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words">{message.content}</div>
                      <div className={`text-xs mt-1 ${
                        message.role === 'user'
                          ? colorMode === 'dark' ? 'text-blue-200' : 'text-blue-100'
                          : colorMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className={`p-3 rounded-lg max-w-[85%] ${
                      colorMode === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className="flex items-center">
                        <div className="mr-2">Thinking...</div>
                        <div className="flex space-x-1">
                          <div className={`w-2 h-2 rounded-full animate-bounce ${
                            colorMode === 'dark' ? 'bg-gray-300' : 'bg-gray-600'
                          }`}></div>
                          <div className={`w-2 h-2 rounded-full animate-bounce delay-75 ${
                            colorMode === 'dark' ? 'bg-gray-300' : 'bg-gray-600'
                          }`}></div>
                          <div className={`w-2 h-2 rounded-full animate-bounce delay-150 ${
                            colorMode === 'dark' ? 'bg-gray-300' : 'bg-gray-600'
                          }`}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </div>

          {/* Input area */}
          <div
            className={`p-3 border-t ${
              colorMode === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            {selectedText && (
              <div className={`text-xs mb-2 p-2 rounded ${
                colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                Using selected text: "{selectedText.substring(0, 50)}{selectedText.length > 50 ? '...' : ''}"
              </div>
            )}
            <div className="flex flex-col space-y-2">
              <div className="flex">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedText ? "Ask about selected text..." : "Message the book assistant..."}
                  className={`flex-1 p-2 rounded-l-lg border ${
                    colorMode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className={`px-4 rounded-r-lg flex items-center ${
                    isLoading || !inputValue.trim()
                      ? colorMode === 'dark'
                        ? 'bg-gray-600 text-gray-400'
                        : 'bg-gray-300 text-gray-500'
                      : colorMode === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <button
                onClick={async () => {
                  try {
                    const BACKEND_URL = 'http://localhost:8000';
                    const response = await fetch(`${BACKEND_URL}/health`);
                    const data = await response.json();
                    if (response.ok) {
                      alert(`Connection successful! Status: ${data.status}`);
                    } else {
                      alert(`Connection failed! Status: ${data.status}`);
                    }
                  } catch (error) {
                    alert(`Connection test failed: ${error}`);
                  }
                }}
                className={`px-4 py-2 rounded-lg flex items-center justify-center ${
                  colorMode === 'dark'
                    ? 'bg-green-700 hover:bg-green-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                Test Connection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookChat;