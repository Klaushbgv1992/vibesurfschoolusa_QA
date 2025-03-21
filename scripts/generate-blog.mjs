// scripts/generate-blog.mjs
import { Octokit } from '@octokit/rest';
import OpenAI from 'openai';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

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
      const newQueue = { jobs: [] };
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
    await octokit.repos.createOrUpdateFileContents({
      owner: "Klaushbgv1992",
      repo: "vibebeachhouse",
      path: "blog-queue.json",
      message: "Add new blog generation job to queue",
      content: Buffer.from(JSON.stringify(queue, null, 2)).toString('base64'),
      sha: queueFile.sha,
      branch: "master"
    });
    
    return { id: jobId };
  } catch (error) {
    console.error('Error adding job to queue:', error.message);
    throw error;
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
  const prompt = `Create a compelling blog post for Vibe Beach House, a holiday accommodation business located in Herolds Bay, George, South Africa. The blog post should be informative and attractive to potential visitors who might be interested in staying at Vibe Beach House.

Use the following recent news items as context for your post:
${newsItems.map(item => `- ${item.headline} (${item.source})`).join('\n')}

The post should:
- Have an engaging title
- Include 3-5 sections with appropriate headings
- Highlight attractions and activities in Herolds Bay and the Garden Route
- Mention Vibe Beach House as an ideal accommodation option
- Include a call-to-action encouraging readers to book their stay

Format the blog post in Markdown, including headings, paragraphs, and any other formatting you deem appropriate.
The blog post should be 500-800 words.

The output should be in JSON format with the following structure:
{
  "title": "The blog post title",
  "slug": "url-friendly-version-of-title",
  "date": "YYYY-MM-DD",
  "content": "The full blog post content in Markdown format",
  "excerpt": "A brief 2-3 sentence summary of the post"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a skilled content writer specializing in travel and tourism content."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 1500
  });
  
  // Extract and parse JSON from the response
  const responseText = response.choices[0].message.content;
  
  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    // Create a properly formatted response if parsing fails
    return {
      title: 'Latest Updates from Herolds Bay and the Garden Route',
      slug: 'latest-updates-herolds-bay-garden-route',
      date: new Date().toISOString().split('T')[0],
      content: responseText,
      excerpt: "Discover the latest news and events from Herolds Bay and the Garden Route. Perfect for planning your next vacation at Vibe Beach House."
    };
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
    
    console.log(`Blog post "${blogPost.title}" pushed to GitHub successfully`);
    return true;
  } catch (error) {
    console.error('Error pushing blog post to GitHub:', error);
    throw error;
  }
}

// Run the main function
main();