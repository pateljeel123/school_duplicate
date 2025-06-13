const axios = require('axios');
const path = require('path');
const fs = require('fs');

// In-memory storage for chat histories
let studentChatHistory = [];
let teacherChatHistory = [];

/**
 * Analyze image using OpenRouter API
 * @param {string} imageUrl - URL of the image to analyze
 * @param {number} port - Server port for URL construction
 * @param {string} apiKey - OpenRouter API key
 * @returns {Promise<string>} - Analysis result
 */
async function analyzeImage(imageUrl, port, apiKey) {
  try {
    // Get the image file path from URL
    const imagePath = path.join(__dirname, '..', imageUrl.replace(`http://localhost:${port}`, ''));
    
    // Read the image file and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    
    // Call OpenRouter API for image analysis
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "meta-llama/llama-4-maverick:free",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that helps students. Analyze images and provide useful information in a clear, engaging manner."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this image and explain it in detail." },
              { type: "image_url", image_url: { url: base64Image } }
            ]
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey || 'sk-or-v1-9a4a1c2f5f9a4c2f9a4a1c2f5f9a4c2f9a4a1c2f5f9a4c2f'}`,
          'HTTP-Referer': `http://localhost:${port}`,
          'X-Title': 'Student WebMind',
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error with image handling:", error);
    return "There was a problem analyzing the image. Please try again.";
  }
}

/**
 * Handle student chat messages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.studentChat = async (req, res) => {
  const message = req.body.message;
  const PORT = process.env.PORT || 5000;
  const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
  const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  
  let imageUrl = null;
  let imageAnalysis = null;

  if (req.file) {
    imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    imageAnalysis = await analyzeImage(imageUrl, PORT, OPENROUTER_API_KEY);
  }

  const userMessage = {
    role: 'user',
    content: message,
    ...(imageUrl && { 
      image: imageUrl,
      imageAnalysis: imageAnalysis 
    }),
  };

  studentChatHistory.push(userMessage);

  try {
    // Include image analysis in the message if available
    const combinedMessage = imageUrl 
      ? `${message}\n[Image Analysis: ${imageAnalysis}]`
      : message;

    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: 'mistral-small',
        messages: studentChatHistory.map(({ role, content, image, imageAnalysis }) => ({
          role,
          content: image ? `${content}\n[Image Analysis: ${imageAnalysis}]` : content
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY || 'h4fxd9juHwPuRpXoqh2pTzMSxzBl0Vzy'}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const assistantReply = response.data.choices[0].message.content;

    studentChatHistory.push({ role: 'assistant', content: assistantReply });
    res.json({ 
      success: true,
      reply: assistantReply, 
      history: studentChatHistory,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'There was an error processing your request. Please try again later.',
      error: err.message
    });
  }
};

/**
 * Get student chat history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getStudentChatHistory = (req, res) => {
  res.json({ 
    success: true,
    history: studentChatHistory,
    message: "Conversation history retrieved successfully"
  });
};

/**
 * Handle teacher chat messages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.teacherChat = async (req, res) => {
  try {
    const userMessage = req.body.message;
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
    const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
    
    // Add user message to history
    teacherChatHistory.push({
      role: 'user',
      content: userMessage
    });
    
    // Call Mistral API
    const response = await axios.post(MISTRAL_API_URL, {
      model: 'mistral-small-latest', // Updated from mistral-tiny which is being deprecated
      messages: teacherChatHistory
    }, {
      headers: {
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const aiResponse = response.data.choices[0].message.content;
    
    // Add AI response to history
    teacherChatHistory.push({
      role: 'assistant',
      content: aiResponse
    });
    
    res.json({ 
      success: true,
      history: teacherChatHistory,
      reply: aiResponse
    });
    
  } catch (error) {
    console.error('Error calling Mistral API:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process message',
      message: error.message 
    });
  }
};

/**
 * Get teacher chat history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getTeacherChatHistory = (req, res) => {
  res.json({ 
    success: true,
    history: teacherChatHistory,
    message: "Teacher conversation history retrieved successfully"
  });
};

/**
 * Clear student chat history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.clearStudentChatHistory = (req, res) => {
  studentChatHistory = [];
  res.json({
    success: true,
    message: "Student conversation history cleared successfully"
  });
};

/**
 * Clear teacher chat history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.clearTeacherChatHistory = (req, res) => {
  teacherChatHistory = [];
  res.json({
    success: true,
    message: "Teacher conversation history cleared successfully"
  });
};