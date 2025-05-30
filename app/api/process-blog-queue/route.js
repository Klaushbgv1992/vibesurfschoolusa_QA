import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import OpenAI from 'openai';
import axios from 'axios';

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Secret token to prevent unauthorized access
const API_SECRET = process.env.BLOG_GENERATOR_SECRET;

export async function POST(request) {
  console.log("🔍 process-blog-queue endpoint called");
  try {
    // Verify the secret token
    const { secret } = await request.json();
    
    if (secret !== API_SECRET) {
      console.log("❌ Authentication failed: Invalid secret");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Debug GitHub token
    const tokenFirstChars = process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.substring(0, 5) + '...' : 'undefined';
    const tokenLength = process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.length : 0;
    console.log(`🔑 GitHub token debug: starts with ${tokenFirstChars}, length: ${tokenLength}`);

    // Initialize GitHub client
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    console.log("✅ Octokit initialized");

    // Get the queue file
    let queueFile;
    try {
      console.log("🔍 Attempting to fetch blog-queue.json");
      const response = await octokit.repos.getContent({
        owner: 'Klaushbgv1992',
        repo: 'vibesurfschool',
        path: 'blog-queue.json',
      });
      queueFile = response.data;
      console.log("✅ Found blog-queue.json");
    } catch (error) {
      console.log(`❌ Error fetching queue file: ${error.message}`);
      return NextResponse.json({ 
        error: 'No queue file found',
        details: error.message 
      }, { status: 404 });
    }

    // Parse the queue
    const content = Buffer.from(queueFile.content, 'base64').toString('utf8');
    const queue = JSON.parse(content);
    console.log(`📋 Queue contents: ${JSON.stringify(queue)}`);

    // Find the first pending job
    const pendingJobIndex = queue.jobs.findIndex(job => job.status === 'pending');
    console.log(`🔍 Pending job index: ${pendingJobIndex}`);
    
    if (pendingJobIndex === -1) {
      console.log("ℹ️ No pending jobs in queue");
      return NextResponse.json({ message: 'No pending jobs in queue' });
    }

    // Mark job as processing
    const job = queue.jobs[pendingJobIndex];
    job.status = 'processing';
    job.processingStarted = new Date().toISOString();
    console.log(`🔄 Starting to process job ${job.id}`);

    // Update the queue file
    await octokit.repos.createOrUpdateFileContents({
      owner: 'Klaushbgv1992',
      repo: 'vibesurfschool',
      path: 'blog-queue.json',
      message: `Update job ${job.id} status to processing`,
      content: Buffer.from(JSON.stringify(queue, null, 2)).toString('base64'),
      sha: queueFile.sha,
      branch: 'master'
    });

    // Process the job
    try {
      // Collect news
      const newsItems = await scrapeNews();
      console.log(`📰 Collected ${newsItems.length} news items`);
      
      if (newsItems.length === 0) {
        throw new Error('No relevant news found');
      }
      
      // Generate blog content
      const blogPost = await generateBlogPost(newsItems);
      console.log(`✍️ Generated blog post: ${blogPost.title}`);
      
      // Push to GitHub as a blog post
      await createBlogPost(blogPost, octokit);
      console.log(`📄 Blog post pushed to GitHub: ${blogPost.title}`);
      
      // Update job status to completed
      const updatedQueueResponse = await octokit.repos.getContent({
        owner: 'Klaushbgv1992',
        repo: 'vibesurfschool',
        path: 'blog-queue.json',
      });
      const updatedQueueFile = updatedQueueResponse.data;
      const updatedContent = Buffer.from(updatedQueueFile.content, 'base64').toString('utf8');
      const updatedQueue = JSON.parse(updatedContent);
      
      // Find the job again (queue might have changed)
      const jobIndex = updatedQueue.jobs.findIndex(j => j.id === job.id);
      if (jobIndex !== -1) {
        updatedQueue.jobs[jobIndex].status = 'completed';
        updatedQueue.jobs[jobIndex].completedAt = new Date().toISOString();
        updatedQueue.jobs[jobIndex].blogPost = {
          title: blogPost.title,
          slug: blogPost.slug
        };
        
        await octokit.repos.createOrUpdateFileContents({
          owner: 'Klaushbgv1992',
          repo: 'vibesurfschool',
          path: 'blog-queue.json',
          message: `Complete job ${job.id}`,
          content: Buffer.from(JSON.stringify(updatedQueue, null, 2)).toString('base64'),
          sha: updatedQueueFile.sha,
          branch: 'master'
        });
        console.log(`🔄 Job ${job.id} completed`);
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Blog post created successfully',
        title: blogPost.title,
        slug: blogPost.slug
      });
    } catch (error) {
      console.log(`❌ Error processing job ${job.id}: ${error.message}`);
      // Update job as failed
      try {
        const failedQueueResponse = await octokit.repos.getContent({
          owner: 'Klaushbgv1992',
          repo: 'vibesurfschool',
          path: 'blog-queue.json',
        });
        const failedQueueFile = failedQueueResponse.data;
        const failedContent = Buffer.from(failedQueueFile.content, 'base64').toString('utf8');
        const failedQueue = JSON.parse(failedContent);
        
        const jobIndex = failedQueue.jobs.findIndex(j => j.id === job.id);
        if (jobIndex !== -1) {
          failedQueue.jobs[jobIndex].status = 'failed';
          failedQueue.jobs[jobIndex].error = error.message;
          failedQueue.jobs[jobIndex].failedAt = new Date().toISOString();
          
          await octokit.repos.createOrUpdateFileContents({
            owner: 'Klaushbgv1992',
            repo: 'vibesurfschool',
            path: 'blog-queue.json',
            message: `Mark job ${job.id} as failed`,
            content: Buffer.from(JSON.stringify(failedQueue, null, 2)).toString('base64'),
            sha: failedQueueFile.sha,
            branch: 'master'
          });
          console.log(`🔄 Job ${job.id} marked as failed`);
        }
      } catch (queueError) {
        console.log(`❌ Error updating failed job status: ${queueError.message}`);
      }
      
      throw error;
    }
  } catch (error) {
    console.log(`❌ Error processing blog queue: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to scrape news from various sources
async function scrapeNews() {
  const NEWS_SOURCES = [
    'https://www.sun-sentinel.com/',
    'https://www.miamiherald.com/'
  ];
  
  const newsItems = [];
  
  for (const source of NEWS_SOURCES) {
    try {
      const { data } = await axios.get(source);
      
      // Extract headlines based on common HTML patterns
      const titleMatches = data.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/g) || [];
      
      for (const match of titleMatches) {
        const title = match.replace(/<\/?[^>]+(>|$)/g, "").trim();
        
        if (title && isRelevant(title)) {
          newsItems.push({
            title,
            source
          });
        }
      }
    } catch (error) {
      console.log(`❌ Error scraping ${source}: ${error.message}`);
    }
  }
  
  // Add fallback news if no real news found
  if (newsItems.length === 0) {
    newsItems.push({
      title: 'Exploring the Surf Spots of Fort Lauderdale',
      source: 'Fallback Content'
    });
    newsItems.push({
      title: 'Latest Tourism Updates for the Florida Coast',
      source: 'Fallback Content'
    });
  }
  
  return newsItems;
}

// Check if news is relevant to target location
function isRelevant(text) {
  const keywords = ['Fort Lauderdale', 'Florida', 'South Florida', 'Surfing'];
  return keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
}

// Generate blog post using OpenAI
async function generateBlogPost(newsItems) {
  const newsContext = newsItems.slice(0, 5).map(item => `- ${item.title}`).join('\n');
  
  const prompt = `
Create a compelling blog post for Vibe Surf School, a premier surf instruction school in Fort Lauderdale, Florida. 
The blog should incorporate recent local news and events:

${newsContext}

The blog post should:
1. Have an engaging title related to Fort Lauderdale or Florida
2. Be around 800-1000 words
3. Include multiple subheadings for better readability
4. Mention Vibe Surf School and its services (surf lessons, scuba diving, snorkeling, paddleboarding)
5. Include a call-to-action encouraging readers to book a lesson
6. Include these SEO keywords: Fort Lauderdale surf lessons, surf school, Florida vacation
7. Have a friendly, inviting tone that highlights local attractions
8. Connect the local news to visitor experiences

Format the response as a JSON object with these fields:
- title: Blog post title
- slug: URL-friendly slug derived from the title (lowercase, hyphens instead of spaces)
- date: Current date
- excerpt: A brief 1-2 sentence summary
- coverImage: Suggested image theme for the post
- content: The full blog post in markdown format
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", // Use 3.5-turbo for faster response
    messages: [{ role: "user", content: prompt }]
  });
  
  const response = completion.choices[0].message.content;
  try {
    return JSON.parse(response);
  } catch (error) {
    console.log('Error parsing OpenAI response:', error);
    // Create a properly formatted response if parsing fails
    return {
      title: 'Latest Updates from Fort Lauderdale and the Surf Scene',
      slug: 'latest-updates-fort-lauderdale-surf-scene',
      date: new Date().toISOString(),
      excerpt: 'Stay up to date with the latest news and events from Fort Lauderdale and the surf scene.',
      coverImage: 'fort lauderdale beach',
      content: `# Latest Updates from Fort Lauderdale and the Surf Scene

## Local News Highlights

${newsItems.map(item => `- ${item.title}`).join('\n')}

## Experience Vibe Surf School

Vibe Surf School offers the perfect ocean adventure for your Florida vacation. With experienced instructors, premium equipment, and beautiful beach locations, our surf school is the ideal place for learning to surf and enjoying other water sports in Fort Lauderdale.

[Book your lesson today!](https://www.vibesurfschool.com/book-a-lesson)
`
    };
  }
}

// Create a blog post in the repository
async function createBlogPost(blogPost, octokit) {
  // Format blog post as markdown with frontmatter
  const formattedContent = formatBlogPostForMarkdown(blogPost);
  
  try {
    await octokit.repos.createOrUpdateFileContents({
      owner: 'Klaushbgv1992',
      repo: 'vibesurfschool',
      path: `posts/${blogPost.slug}.md`,
      message: `Add new blog post: ${blogPost.title}`,
      content: Buffer.from(formattedContent).toString('base64'),
      branch: 'master'
    });
    
    console.log(`Blog post "${blogPost.title}" pushed to GitHub successfully`);
    return true;
  } catch (error) {
    console.log('Error pushing blog post to GitHub:', error);
    throw error;
  }
}

function formatBlogPostForMarkdown(blogPost) {
  const frontmatter = `---
title: "${blogPost.title}"
date: "${blogPost.date || new Date().toISOString()}"
slug: "${blogPost.slug}"
excerpt: "${blogPost.excerpt}"
coverImage: "/images/blog/default-cover.jpg"
---

`;
  return frontmatter + blogPost.content;
}