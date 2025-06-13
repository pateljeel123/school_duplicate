require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Use environment variable for API key instead of hardcoded value
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

let chatHistory = [];

app.post('/teacher-chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    
    // Add user message to history
    chatHistory.push({
      role: 'user',
      content: userMessage
    });
    // Call Mistral API
    const response = await axios.post(MISTRAL_API_URL, {
      model: 'mistral-small-latest', // Updated from mistral-tiny which is being deprecated
      messages: chatHistory
    }, {
      headers: {
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const aiResponse = response.data.choices[0].message.content;
    
    // Add AI response to history
    chatHistory.push({
      role: 'assistant',
      content: aiResponse
    });
    
    res.json({ history: chatHistory });
    
  } catch (error) {
    console.error('Error calling Mistral API:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Generate a lesson plan using Mistral AI
app.post('/generate-lesson-plan', async (req, res) => {
  
  try {
    const { templateType, topicName, duration } = req.body;
    
    if (!templateType || !topicName || !duration) {
      return res.status(400).json({ success: false, message: 'Missing required parameters: templateType, topicName, or duration' });
    }
    
    // Construct a prompt based on the template type and user's request for more detail
    let prompt = `Generate a detailed lesson plan for a ${duration}-minute lesson on "${topicName}" using the "${templateType}" teaching approach. `;
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
        model: 'mistral-small-latest', // Updated from mistral-tiny which is being deprecated
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
      console.log('Parsed lesson plan:', parsedLessonPlan);
      
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

    // Remove this duplicate res.json call
    // console.log('Sending lesson plan:', parsedLessonPlan);
    // res.json({ success: true, lessonPlan: parsedLessonPlan, message: 'Lesson plan generated successfully' });
    
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    res.status(500).json({ success: false, message: 'Failed to generate lesson plan' });
  }
});

// Get lesson plans for a specific teacher
app.get('/lesson-plans/teacher/:id', async (req, res) => {
  try {
    const teacherId = req.params.id;
    
    // For now, return a mock response since we don't have a database connection
    // In a real application, you would query the database for lesson plans
    res.json({
      success: true,
      lessonPlans: [
        {
          id: 1,
          title: 'Introduction to Photosynthesis',
          subject: 'Biology',
          grade: '8th Grade',
          duration: '45 minutes',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Understanding Fractions',
          subject: 'Mathematics',
          grade: '5th Grade',
          duration: '30 minutes',
          createdAt: new Date().toISOString()
        }
      ]
    });
    
  } catch (error) {
    console.error('Error fetching lesson plans:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch lesson plans' });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Teacher server running on port ${PORT}`);
  console.log(`📝 API Endpoints available:`);
  console.log(`   - POST /teacher-chat - Send messages to teacher assistant`);
  console.log(`   - POST /generate-lesson-plan - Generate lesson plans with AI`);
});