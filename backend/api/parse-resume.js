import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { z } from 'zod';

/**
 * Resume Parser API
 * Extracts structured data from PDF resumes
 * Handles errors gracefully (file size, corrupt PDFs)
 */

// Validation schema
const resumeUploadSchema = z.object({
  fileBuffer: z.instanceof(Buffer),
  fileName: z.string(),
  fileSize: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB')
});

/**
 * Parse resume text and extract structured information
 */
function extractResumeData(text) {
  // Remove extra whitespace and normalize
  const normalized = text.replace(/\s+/g, ' ').trim();
  
  // Extract name (heuristic: first line or capitalized words at start)
  const nameMatch = normalized.match(/^([A-Z][a-z]+(?: [A-Z][a-z]+)+)/);
  const name = nameMatch ? nameMatch[1] : '';
  
  // Extract email
  const emailMatch = normalized.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  const email = emailMatch ? emailMatch[1] : '';
  
  // Extract phone
  const phoneMatch = normalized.match(/(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';
  
  // Extract experience level
  let experienceLevel = 'Entry Level';
  if (/\b(\d+)\+?\s*(years?|yrs?)\s*(of\s*)?(experience|exp)/i.test(normalized)) {
    const years = parseInt(normalized.match(/\b(\d+)\+?\s*(years?|yrs?)/i)[1]);
    if (years >= 7) experienceLevel = 'Senior Engineer';
    else if (years >= 3) experienceLevel = 'Mid-Level Engineer';
    else if (years >= 1) experienceLevel = 'Junior Engineer';
  }
  
  // Detect role from keywords
  const roleKeywords = {
    'Software Engineer': ['software', 'developer', 'programming', 'coding'],
    'Frontend Engineer': ['frontend', 'react', 'vue', 'angular', 'ui', 'ux'],
    'Backend Engineer': ['backend', 'api', 'server', 'database', 'node'],
    'Fullstack Engineer': ['fullstack', 'full stack', 'full-stack'],
    'DevOps Engineer': ['devops', 'kubernetes', 'docker', 'ci/cd', 'aws'],
    'Data Engineer': ['data engineer', 'etl', 'data pipeline', 'spark', 'hadoop'],
    'ML Engineer': ['machine learning', 'ml', 'ai', 'deep learning', 'tensorflow'],
    'Mobile Engineer': ['mobile', 'ios', 'android', 'react native', 'flutter'],
    'QA Engineer': ['qa', 'testing', 'automation', 'selenium', 'quality assurance']
  };
  
  let detectedRole = 'Software Engineer'; // default
  let maxScore = 0;
  
  for (const [role, keywords] of Object.entries(roleKeywords)) {
    const score = keywords.filter(keyword => 
      normalized.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    if (score > maxScore) {
      maxScore = score;
      detectedRole = role;
    }
  }
  
  // Extract skills
  const skillPatterns = [
    // Programming languages
    /\b(JavaScript|TypeScript|Python|Java|C\+\+|C#|Go|Rust|Ruby|PHP|Swift|Kotlin)\b/gi,
    // Frameworks
    /\b(React|Angular|Vue|Next\.js|Express|Django|Flask|Spring|Laravel|Rails)\b/gi,
    // Tools
    /\b(Docker|Kubernetes|Git|AWS|Azure|GCP|Jenkins|Terraform)\b/gi,
    // Databases
    /\b(PostgreSQL|MySQL|MongoDB|Redis|Cassandra|DynamoDB)\b/gi
  ];
  
  const skills = new Set();
  skillPatterns.forEach(pattern => {
    const matches = normalized.match(pattern);
    if (matches) matches.forEach(skill => skills.add(skill));
  });
  
  // Extract education
  const educationKeywords = ['B.Tech', 'B.E.', 'M.Tech', 'M.S.', 'PhD', 'Bachelor', 'Master', 'Computer Science', 'Engineering'];
  const education = educationKeywords.filter(keyword => 
    normalized.includes(keyword)
  );
  
  return {
    name,
    email,
    phone,
    role: detectedRole,
    experienceLevel,
    skills: Array.from(skills),
    education: education.length > 0 ? education.join(', ') : 'Not specified',
    rawText: text.slice(0, 500) // Include snippet for debugging
  };
}

/**
 * Main parsing function
 */
export async function parseResume(fileBuffer, fileName) {
  try {
    // Validate input
    const validation = resumeUploadSchema.safeParse({
      fileBuffer,
      fileName,
      fileSize: fileBuffer.length
    });
    
    if (!validation.success) {
      throw new Error(validation.error.errors[0].message);
    }
    
    // Parse PDF
    const data = await pdfParse(fileBuffer);
    
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('PDF appears to be empty or corrupted');
    }
    
    // Extract structured data
    const resumeData = extractResumeData(data.text);
    
    return {
      success: true,
      data: resumeData,
      metadata: {
        pages: data.numpages,
        fileName,
        parsedAt: new Date().toISOString()
      }
    };
    
  } catch (error) {
    // Handle specific error types
    if (error.message.includes('File size')) {
      return {
        success: false,
        error: 'FILE_TOO_LARGE',
        message: 'Resume file must be less than 5MB'
      };
    }
    
    if (error.message.includes('empty') || error.message.includes('corrupted')) {
      return {
        success: false,
        error: 'CORRUPT_PDF',
        message: 'Unable to read PDF file. Please ensure it is a valid PDF.'
      };
    }
    
    return {
      success: false,
      error: 'PARSE_ERROR',
      message: error.message || 'Failed to parse resume'
    };
  }
}

/**
 * Express route handler
 */
export function createResumeParseRoute() {
  return async (req, res) => {
    try {
      // Check if file was uploaded
      if (!req.file && !req.body.file) {
        return res.status(400).json({
          success: false,
          error: 'NO_FILE',
          message: 'No resume file provided'
        });
      }
      
      const fileBuffer = req.file ? req.file.buffer : Buffer.from(req.body.file, 'base64');
      const fileName = req.file ? req.file.originalname : 'resume.pdf';
      
      const result = await parseResume(fileBuffer, fileName);
      
      if (!result.success) {
        return res.status(400).json(result);
      }
      
      res.json(result);
      
    } catch (error) {
      console.error('Resume parse error:', error);
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: 'Internal server error while parsing resume'
      });
    }
  };
}
