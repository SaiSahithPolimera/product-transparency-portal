import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

app.use(cors());
app.use(express.json());

app.post('/generate-questions', async (req, res) => {
  try {
    const { productName, category, company, existingAnswers } = req.body;
    
    if (!productName || !category) {
      return res.status(400).json({
        error: 'Product name and category are required'
      });
    }
    
    const prompt = `
Generate 3-5 relevant follow-up questions for a product transparency report.

Product Details:
- Name: ${productName}
- Category: ${category}
- Company: ${company}

Existing Information: ${JSON.stringify(existingAnswers || {})}

Generate questions that would help create a comprehensive transparency report.
Focus on sustainability, sourcing, manufacturing processes, certifications, and consumer safety.

Return the response as a JSON array of objects with 'text' and 'type' fields.
Type can be: 'text', 'select', 'textarea', 'number', 'date'

For select type questions, include an 'options' array with possible answers.

Example format:
[
  {"text": "What certifications does this product have?", "type": "textarea"},
  {"text": "Carbon footprint assessment completed?", "type": "select", "options": ["Yes", "No", "In Progress"]},
  {"text": "Manufacturing date", "type": "date"},
  {"text": "Number of ingredients", "type": "number"}
]

Return only valid JSON without any markdown formatting or additional text.
`;
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    
    if (!content) {
      throw new Error('No response from Gemini AI');
    }
    
    let cleanContent = content.trim();
   
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```\n?/, '').replace(/\n?```$/, '');
    }
    
    const questions = JSON.parse(cleanContent);
   
    if (!Array.isArray(questions)) {
      throw new Error('Response is not an array');
    }
    
    const validQuestions = questions.filter(q =>
      q.text && q.type && ['text', 'select', 'textarea', 'number', 'date'].includes(q.type)
    );
   
    res.json({ questions: validQuestions });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({
      error: 'Failed to generate questions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/generate-report-content', async (req, res) => {
  try {
    const { product, answers, analysis } = req.body;
    
    if (!product || !answers) {
      return res.status(400).json({
        error: 'Product information and answers are required'
      });
    }
    
    const prompt = `
You are a professional transparency report writer. Generate comprehensive, formal content for a product transparency report.

PRODUCT INFORMATION:
- Product Name: ${product.name}
- Company: ${product.company}
- Category: ${product.category}
- Description: ${product.description || 'Not provided'}
- Submission Date: ${product.created_at}

COLLECTED DATA:
${answers.map((a: any, i: number) => `${i + 1}. Q: ${a.question_text}\n   A: ${a.value}`).join('\n')}

ANALYSIS METRICS:
- Total Data Points: ${analysis.totalDataPoints}
- Completeness Score: ${analysis.completenessScore.toFixed(1)}%
- Risk Level: ${analysis.riskLevel}
- Safety Items: ${analysis.safetyRelated}
- Compliance Items: ${analysis.complianceRelated}
- Quality Items: ${analysis.qualityRelated}
- Environmental Items: ${analysis.environmentalRelated}
- Technical Items: ${analysis.technicalRelated}

Generate the following sections for a professional transparency report. Write in a formal, objective tone suitable for regulatory and stakeholder review:

1. LEADERSHIP_MESSAGE: A message from company leadership (2-3 paragraphs) emphasizing their commitment to transparency, trust-building, and the importance of this documentation. Reference specific metrics.

2. EXECUTIVE_SUMMARY: A comprehensive executive summary (3-4 paragraphs) that:
   - Introduces the report purpose and scope
   - Highlights key assessment results and metrics
   - Summarizes main findings across all categories
   - States the report's value for stakeholders

3. TRANSPARENCY_ANALYSIS: Detailed transparency analysis (2-3 paragraphs) that:
   - Evaluates the completeness and quality of documentation
   - Discusses coverage across safety, compliance, quality, environmental, and technical categories
   - Provides context about industry standards for this product category
   - Interprets what the completeness score means

4. KEY_FINDINGS: A list of 5-8 specific, data-backed key findings based on the collected answers. Each finding should:
   - Reference specific data points from the answers
   - Highlight certifications, compliance achievements, or areas of strength
   - Be concise (1-2 sentences each)

5. COMPLIANCE_ASSESSMENT: Assessment of compliance and quality (2-3 paragraphs) covering:
   - Regulatory compliance based on documented certifications and standards
   - Quality control measures and specifications
   - How the product meets industry requirements

6. CONCLUSIONS: Final conclusions (2-3 paragraphs) that:
   - Summarize the overall transparency performance
   - Highlight key strengths in the documentation
   - Provide balanced assessment of completeness

7. RECOMMENDATIONS: 4-6 specific, actionable recommendations for:
   - Maintaining or improving transparency standards
   - Areas for enhanced documentation
   - Ongoing compliance and stakeholder engagement

Return ONLY valid JSON with this exact structure:
{
  "leadershipMessage": "text content here",
  "executiveSummary": "text content here",
  "transparencyAnalysis": "text content here",
  "keyFindings": ["finding 1", "finding 2", ...],
  "complianceAssessment": "text content here",
  "conclusions": "text content here",
  "recommendations": ["recommendation 1", "recommendation 2", ...]
}

IMPORTANT:
- Write in formal, professional language
- Reference actual data points and metrics
- Be specific about ${product.name} and ${product.company}
- Maintain objectivity and balance
- No markdown, no formatting, just plain text
- All text should be report-ready and professionally written
`;
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-pro",
      generationConfig: {
        temperature: 0.3,
      }
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let content = response.text();
    
    if (!content) {
      throw new Error('No response from Gemini AI');
    }
    
    content = content.trim();
    if (content.startsWith('```json')) {
      content = content.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/```\n?/, '').replace(/\n?```$/, '');
    }
    
    const reportContent = JSON.parse(content);
    
    const requiredFields = [
      'leadershipMessage',
      'executiveSummary',
      'transparencyAnalysis',
      'keyFindings',
      'complianceAssessment',
      'conclusions',
      'recommendations'
    ];
    
    const missingFields = requiredFields.filter(field => !reportContent[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    res.json({ reportContent });
    
  } catch (error) {
    console.error('Error generating report content:', error);
    res.status(500).json({
      error: 'Failed to generate report content',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'AI Question Generator' });
});

app.listen(PORT, () => {
  console.log(`AI Service running on port ${PORT}`);
});