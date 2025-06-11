require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const PORT = 3000;
let history = [];

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

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
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || 'sk-or-v1-9a4a1c2f5f9a4c2f9a4a1c2f5f9a4c2f9a4a1c2f5f9a4c2f'}`,
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

// Enhanced chat endpoint with improved response formatting
app.post('/chat', upload.single('image'), async (req, res) => {
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

  history.push(userMessage);

  try {
    // Include image analysis in the message if available
    const combinedMessage = imageUrl 
      ? `${message}\n[Image Analysis: ${imageAnalysis}]`
      : message;

    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small',
        messages: history.map(({ role, content, image, imageAnalysis }) => ({
          role,
          content: image ? `${content}\n[Image Analysis: ${imageAnalysis}]` : content
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY || 'h4fxd9juHwPuRpXoqh2pTzMSxzBl0Vzy'}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const assistantReply = response.data.choices[0].message.content;

    history.push({ role: 'assistant', content: assistantReply });
    res.json({ 
      success: true,
      reply: assistantReply, 
      history,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('There was an error processing your request. Please try again later.');
  }
});


// Get conversation history
app.get('/history', (req, res) => {
  res.json({ 
    success: true,
    history,
    message: "Conversation history retrieved successfully"
  });
});

// In-memory storage for lesson plans (in a real app, this would be a database)
let lessonPlans = [];

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

app.listen(PORT, () => {
  console.log(`✅ Student WebMind Server running successfully at http://localhost:${PORT}`);
  console.log(`📝 API Endpoints available:`);
  console.log(`   - POST /chat - Send messages and images`);
  console.log(`   - GET /history - View conversation history`);
  console.log(`   - POST /lesson-plans - Create a new lesson plan`);
  console.log(`   - GET /lesson-plans/teacher/:teacherId - Get all lesson plans for a teacher`);
  console.log(`   - GET /lesson-plans/:planId - Get a specific lesson plan`);
  console.log(`   - PUT /lesson-plans/:planId - Update a lesson plan`);
  console.log(`   - DELETE /lesson-plans/:planId - Delete a lesson plan`);
});
