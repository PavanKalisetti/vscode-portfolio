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
  const [debugInfo, setDebugInfo] = useState({});
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const genAIRef = useRef(null);
  const modelRef = useRef(null);
  
  // Log environment info on mount
  useEffect(() => {
    const browserInfo = {
      userAgent: navigator.userAgent,
      isSecureContext: window.isSecureContext,
      hasWebSpeechAPI: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
      hasSpeechSynthesis: 'speechSynthesis' in window,
      url: window.location.href,
      protocol: window.location.protocol,
      hostname: window.location.hostname
    };
    
    console.log('Environment information:', browserInfo);
    setDebugInfo(browserInfo);
  }, []);
  
  // Initialize Gemini AI
  useEffect(() => {
    if (apiKey) {
      try {
        console.log('Initializing Gemini AI with API key');
        genAIRef.current = new GoogleGenerativeAI(apiKey);
        updateModel();
      } catch (err) {
        console.error('Error initializing Gemini AI:', err);
        setError('Error initializing Gemini AI. Please check your API key.');
      }
    } else {
      console.error('No API key provided for Gemini AI');
    }
  }, [apiKey]);
  
  // Update model with system prompt
  const updateModel = () => {
    try {
      if (!genAIRef.current) {
        console.error('Gemini AI reference is not initialized');
        return;
      }
      
      console.log('Configuring Gemini model with system prompt:', systemPrompt.substring(0, 50) + '...');
      
      // Configure model with system prompt
      modelRef.current = genAIRef.current.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        systemInstruction: systemPrompt
      });
      
      console.log('Gemini model configured successfully');
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
    // Detailed logging about speech recognition availability
    if ('SpeechRecognition' in window) {
      console.log('Native SpeechRecognition API is available');
    } else if ('webkitSpeechRecognition' in window) {
      console.log('Webkit SpeechRecognition API is available');
    } else {
      console.error('SpeechRecognition API is not available in this browser');
      setError('Speech recognition is not supported in this browser. Please use text input instead.');
      return;
    }
    
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      console.log('Creating SpeechRecognition instance');
      
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      console.log('SpeechRecognition instance created successfully');
      
      recognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript;
        console.log('Speech recognition successful, transcript:', text);
        console.log('Speech confidence level:', event.results[0][0].confidence);
        setTranscript(text);
        setIsListening(false);
        processWithGemini(text);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', {
          error: event.error,
          message: event.message,
          timeStamp: event.timeStamp,
          type: 'error',
          isTrusted: event.isTrusted,
          secureContext: window.isSecureContext,
          fullEvent: JSON.stringify(event)
        });
        
        if (event.error === 'network') {
          console.error('Network error details:', {
            online: navigator.onLine,
            protocol: window.location.protocol,
            hostname: window.location.hostname
          });
          setError('Network error with speech recognition. This feature may not work in all environments. Please try using text input instead.');
        } else if (event.error === 'not-allowed') {
          console.error('Microphone access denied');
          setError('Microphone access denied. Please check your browser permissions and try again.');
        } else if (event.error === 'no-speech') {
          console.log('No speech detected');
          setError('No speech detected. Please try again or use text input.');
        } else {
          setError(`Speech recognition error: ${event.error}. Please try again or use text input.`);
        }
        setIsListening(false);
      };
      
      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
      };
      
      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };
      
      recognitionRef.current.onsoundstart = () => {
        console.log('Speech recognition detected sound');
      };
      
      recognitionRef.current.onsoundend = () => {
        console.log('Speech recognition sound ended');
      };
      
      recognitionRef.current.onspeechstart = () => {
        console.log('Speech recognition detected speech');
      };
      
      recognitionRef.current.onspeechend = () => {
        console.log('Speech recognition speech ended');
      };
      
      recognitionRef.current.onaudiostart = () => {
        console.log('Speech recognition audio started');
      };
      
      recognitionRef.current.onaudioend = () => {
        console.log('Speech recognition audio ended');
      };
      
      recognitionRef.current.onnomatch = () => {
        console.log('Speech recognition no match found');
      };
      
    } catch (err) {
      console.error('Error initializing speech recognition:', err);
      setError('Error initializing speech recognition. Please use text input instead.');
    }
    
    return () => {
      if (recognitionRef.current) {
        console.log('Cleaning up speech recognition');
        recognitionRef.current.abort();
      }
      if (synthRef.current && synthRef.current.speaking) {
        console.log('Canceling speech synthesis');
        synthRef.current.cancel();
      }
    };
  }, []);
  
  // Function to process text with Gemini API
  const processWithGemini = async (text) => {
    try {
      console.log('Processing text with Gemini:', text);
      setIsProcessing(true);
      
      if (!modelRef.current) {
        console.error('Gemini API model is not initialized');
        throw new Error('Gemini API model is not initialized');
      }
      
      console.log('Sending request to Gemini API');
      // Generate content
      const result = await modelRef.current.generateContent(text);
      console.log('Received response from Gemini API');
      
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
      try {
        if (synthRef.current.speaking) {
          console.log('Canceling previous speech synthesis');
          synthRef.current.cancel();
        }
        
        console.log('Starting speech synthesis');
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onstart = () => {
          console.log('Speech synthesis started');
        };
        
        utterance.onend = () => {
          console.log('Speech synthesis ended');
          setIsSpeaking(false);
        };
        
        utterance.onerror = (err) => {
          console.error('Speech synthesis error:', err);
          setIsSpeaking(false);
        };
        
        synthRef.current.speak(utterance);
      } catch (err) {
        console.error('Error in speech synthesis:', err);
        setIsSpeaking(false);
      }
    } else {
      console.error('Speech synthesis not available');
    }
  };
  
  // Toggle listening state
  const toggleListening = () => {
    if (isListening) {
      console.log('Stopping speech recognition');
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      console.log('Starting speech recognition');
      setError('');
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        setError(`Error starting speech recognition: ${err.message}`);
      }
    }
  };
  
  // Stop speaking
  const stopSpeaking = () => {
    if (synthRef.current && synthRef.current.speaking) {
      console.log('Stopping speech synthesis');
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
      console.log('Submitting text input:', textInput);
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
        
        {/* Add debug info section in development mode */}
        {import.meta.env.DEV && (
          <div className="debug-info">
            <h3>Debug Information</h3>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
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