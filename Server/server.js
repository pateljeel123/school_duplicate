require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import routes
const authRoutes = require('./Routes/auth.routes');

// Initialize Express app
const app = express();

// Define ports
const PORT = process.env.PORT || 5000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

// Multer config for file uploads with disk storage
const diskStorage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const uploadToDisk = multer({ storage: diskStorage });

// Multer config for memory storage (for base64 processing)
const memoryStorage = multer.memoryStorage();
const uploadToMemory = multer({ storage: memoryStorage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);

// In-memory storage
let studentChatHistory = [];
let teacherChatHistory = [];
let lessonPlans = [];

// =================== HELPER FUNCTIONS ===================

// Image analysis using OpenRouter API
async function analyzeImage(imageUrl) {
  try {
    // Get the image file path from URL
    const imagePath = path.join(__dirname, imageUrl.replace(`http://localhost:${PORT}`, ''));
    
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
          'Authorization': `Bearer ${OPENROUTER_API_KEY || 'sk-or-v1-9a4a1c2f5f9a4c2f9a4a1c2f5f9a4c2f9a4a1c2f5f9a4c2f'}`,
          'HTTP-Referer': `http://localhost:${PORT}`,
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

// Cleanup uploaded files periodically
setInterval(() => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  fs.readdir('uploads/', (err, files) => {
    if (err) return;
    files.forEach(file => {
      const filePath = path.join('uploads/', file);
      const stat = fs.statSync(filePath);
      if (now - stat.mtimeMs > oneHour) {
        fs.unlinkSync(filePath);
      }
    });
  });
}, 60 * 60 * 1000);

// =================== STUDENT ENDPOINTS ===================

// Enhanced chat endpoint with improved response formatting
app.post('/chat', uploadToDisk.single('image'), async (req, res) => {
  const message = req.body.message;
  let imageUrl = null;
  let imageAnalysis = null;

  if (req.file) {
    imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    imageAnalysis = await analyzeImage(imageUrl);
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
    res.status(500).send('There was an error processing your request. Please try again later.');
  }
});

// Get student conversation history
app.get('/history', (req, res) => {
  res.json({ 
    success: true,
    history: studentChatHistory,
    message: "Conversation history retrieved successfully"
  });
});

// =================== TEACHER ENDPOINTS ===================

// Teacher chat endpoint
app.post('/teacher-chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
 
    
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
    
    res.json({ history: teacherChatHistory });
    
  } catch (error) {
    console.error('Error calling Mistral API:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// =================== LESSON PLAN ENDPOINTS ===================

// Create a new lesson plan
app.post('/lesson-plans', (req, res) => {
  try {
    const newPlan = {
      id: Date.now().toString(), // Generate a unique ID
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    lessonPlans.push(newPlan);
    
    res.status(201).json({
      success: true,
      lessonPlan: newPlan,
      message: "Lesson plan created successfully"
    });
  } catch (error) {
    console.error('Error creating lesson plan:', error);
    res.status(500).json({
      success: false,
      message: "Failed to create lesson plan"
    });
  }
});

// Get all lesson plans for a teacher
app.get('/lesson-plans/teacher/:teacherId', (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacherPlans = lessonPlans.filter(plan => plan.teacherId === teacherId);
    
    res.json({
      success: true,
      lessonPlans: teacherPlans,
      message: "Lesson plans retrieved successfully"
    });
  } catch (error) {
    console.error('Error fetching lesson plans:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lesson plans"
    });
  }
});

// Get a specific lesson plan by ID
app.get('/lesson-plans/:planId', (req, res) => {
  try {
    const { planId } = req.params;
    const plan = lessonPlans.find(p => p.id === planId);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Lesson plan not found"
      });
    }
    
    res.json({
      success: true,
      lessonPlan: plan,
      message: "Lesson plan retrieved successfully"
    });
  } catch (error) {
    console.error('Error fetching lesson plan:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lesson plan"
    });
  }
});

// Update a lesson plan
app.put('/lesson-plans/:planId', (req, res) => {
  try {
    const { planId } = req.params;
    const planIndex = lessonPlans.findIndex(p => p.id === planId);
    
    if (planIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Lesson plan not found"
      });
    }
    
    // Update the plan
    lessonPlans[planIndex] = {
      ...lessonPlans[planIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      lessonPlan: lessonPlans[planIndex],
      message: "Lesson plan updated successfully"
    });
  } catch (error) {
    console.error('Error updating lesson plan:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update lesson plan"
    });
  }
});

// Delete a lesson plan
app.delete('/lesson-plans/:planId', (req, res) => {
  try {
    const { planId } = req.params;
    const initialLength = lessonPlans.length;
    
    lessonPlans = lessonPlans.filter(p => p.id !== planId);
    
    if (lessonPlans.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Lesson plan not found"
      });
    }
    
    res.json({
      success: true,
      message: "Lesson plan deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting lesson plan:', error);
    res.status(500).json({
      success: false,
      message: "Failed to delete lesson plan"
    });
  }
});

// Generate a lesson plan using Mistral AI
app.post('/generate-lesson-plan', async (req, res) => {
  try {
    const { templateType, topicName, duration, language } = req.body;
    
    if (!templateType || !topicName || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: templateType, topicName, or duration'
      });
    }
    
    // Construct a prompt based on the template type and user's request for more detail
    let prompt = `Generate a detailed lesson plan for a ${duration}-minute lesson on "${topicName}" using the "${templateType}" teaching approach. `;
    
    // Add language preference if specified
    if (language && language !== 'English') {
      prompt += `Please generate the lesson plan in ${language}. `;
    }
    
    prompt += 'Make the lesson plan engaging by incorporating the following elements: ';
    prompt += '1. Facts and figures: Include 3-5 relevant statistics, data points, or interesting facts about the topic. ';
    prompt += '2. Storytelling: Include a short, engaging narrative or anecdote related to the topic that captures student interest. ';
    prompt += '3. Real-world examples: Provide 2-3 concrete, relatable examples showing how the topic applies in real-life situations. ';
    prompt += '4. Practice exercises: Include 2-3 hands-on activities or exercises for students to apply what they have learned. ';
    prompt += 'The lesson plan should include the following sections: ';
    prompt += '1. Learning objectives (3-5 specific, measurable goals), ';
    prompt += '2. Required materials (list all necessary items), ';
    prompt += '3. A breakdown of activities with time allocations (ensure they fit within the total duration), ';
    prompt += '4. Assessment strategies (how you will measure student understanding), ';
    prompt += '5. Homework or follow-up activities. ';
    prompt += 'Format the response as a structured JSON object with these sections, including the additional elements (factsAndFigures, story, realWorldExamples, practiceExercises).';
    
    // Call Mistral API
    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: 'You are an expert educational consultant specializing in curriculum development and lesson planning. You create engaging, well-structured lesson plans that incorporate facts and figures, storytelling elements, real-world examples, and practical exercises to maximize student engagement and learning outcomes.' },
          { role: 'user', content: prompt }
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    const generatedLessonPlan = response.data.choices[0].message.content;
     
    // Clean the response to remove markdown code block syntax and extract JSON content
    let cleanedLessonPlan = generatedLessonPlan;
    
    // First, try to extract JSON from markdown code blocks
    if (generatedLessonPlan.includes('```json')) {
      const jsonMatch = generatedLessonPlan.match(/```json\s*([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        cleanedLessonPlan = jsonMatch[1].trim();
      } else {
        cleanedLessonPlan = generatedLessonPlan.replace(/```json\s*|```\s*$/g, '');
      }
    } else {
      // If no code blocks, try to find JSON object in the text
      const jsonStartIndex = generatedLessonPlan.indexOf('{');
      const jsonEndIndex = generatedLessonPlan.lastIndexOf('}');
      
      if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
        cleanedLessonPlan = generatedLessonPlan.substring(jsonStartIndex, jsonEndIndex + 1);
      }
    }
    
    // Validate that the cleaned content is valid JSON
    let parsedLessonPlan;
    try {
      parsedLessonPlan = JSON.parse(cleanedLessonPlan);
      
      // Send the parsed JSON object directly
      res.json({ success: true, lessonPlan: parsedLessonPlan, message: 'Lesson plan generated successfully' });
    } catch (error) {
      console.warn('Could not parse response as JSON, returning raw content');
      // If not valid JSON, create a simple JSON structure with the content
      parsedLessonPlan = {
        title: 'AI Generated Lesson Plan',
        content: generatedLessonPlan
      };
      
      // Send the fallback JSON object
      res.json({ success: true, lessonPlan: parsedLessonPlan, message: 'Lesson plan generated successfully' });
    }
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    res.status(500).json({ success: false, message: 'Failed to generate lesson plan' });
  }
});

// =================== MEDICAL ENDPOINTS ===================

// Analyze X-ray (base64)
app.post('/api/analyze-xray', uploadToMemory.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No X-ray image uploaded' });
    }

    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "meta-llama/llama-4-maverick:free",
        messages: [
          {
            role: "system",
            content: "You are a medical diagnostic assistant specialized in radiology. Analyze X-ray images and provide professional findings in medical terminology. Be concise and focus on abnormalities, potential diagnoses, and recommended next steps."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Please analyze this X-ray image and provide a diagnostic report." },
              { type: "image_url", image_url: { url: base64Image } }
            ]
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'Medical Diagnosis App'
        }
      }
    );

    res.json({
      report: response.data.choices[0].message.content
    });
  } catch (error) {
    console.error('X-ray Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to analyze X-ray' });
  }
});

// Medical Chat
app.post('/api/medical-chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "meta-llama/llama-4-maverick:free",
        messages: [
          {
            role: "system",
            content: "You are a medical professional assisting doctors with diagnosis. Provide concise, professional answers using medical terminology. Focus on accuracy and clinical relevance."
          },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'Medical Diagnosis App'
        }
      }
    );

    res.json({
      message: response.data.choices[0].message.content
    });
  } catch (error) {
    console.error('Medical Chat Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to process medical query' });
  }
});

// General Image Reader (base64)
app.post('/api/read-image', uploadToMemory.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const { prompt } = req.body;
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "meta-llama/llama-4-maverick:free",
        messages: [
          {
            role: "system",
            content: "You are an intelligent visual assistant. You can analyze, describe, and interpret any image using natural language."
          },
          {
            role: "user",
            content: [
              { type: "text", text: prompt || "What's in this image?" },
              { type: "image_url", image_url: { url: base64Image } }
            ]
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'Image Reader AI'
        }
      }
    );

    res.json({
      description: response.data.choices[0].message.content
    });
  } catch (error) {
    console.error('Image Read Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Image reading failed' });
  }
});

// =================== Start Server ===================
app.listen(PORT, () => {
  console.log(`✅ Unified Server running at http://localhost:${PORT}`);
  console.log(`📝 API Endpoints available:`);
  console.log(`   - POST /chat - Send messages and images to student assistant`);
  console.log(`   - GET /history - View student conversation history`);
  console.log(`   - POST /teacher-chat - Send messages to teacher assistant`);
  console.log(`   - POST /generate-lesson-plan - Generate lesson plans with AI`);
  console.log(`   - POST /lesson-plans - Create a new lesson plan`);
  console.log(`   - GET /lesson-plans/teacher/:teacherId - Get all lesson plans for a teacher`);
  console.log(`   - GET /lesson-plans/:planId - Get a specific lesson plan`);
  console.log(`   - PUT /lesson-plans/:planId - Update a lesson plan`);
  console.log(`   - DELETE /lesson-plans/:planId - Delete a lesson plan`);
  console.log(`   - POST /api/analyze-xray - Analyze X-ray images`);
  console.log(`   - POST /api/medical-chat - Medical chat assistant`);
  console.log(`   - POST /api/read-image - General image analysis`);
  console.log(`   - /api/auth/* - Authentication endpoints`);
});
