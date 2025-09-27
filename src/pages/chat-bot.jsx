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
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const BASE_URL = "http://127.0.0.1:5000"; // Updated backend URL

const LegalChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content:
        "Hello! I'm Vakil Setu AI, your legal assistant . I can help you with legal queries, case information, and connect you with qualified advocates. How can I assist you today?",
      timestamp: new Date(),
      categories: ['greeting'],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`${BASE_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      
      if (response.ok) {
        setIsConnected(true);
        console.log('✅ Connected to Gemini backend');
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      setIsConnected(false);
      console.error('❌ Backend connection failed:', error);
    }
  };

  const quickSuggestions = [
    { text: 'Find an advocate', icon: User, category: 'search' },
    { text: 'Legal document help', icon: FileText, category: 'document' },
    { text: 'Court procedures', icon: Gavel, category: 'procedure' },
    { text: 'Legal rights info', icon: Shield, category: 'rights' },
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: currentInput }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const botResponse = data?.choices?.[0]?.message?.content || 
                         "⚠️ No response from AI";

      const categories = categorizeResponse(botResponse, currentInput);

      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: botResponse,
        timestamp: new Date(),
        categories: categories,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsConnected(true);

    } catch (error) {
      console.error("❌ Chat error:", error);
      setIsConnected(false);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: "❌ Error: Could not connect to AI server. Please make sure your Python chatbot is running with 'python chatbot.py'",
        timestamp: new Date(),
        categories: ["error"],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const categorizeResponse = (botResponse, userQuery) => {
    const categories = [];
    const lowerQuery = userQuery.toLowerCase();
    if (lowerQuery.includes('advocate') || lowerQuery.includes('lawyer') || lowerQuery.includes('attorney')) categories.push('advocate-search');
    if (lowerQuery.includes('document') || lowerQuery.includes('paper') || lowerQuery.includes('form')) categories.push('documents');
    if (lowerQuery.includes('court') || lowerQuery.includes('procedure') || lowerQuery.includes('process')) categories.push('court-procedure');
    if (lowerQuery.includes('rights') || lowerQuery.includes('law') || lowerQuery.includes('legal')) categories.push('legal-rights');
    if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('fee')) categories.push('pricing');
    return categories.length > 0 ? categories : ['ai-response'];
  };

  const handleQuickSuggestion = (suggestion) => {
    setInputValue(suggestion.text);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getCategoryColor = (categories) => {
    if (categories?.includes('advocate-search')) return 'bg-blue-100 text-blue-800';
    if (categories?.includes('documents')) return 'bg-green-100 text-green-800';
    if (categories?.includes('court-procedure')) return 'bg-purple-100 text-purple-800';
    if (categories?.includes('legal-rights')) return 'bg-orange-100 text-orange-800';
    if (categories?.includes('pricing')) return 'bg-yellow-100 text-yellow-800';
    if (categories?.includes('error')) return 'bg-red-100 text-red-800';
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
                  Your Legal Assistant
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={checkBackendConnection} className="p-2" title="Test connection to Gemini backend">
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Badge variant={isConnected ? "secondary" : "destructive"} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {!isConnected && (
          <Card className="mb-4 border-orange-200 bg-orange-50">
            <CardContent className="p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <p className="text-sm text-orange-800">
                <span className="font-medium">Backend Disconnected:</span> Make sure your Python chatbot is running with: 
                <code className="ml-1 px-2 py-1 bg-orange-100 rounded text-xs">python chatbot.py</code>
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="legal-card flex-1 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-lg p-3 ${message.type === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'}`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    {message.categories && message.type === 'bot' && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className={`text-xs ${getCategoryColor([category])}`}>
                            {category}
                          </Badge>
                        ))}
                      </div>
                    )}
                  
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
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">Vakil Setu is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && (
              <div className="p-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">Quick suggestions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <Button key={index} variant="outline" size="sm" onClick={() => handleQuickSuggestion(suggestion)} className="justify-start gap-2 h-auto p-3">
                      <suggestion.icon className="w-4 h-4" />
                      <span className="text-xs">{suggestion.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t border-border flex flex-col gap-2">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your legal question here..."
                  className="legal-input flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isTyping}
                />
                <Button onClick={handleSendMessage} className="legal-button px-3" disabled={!inputValue.trim() || isTyping}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <AlertCircle className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  This AI assistant powered by Google Gemini provides general legal information only. For specific legal advice, consult with a qualified advocate.
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
