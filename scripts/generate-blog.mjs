// scripts/generate-blog.mjs
import { Octokit } from '@octokit/rest';
import OpenAI from 'openai';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local when running locally
try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const rootDir = path.resolve(__dirname, '..');
  const envPath = path.join(rootDir, '.env.local');
  
  if (fs.existsSync(envPath)) {
    console.log('Loading environment variables from .env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = envContent.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));
    
    for (const line of envVars) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    }
  }
} catch (error) {
  console.warn('Failed to load environment variables from .env.local:', error.message);
}

// Check if required environment variables are available
if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    'OPENAI_API_KEY environment variable is missing. ' +
    'Make sure it is set in your .env.local file or as an environment variable.'
  );
}

if (!process.env.GITHUB_TOKEN) {
  console.warn(
    'GITHUB_TOKEN environment variable is missing. ' +
    'Some GitHub API operations may fail. ' +
    'Make sure it is set in your .env.local file or as an environment variable.'
  );
}

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// News sources to scrape
const NEWS_SOURCES = [
  'https://www.georgeherald.com/',
  'https://www.gardenroute.com/news',
  'https://www.news24.com/news24/southafrica/news/south-cape'
];

const RELEVANT_KEYWORDS = [
  'george', 'herolds bay', 'wilderness', 'victoria bay', 
  'garden route', 'mossel bay', 'klein brak', 'great brak',
  'knysna', 'plettenberg', 'sedgefield', 'beach', 'surf',
  'tourism', 'holiday', 'vacation', 'travel', 'accommodation',
  'restaurant', 'festival', 'event'
];

// Main function
async function main() {
  try {
    console.log("Starting blog generation process");
    
    // Add job to queue
    const queueJob = await addJobToQueue();
    
    // Process the job
    console.log("Processing job:", queueJob.id);
    
    // Collect news
    const newsItems = await scrapeNews();
    console.log(`Collected ${newsItems.length} news items`);
    
    if (newsItems.length === 0) {
      console.log("No relevant news found. Using test data instead.");
      // Create dummy news items if none found
      newsItems.push(
        { headline: "Garden Route sees tourism boost during summer season", source: "Test Source" },
        { headline: "New hiking trail opens in Wilderness", source: "Test Source" },
        { headline: "Herolds Bay beach cleanup initiative a success", source: "Test Source" }
      );
    }
    
    // Generate blog content
    const blogPost = await generateBlogPost(newsItems);
    console.log(`Generated blog post: ${blogPost.title}`);
    
    // Push to GitHub as a blog post
    await createBlogPost(blogPost);
    console.log(`Blog post pushed to GitHub: ${blogPost.title}`);
    
    // Update job status to completed
    await updateJobStatus(queueJob.id, 'completed');
    console.log(`Job ${queueJob.id} completed`);
    
    console.log("Blog generation process completed successfully");
  } catch (error) {
    console.error("Error in blog generation process:", error.message);
    process.exit(1);
  }
}

// Add job to queue
async function addJobToQueue() {
  try {
    // Try to get existing queue file
    let queueFile;
    try {
      const response = await octokit.repos.getContent({
        owner: "Klaushbgv1992",
        repo: "vibebeachhouse",
        path: "blog-queue.json",
      });
      queueFile = response.data;
    } catch (error) {
      // Create new queue file if it doesn't exist
      console.log("Queue file doesn't exist or can't be accessed, using temporary job ID");
      return { id: `job-${Date.now()}` };
    }
    
    // Parse existing queue
    const content = Buffer.from(queueFile.content, 'base64').toString('utf8');
    const queue = JSON.parse(content);
    
    // Add new job
    const jobId = `job-${Date.now()}`;
    queue.jobs.push({
      id: jobId,
      status: 'pending',
      created: new Date().toISOString()
    });
    
    // Update queue file
    try {
      await octokit.repos.createOrUpdateFileContents({
        owner: "Klaushbgv1992",
        repo: "vibebeachhouse",
        path: "blog-queue.json",
        message: "Add new blog generation job to queue",
        content: Buffer.from(JSON.stringify(queue, null, 2)).toString('base64'),
        sha: queueFile.sha,
        branch: "master"
      });
    } catch (updateError) {
      console.warn("Could not update queue file, but will continue with blog generation", updateError.message);
      // Continue with job ID even if update fails
    }
    
    return { id: jobId };
  } catch (error) {
    console.error('Error adding job to queue:', error.message);
    // Return a job ID even if there's an error to allow the rest of the process to continue
    return { id: `job-${Date.now()}-fallback` };
  }
}

// Update job status
async function updateJobStatus(jobId, status) {
  try {
    // Get queue file
    const response = await octokit.repos.getContent({
      owner: "Klaushbgv1992",
      repo: "vibebeachhouse",
      path: "blog-queue.json",
    });
    
    // Parse queue
    const content = Buffer.from(response.data.content, 'base64').toString('utf8');
    const queue = JSON.parse(content);
    
    // Find and update job
    const jobIndex = queue.jobs.findIndex(job => job.id === jobId);
    if (jobIndex !== -1) {
      queue.jobs[jobIndex].status = status;
      queue.jobs[jobIndex].completed = new Date().toISOString();
      
      // Update queue file
      await octokit.repos.createOrUpdateFileContents({
        owner: "Klaushbgv1992",
        repo: "vibebeachhouse",
        path: "blog-queue.json",
        message: `Update job ${jobId} status to ${status}`,
        content: Buffer.from(JSON.stringify(queue, null, 2)).toString('base64'),
        sha: response.data.sha,
        branch: "master"
      });
    }
  } catch (error) {
    console.error('Error updating job status:', error.message);
    // Continue execution even if updating status fails
  }
}

// Scrape news function
async function scrapeNews() {
  const newsItems = [];
  
  for (const source of NEWS_SOURCES) {
    try {
      console.log(`Scraping news from ${source}`);
      const response = await axios.get(source);
      const $ = cheerio.load(response.data);
      
      // Extract headlines and links
      $('h1, h2, h3, h4, h5').each((index, element) => {
        const headlineText = $(element).text().trim();
        
        // Check if headline contains relevant keywords
        if (RELEVANT_KEYWORDS.some(keyword => 
          headlineText.toLowerCase().includes(keyword.toLowerCase()))) {
          
          let link = '';
          if ($(element).find('a').length) {
            link = $(element).find('a').attr('href');
          } else if ($(element).parent('a').length) {
            link = $(element).parent('a').attr('href');
          }
          
          // Make sure link is absolute
          if (link && !link.startsWith('http')) {
            const url = new URL(source);
            link = `${url.protocol}//${url.host}${link.startsWith('/') ? '' : '/'}${link}`;
          }
          
          if (headlineText && link) {
            newsItems.push({
              headline: headlineText,
              link: link,
              source: source
            });
          }
        }
      });
      
    } catch (error) {
      console.error(`Error scraping ${source}:`, error.message);
    }
  }
  
  return newsItems;
}

// Generate blog post
async function generateBlogPost(newsItems) {
  // Check API key before making request
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === '') {
    throw new Error('OPENAI_API_KEY is missing or empty. Please set a valid API key in GitHub Secrets or .env.local file.');
  }

  // Get the current date in YYYY-MM-DD format
  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];
  const currentYear = today.getFullYear(); // Get current year (2025)

  // Ensure headlines are complete (no ellipsis)
  const processedNewsItems = newsItems.map(item => {
    // Remove any trailing ellipsis if present
    let headline = item.headline;
    if (headline.endsWith('...')) {
      headline = headline.substring(0, headline.length - 3).trim();
    }
    return {
      ...item,
      headline
    };
  });

  const prompt = `Create a compelling blog post for Vibe Beach House, a holiday accommodation business located in Herolds Bay, George, South Africa. The blog post should be informative and attractive to potential visitors who might be interested in staying at Vibe Beach House.

Use the following recent news items as context for your post:
${processedNewsItems.map(item => `- ${item.headline} (${item.source})`).join('\n')}

The post should:
- Have an engaging title
- Include 3-5 sections with appropriate headings
- Highlight attractions and activities in Herolds Bay and the Garden Route
- Mention Vibe Beach House as an ideal accommodation option
- Include a call-to-action encouraging readers to book their stay
- IMPORTANT: When referring to news items, use COMPLETE sentences, don't truncate or abbreviate them with "..."

Make sure all dates in the blog post use the current year (${currentYear}).
Format the blog post in Markdown, including headings, paragraphs, and any other formatting you deem appropriate.
The blog post should be 500-800 words.

The output should be in JSON format with the following structure:
{
  "title": "The blog post title",
  "slug": "url-friendly-version-of-title",
  "date": "${currentDate}",
  "content": "The full blog post content in Markdown format",
  "excerpt": "A brief 2-3 sentence summary of the post"
}`;

  try {
    console.log("Calling OpenAI API to generate blog content...");
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a skilled content writer specializing in travel and tourism content. When mentioning news headlines, always use the FULL headlines without truncating or adding ellipsis. Always use the current date (${currentDate}) and current year (${currentYear}) for any date references.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });
    
    console.log("OpenAI API response received successfully");
    // Extract and parse JSON from the response
    const responseText = response.choices[0].message.content;
    
    try {
      const parsedResponse = JSON.parse(responseText);
      
      // Ensure the date is current
      parsedResponse.date = currentDate;
      
      // Additional check to remove any ellipsis in the content
      if (parsedResponse.content) {
        // Replace bullet points with ellipsis with full bullet points
        parsedResponse.content = parsedResponse.content.replace(/- .+\.\.\./g, match => {
          return match.replace('...', '');
        });
      }
      
      return parsedResponse;
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      // Create a properly formatted response if parsing fails
      return {
        title: 'Latest Updates from Herolds Bay and the Garden Route',
        slug: 'latest-updates-herolds-bay-garden-route',
        date: currentDate, // Use current date
        content: responseText,
        excerpt: "Discover the latest news and events from Herolds Bay and the Garden Route. Perfect for planning your next vacation at Vibe Beach House."
      };
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    
    // Check for common API key issues
    if (error.message.includes('401') || error.message.includes('Incorrect API key')) {
      throw new Error('OpenAI API authentication failed: Invalid API key. Please check your OPENAI_API_KEY in GitHub Secrets or .env.local file.');
    } else if (error.message.includes('429') || error.message.includes('Rate limit')) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later or upgrade your API plan.');
    } else if (error.message.includes('insufficient_quota') || error.message.includes('exceeded your current quota')) {
      throw new Error('OpenAI API quota exceeded. Please check your billing information or upgrade your API plan.');
    }
    
    // For other errors, just rethrow
    throw error;
  }
}

// Create blog post file
async function createBlogPost(blogPost) {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const fileName = `${dateStr}-${blogPost.slug}.md`;
    
    // Create Markdown with YAML frontmatter for the blog post
    const content = `---
title: "${blogPost.title}"
date: "${blogPost.date || dateStr}"
slug: "${blogPost.slug}"
excerpt: "${blogPost.excerpt}"
---

${blogPost.content}`;
    
    // Create or update the file in the repository
    await octokit.repos.createOrUpdateFileContents({
      owner: "Klaushbgv1992",
      repo: "vibebeachhouse",
      path: `posts/${fileName}`,
      message: `Add blog post: ${blogPost.title}`,
      content: Buffer.from(content).toString('base64'),
      branch: "master"
    });
    
    // Also save file locally so it shows up in development server
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const postsDir = path.join(__dirname, '..', 'posts');
      
      // Create posts directory if it doesn't exist
      if (!fs.existsSync(postsDir)) {
        fs.mkdirSync(postsDir, { recursive: true });
      }
      
      const localFilePath = path.join(postsDir, fileName);
      fs.writeFileSync(localFilePath, content);
      console.log(`Blog post also saved locally at: ${localFilePath}`);
    } catch (localError) {
      console.warn('Could not save blog post locally:', localError.message);
      // Continue execution even if local save fails
    }
    
    console.log(`Blog post "${blogPost.title}" pushed to GitHub successfully`);
    return true;
  } catch (error) {
    console.error('Error pushing blog post to GitHub:', error);
    throw error;
  }
}

// Run the main function
main();