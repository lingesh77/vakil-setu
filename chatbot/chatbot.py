import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

print("🚀 Initializing Vakil Setu AI Backend...")

# Flask app setup
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get API key
API_KEY = "AIzaSyAzvzEzIllugN3qcw-5Qe8dTczUBufhpko"

if not API_KEY:
    raise ValueError("⚠️ Please set your GEMINI_API_KEY")

# Configure the Gemini client
print("🤖 Configuring Gemini AI...")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.5-pro")
print("✅ Gemini AI configured successfully!")

# Store conversation history
conversations = {}

@app.route('/')
def home():
    """Home endpoint"""
    return jsonify({
        "message": "Vakil Setu AI Backend is running!",
        "status": "healthy",
        "endpoints": {
            "health": "/health",
            "chat": "/chat",
            "test": "/test"
        }
    })

@app.route('/health')
def health_check():
    """Health check endpoint for React frontend"""
    print("📡 Health check requested")
    return jsonify({
        "status": "healthy", 
        "model": "gemini-2.5-pro",
        "timestamp": datetime.now().isoformat(),
        "message": "Vakil Setu AI is ready!"
    })

@app.route('/test')
def test():
    """Simple test endpoint"""
    return jsonify({
        "message": "Backend is working perfectly!",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/chat', methods=['POST'])
def chat():
    """Main chat endpoint for React frontend"""
    try:
        print(f"📨 Chat request received from {request.remote_addr}")
        
        # Get JSON data
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data received"}), 400
        
        print(f"📝 Request data: {data}")
        
        if 'messages' not in data:
            return jsonify({"error": "Missing 'messages' field"}), 400
        
        # Extract user message
        messages = data['messages']
        user_message = ""
        
        for msg in reversed(messages):
            if msg.get('role') == 'user':
                user_message = msg.get('content', '').strip()
                break
        
        if not user_message:
            return jsonify({"error": "No user message found"}), 400
        
        print(f"💬 Processing: '{user_message}'")
        
        # Create enhanced legal prompt
        enhanced_prompt = f"""You are Vakil Setu AI, a knowledgeable legal assistant specializing in Indian law. 

User Question: {user_message}

Please provide helpful, accurate information about Indian legal matters. Keep your response:
- Informative but concise
- Focused on Indian legal context
- Include a reminder that this is general information only

Always end with a note that for specific legal advice, users should consult qualified advocates."""

        # Generate response using Gemini
        print("🤖 Generating Gemini response...")
        response = model.generate_content(enhanced_prompt)
        bot_response = response.text.strip()
        
        print(f"✅ Generated response ({len(bot_response)} chars)")
        print(f"📄 Response preview: {bot_response[:100]}...")
        
        # Return in OpenAI-compatible format for React
        result = {
            "choices": [{
                "message": {
                    "role": "assistant",
                    "content": bot_response
                },
                "finish_reason": "stop",
                "index": 0
            }],
            "created": int(datetime.now().timestamp()),
            "model": "gemini-2.5-pro",
            "object": "chat.completion"
        }
        
        return jsonify(result)
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Chat error: {error_msg}")
        
        return jsonify({
            "choices": [{
                "message": {
                    "role": "assistant",
                    "content": f"⚠️ I encountered an error: {error_msg}. Please try again."
                },
                "finish_reason": "error",
                "index": 0
            }]
        }), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🏛️  VAKIL SETU AI - LEGAL ASSISTANT BACKEND")
    print("="*60)
    print("🤖 AI Model: Google Gemini 2.5 Pro")
    print("📡 Server: Flask Development Server")
    print("🌐 CORS: Enabled for React Frontend")
    print("="*60)
    print("\n🚀 Starting server on http://localhost:5000")
    print("🔗 React Frontend can connect now!")
    print("\n📋 Available Endpoints:")
    print("   GET  /          - Home page")
    print("   GET  /health    - Health check")
    print("   GET  /test      - Simple test")
    print("   POST /chat      - Main chat endpoint")
    print("\n" + "="*60)
    
    try:
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=True,
            threaded=True
        )
    except KeyboardInterrupt:
        print("\n👋 Shutting down Vakil Setu AI Backend...")
    except Exception as e:
        print(f"\n❌ Server error: {e}")