import React, { useState, useEffect, useRef } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { v4 as uuidv4 } from 'uuid';
import confetti from 'canvas-confetti';

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

interface BookChatProps {
  navbarMode?: boolean;
}

const BookChat: React.FC<BookChatProps> = ({ navbarMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
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

  // Handle opening chat from navbar
  useEffect(() => {
    const handleOpenMainChat = () => {
      setIsOpen(true);
    };

    document.addEventListener('openMainChat', handleOpenMainChat);

    return () => {
      document.removeEventListener('openMainChat', handleOpenMainChat);
    };
  }, []);

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

      // Handle response based on content type
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        // Handle JSON response (non-streaming)
        const data = await response.json();
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: data.answer || data.response || 'I processed your request successfully.' }
              : msg
          )
        );
      } else {
        // Handle streaming response
        const reader = response.body?.getReader();
        if (reader) {
          let fullResponse = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Decode the response chunk
            const chunk = new TextDecoder().decode(value);
            fullResponse += chunk;
          }

          reader.releaseLock();

          // Try to parse as JSON to extract just the answer
          try {
            const parsedData = JSON.parse(fullResponse);
            const answerText = parsedData.answer || parsedData.response || fullResponse;
            setMessages(prev =>
              prev.map(msg =>
                msg.id === assistantMessageId
                  ? { ...msg, content: answerText }
                  : msg
              )
            );
          } catch (e) {
            // If it's not valid JSON, use the full response as the answer
            setMessages(prev =>
              prev.map(msg =>
                msg.id === assistantMessageId
                  ? { ...msg, content: fullResponse }
                  : msg
              )
            );
          }
        } else {
          // Fallback if no reader available
          const text = await response.text();
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, content: text }
                : msg
            )
          );
        }
      }

      // Trigger confetti for the first question
      if (isFirstQuestion) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#F97316', '#FBBF24', '#8B5CF6'],
          shapes: ['circle', 'square']
        });
        setIsFirstQuestion(false);
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
      conversationId = uuidv4();
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
    setIsFirstQuestion(true); // Reset first question flag for new conversation
  };

  return (
    <>
      {navbarMode ? (
        // Navbar mode: Button that opens modal in navbar area
        <div className="relative">
          <button
            onClick={toggleChat}
            className="chat-button"
            aria-label="Open chat"
            title="Physical AI Assistant"
          >
            🤖
          </button>

          {/* Chat modal positioned in navbar area */}
          {isOpen && (
            <div className="chat-modal">
              <div className="chat-header">
                <div className="chat-header-left">
                  <div className="chat-header-icon">🤖</div>
                  <div className="chat-header-title">Physical AI Assistant</div>
                </div>
                <div className="chat-header-right">
                  <button
                    onClick={clearChat}
                    className="chat-header-button"
                    title="New Chat"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Messages container */}
              <div className="chat-messages">
                {error && (
                  <div className="p-3 rounded-lg mb-4 bg-red-100 border border-red-200 text-red-800">
                    <div className="flex items-start">
                      <div className="mr-2">⚠️</div>
                      <div className="text-sm">{error}</div>
                    </div>
                  </div>
                )}
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="flex justify-center mb-4">
                      <div className="text-4xl">🤖</div>
                    </div>
                    <p className="font-medium">Ask me anything about the book!</p>
                    {selectedText && (
                      <div className="text-xs mt-3 p-3 rounded-lg bg-blue-100 border border-blue-200">
                        <p className="font-medium mb-1 text-blue-800">Selected text:</p>
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
                        className={`${
                          message.role === 'user'
                            ? 'message-user'
                            : 'message-ai'
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">{message.content}</div>
                        <div className={`text-xs mt-1 opacity-70`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="typing-indicator">
                        <span>Thinking</span>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input area */}
              <div className="chat-input-area">
                {selectedText && (
                  <div className="selected-text-chip">
                    <div className="selected-text-chip-content">
                      Using: "{selectedText.substring(0, 50)}{selectedText.length > 50 ? '...' : ''}"
                    </div>
                    <button
                      onClick={() => setSelectedText('')}
                      className="selected-text-chip-close"
                      title="Remove selection"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="flex flex-col space-y-2">
                  <div className="flex">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={selectedText ? "Ask about selected text..." : "Ask about Physical AI or select text..."}
                      className="chat-textarea"
                      disabled={isLoading}
                      autoFocus
                      rows={1}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="send-button"
                      title="Send message"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Normal mode: Floating chat button and modal
        <>
          {/* Floating chat button */}
          <button
            onClick={toggleChat}
            className="chat-button"
            aria-label="Open chat"
            title="Physical AI Assistant"
          >
            🤖
          </button>

          {/* Chat modal */}
          {isOpen && (
            <div className="chat-modal">
              <div className="chat-header">
                <div className="chat-header-left">
                  <div className="chat-header-icon">🤖</div>
                  <div className="chat-header-title">Physical AI Assistant</div>
                </div>
                <div className="chat-header-right">
                  <button
                    onClick={clearChat}
                    className="chat-header-button"
                    title="New Chat"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Messages container */}
              <div className="chat-messages">
                {error && (
                  <div className="p-3 rounded-lg mb-4 bg-red-100 border border-red-200 text-red-800">
                    <div className="flex items-start">
                      <div className="mr-2">⚠️</div>
                      <div className="text-sm">{error}</div>
                    </div>
                  </div>
                )}
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="flex justify-center mb-4">
                      <div className="text-4xl">🤖</div>
                    </div>
                    <p className="font-medium">Ask me anything about the book!</p>
                    {selectedText && (
                      <div className="text-xs mt-3 p-3 rounded-lg bg-blue-100 border border-blue-200">
                        <p className="font-medium mb-1 text-blue-800">Selected text:</p>
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
                        className={`${
                          message.role === 'user'
                            ? 'message-user'
                            : 'message-ai'
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">{message.content}</div>
                        <div className={`text-xs mt-1 opacity-70`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="typing-indicator">
                        <span>Thinking</span>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input area */}
              <div className="chat-input-area">
                {selectedText && (
                  <div className="selected-text-chip">
                    <div className="selected-text-chip-content">
                      Using: "{selectedText.substring(0, 50)}{selectedText.length > 50 ? '...' : ''}"
                    </div>
                    <button
                      onClick={() => setSelectedText('')}
                      className="selected-text-chip-close"
                      title="Remove selection"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="flex flex-col space-y-2">
                  <div className="flex">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={selectedText ? "Ask about selected text..." : "Ask about Physical AI or select text..."}
                      className="chat-textarea"
                      disabled={isLoading}
                      autoFocus
                      rows={1}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="send-button"
                      title="Send message"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default BookChat;