import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Scale, 
  Send, 
  Bot, 
  User, 
  Clock,
  FileText,
  Gavel,
  Shield,
  AlertCircle
} from 'lucide-react';

const LegalChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content:
        "Hello! I'm Vakil Setu AI, your legal assistant. I can help you with legal queries, case information, and connect you with qualified advocates. How can I assist you today?",
      timestamp: new Date(),
      categories: ['greeting'],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickSuggestions = [
    { text: 'Find an advocate', icon: User, category: 'search' },
    { text: 'Legal document help', icon: FileText, category: 'document' },
    { text: 'Court procedures', icon: Gavel, category: 'procedure' },
    { text: 'Legal rights info', icon: Shield, category: 'rights' },
  ];

  // 🔹 Call backend API (which talks to LM Studio)
  const getBotResponse = async (userMessage) => {
    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are Vakil Setu AI, a legal assistant chatbot.' },
            { role: 'user', content: userMessage },
          ],
        }),
      });

      const data = await response.json();
      return {
        content: data?.choices?.[0]?.message?.content || '⚠️ No response from AI',
        categories: ['ai-response'],
      };
    } catch (error) {
      console.error('Error fetching bot response:', error);
      return {
        content: '❌ Error: Could not connect to AI server.',
        categories: ['error'],
      };
    }
  };

const handleSendMessage = async () => {
  if (!inputValue.trim()) return;

  const userMessage = {
    id: Date.now(),
    type: "user",
    content: inputValue,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputValue("");
  setIsTyping(true);

  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: inputValue }],
      }),
    });

    const data = await response.json();

    // LM Studio format: data.choices[0].message.content
    const botMessage = {
      id: Date.now() + 1,
      type: "bot",
      content: data?.choices?.[0]?.message?.content || "⚠️ No response from AI",
      timestamp: new Date(),
      categories: ["ai-response"],
    };

    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error("❌ Chat error:", error);
    const errorMessage = {
      id: Date.now() + 1,
      type: "bot",
      content: "⚠️ Error: Could not connect to AI server.",
      timestamp: new Date(),
      categories: ["error"],
    };
    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    setIsTyping(false);
  }
};

  const handleQuickSuggestion = (suggestion) => {
    setInputValue(suggestion.text);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getCategoryColor = (categories) => {
    if (categories?.includes('advocate-search'))
      return 'bg-blue-100 text-blue-800';
    if (categories?.includes('documents'))
      return 'bg-green-100 text-green-800';
    if (categories?.includes('court-procedure'))
      return 'bg-purple-100 text-purple-800';
    if (categories?.includes('legal-rights'))
      return 'bg-orange-100 text-orange-800';
    if (categories?.includes('pricing'))
      return 'bg-yellow-100 text-yellow-800';
    if (categories?.includes('error'))
      return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen legal-gradient p-4">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <Card className="legal-card mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Scale className="w-6 h-6 text-primary" />
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Vakil Setu AI</h1>
                <p className="text-sm text-muted-foreground font-normal">
                  Your Legal Assistant - Always Available
                </p>
              </div>
              <div className="ml-auto">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Online
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Messages */}
        <Card className="legal-card flex-1 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>

                    {message.categories && message.type === 'bot' && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.categories.map((category, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className={`text-xs ${getCategoryColor([category])}`}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        AI is typing...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 1 && (
              <div className="p-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">Quick suggestions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSuggestion(suggestion)}
                      className="justify-start gap-2 h-auto p-3"
                    >
                      <suggestion.icon className="w-4 h-4" />
                      <span className="text-xs">{suggestion.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your legal question here..."
                  className="legal-input flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  className="legal-button px-3"
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <AlertCircle className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  This AI assistant provides general legal information only. For specific legal advice, consult with a qualified advocate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalChatbot;
