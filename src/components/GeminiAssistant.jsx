import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './GeminiAssistant.css';

const GeminiAssistant = ({ apiKey }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful, your name is pavan, professional assistant for a portfolio website. Provide concise, accurate information about web development, programming, and career topics. Be friendly and conversational in tone. If you don't know something, admit it rather than making up information."
  );
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [textInput, setTextInput] = useState('');
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const genAIRef = useRef(null);
  const modelRef = useRef(null);
  
  // Initialize Gemini AI
  useEffect(() => {
    if (apiKey) {
      try {
        genAIRef.current = new GoogleGenerativeAI(apiKey);
        updateModel();
      } catch (err) {
        console.error('Error initializing Gemini AI:', err);
        setError('Error initializing Gemini AI. Please check your API key.');
      }
    }
  }, [apiKey]);
  
  // Update model with system prompt
  const updateModel = () => {
    try {
      if (!genAIRef.current) return;
      
      // Configure model with system prompt
      modelRef.current = genAIRef.current.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        systemInstruction: systemPrompt
      });
    } catch (err) {
      console.error('Error configuring model:', err);
      setError('Error configuring AI model. Please try again.');
    }
  };
  
  // Update model when system prompt changes
  useEffect(() => {
    updateModel();
  }, [systemPrompt]);
  
  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript;
        console.log('Speech to text conversion:', text); // Console log the speech to text conversion
        setTranscript(text);
        setIsListening(false);
        processWithGemini(text);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'network') {
          setError('Network error with speech recognition. This feature may not work in all environments. Please try using text input instead.');
        } else {
          setError(`Speech recognition error: ${event.error}. Please try again or use text input.`);
        }
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Speech recognition is not supported in this browser. Please use text input instead.');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.cancel();
      }
    };
  }, []);
  
  // Function to process text with Gemini API
  const processWithGemini = async (text) => {
    try {
      setIsProcessing(true);
      
      if (!modelRef.current) {
        throw new Error('Gemini API model is not initialized');
      }
      
      // Generate content
      const result = await modelRef.current.generateContent(text);
      const response = result.response;
      const aiResponse = response.text();
      
      console.log('Gemini AI response:', aiResponse);
      
      // Update state
      setResponse(aiResponse);
      setConversationHistory(prev => [...prev, { question: text, answer: aiResponse }]);
      setIsProcessing(false);
      
      // Convert response to speech
      speakResponse(aiResponse);
    } catch (err) {
      console.error('Error processing with Gemini:', err);
      setError(`Error: ${err.message}`);
      setIsProcessing(false);
    }
  };
  
  // Function to convert text to speech
  const speakResponse = (text) => {
    if (synthRef.current) {
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
      
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = (err) => {
        console.error('Speech synthesis error', err);
        setIsSpeaking(false);
      };
      
      synthRef.current.speak(utterance);
    }
  };
  
  // Toggle listening state
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError('');
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };
  
  // Stop speaking
  const stopSpeaking = () => {
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };
  
  // Handle system prompt change
  const handleSystemPromptChange = (e) => {
    setSystemPrompt(e.target.value);
  };
  
  // Toggle system prompt visibility
  const toggleSystemPrompt = () => {
    setShowSystemPrompt(!showSystemPrompt);
  };

  // Add a handler for text input change
  const handleTextInputChange = (e) => {
    setTextInput(e.target.value);
  };

  // Add a handler for text input submit
  const handleTextInputSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      setTranscript(textInput);
      processWithGemini(textInput);
      setTextInput('');
    }
  };

  return (
    <div className="gemini-assistant">
      <div className="gemini-header">
        <h2>Gemini AI Assistant</h2>
        <button 
          className="system-prompt-toggle" 
          onClick={toggleSystemPrompt}
        >
          {showSystemPrompt ? 'Hide System Prompt' : 'Show System Prompt'}
        </button>
        {error && <div className="error-message">{error}</div>}
      </div>
      
      {showSystemPrompt && (
        <div className="system-prompt-container">
          <label htmlFor="system-prompt">System Prompt:</label>
          <textarea
            id="system-prompt"
            value={systemPrompt}
            onChange={handleSystemPromptChange}
            className="system-prompt-textarea"
            rows={4}
            placeholder="Enter system instructions for the AI..."
          />
          <div className="system-prompt-info">
            <span>The system prompt defines how the AI assistant behaves. Edit it to change the assistant's personality or specialized knowledge.</span>
          </div>
        </div>
      )}
      
      <div className="conversation-container">
        {conversationHistory.map((item, index) => (
          <React.Fragment key={index}>
            <div className="user-message">
              <div className="message-avatar user">You</div>
              <div className="message-content">{item.question}</div>
            </div>
            <div className="ai-message">
              <div className="message-avatar ai">AI</div>
              <div className="message-content">{item.answer}</div>
            </div>
          </React.Fragment>
        ))}
        
        {transcript && !conversationHistory.find(item => item.question === transcript) && (
          <div className="user-message">
            <div className="message-avatar user">You</div>
            <div className="message-content">{transcript}</div>
          </div>
        )}
        
        {response && !conversationHistory.find(item => item.answer === response) && (
          <div className="ai-message">
            <div className="message-avatar ai">AI</div>
            <div className="message-content">{response}</div>
          </div>
        )}
        
        {isProcessing && (
          <div className="processing-indicator">
            <div className="spinner"></div>
            <span>Processing your request...</span>
          </div>
        )}
      </div>
      
      <div className="input-control-panel">
        <form onSubmit={handleTextInputSubmit} className="text-input-form">
          <input
            type="text"
            value={textInput}
            onChange={handleTextInputChange}
            placeholder="Type your message here..."
            className="text-input"
            disabled={isProcessing}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={isProcessing || !textInput.trim()}
          >
            Send
          </button>
        </form>
        
        <div className="control-panel">
          <button 
            className={`mic-button ${isListening ? 'listening' : ''}`} 
            onClick={toggleListening}
            disabled={isProcessing}
          >
            {isListening ? 'Stop Listening' : 'Start Listening'}
            <span className="mic-icon">{isListening ? '🔴' : '🎤'}</span>
          </button>
          
          {isSpeaking && (
            <button className="stop-button" onClick={stopSpeaking}>
              Stop Speaking
              <span className="stop-icon">🔇</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeminiAssistant; 