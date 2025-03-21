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
  try {
    // Verify the secret token
    const { secret } = await request.json();
    
    if (secret !== API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize GitHub client
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    // Get the queue file
    let queueFile;
    try {
      const response = await octokit.repos.getContent({
        owner: 'Klaushbgv1992',
        repo: 'vibebeachhouse',
        path: 'blog-queue.json',
      });
      queueFile = response.data;
    } catch (error) {
      return NextResponse.json({ 
        error: 'No queue file found',
        details: error.message 
      }, { status: 404 });
    }

    // Parse the queue
    const content = Buffer.from(queueFile.content, 'base64').toString('utf8');
    const queue = JSON.parse(content);

    // Find the first pending job
    const pendingJobIndex = queue.jobs.findIndex(job => job.status === 'pending');
    
    if (pendingJobIndex === -1) {
      return NextResponse.json({ message: 'No pending jobs in queue' });
    }

    // Mark job as processing
    const job = queue.jobs[pendingJobIndex];
    job.status = 'processing';
    job.processingStarted = new Date().toISOString();

    // Update the queue file
    await octokit.repos.createOrUpdateFileContents({
      owner: 'Klaushbgv1992',
      repo: 'vibebeachhouse',
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
      
      if (newsItems.length === 0) {
        throw new Error('No relevant news found');
      }
      
      // Generate blog content
      const blogPost = await generateBlogPost(newsItems);
      
      // Push to GitHub as a blog post
      await createBlogPost(blogPost, octokit);
      
      // Update job status to completed
      const updatedQueueResponse = await octokit.repos.getContent({
        owner: 'Klaushbgv1992',
        repo: 'vibebeachhouse',
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
          repo: 'vibebeachhouse',
          path: 'blog-queue.json',
          message: `Complete job ${job.id}`,
          content: Buffer.from(JSON.stringify(updatedQueue, null, 2)).toString('base64'),
          sha: updatedQueueFile.sha,
          branch: 'master'
        });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Blog post created successfully',
        title: blogPost.title,
        slug: blogPost.slug
      });
    } catch (error) {
      // Update job as failed
      try {
        const failedQueueResponse = await octokit.repos.getContent({
          owner: 'Klaushbgv1992',
          repo: 'vibebeachhouse',
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
            repo: 'vibebeachhouse',
            path: 'blog-queue.json',
            message: `Mark job ${job.id} as failed`,
            content: Buffer.from(JSON.stringify(failedQueue, null, 2)).toString('base64'),
            sha: failedQueueFile.sha,
            branch: 'master'
          });
        }
      } catch (queueError) {
        console.error('Error updating failed job status:', queueError);
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Error processing blog queue:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to scrape news from various sources
async function scrapeNews() {
  const NEWS_SOURCES = [
    'https://www.georgeherald.com/',
    'https://www.gardenroute.gov.za/news/'
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
      console.error(`Error scraping ${source}:`, error.message);
    }
  }
  
  // Add fallback news if no real news found
  if (newsItems.length === 0) {
    newsItems.push({
      title: 'Exploring the Hidden Gems of Herolds Bay',
      source: 'Fallback Content'
    });
    newsItems.push({
      title: 'Latest Tourism Updates for the Garden Route',
      source: 'Fallback Content'
    });
  }
  
  return newsItems;
}

// Check if news is relevant to target location
function isRelevant(text) {
  const keywords = ['George', 'Herolds Bay', 'Garden Route', 'Western Cape'];
  return keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
}

// Generate blog post using OpenAI
async function generateBlogPost(newsItems) {
  const newsContext = newsItems.slice(0, 5).map(item => `- ${item.title}`).join('\n');
  
  const prompt = `
Create a compelling blog post for Vibe Beach House, a luxury guesthouse in Herolds Bay, South Africa. 
The blog should incorporate recent local news and events:

${newsContext}

The blog post should:
1. Have an engaging title related to Herolds Bay or George, South Africa
2. Be around 800-1000 words
3. Include multiple subheadings for better readability
4. Mention Vibe Beach House and its amenities (3 bedrooms, swimming pool, ocean views)
5. Include a call-to-action encouraging readers to book a stay
6. Include these SEO keywords: Herolds Bay accommodation, luxury guesthouse, Garden Route vacation
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
    console.error('Error parsing OpenAI response:', error);
    // Create a properly formatted response if parsing fails
    return {
      title: 'Latest Updates from Herolds Bay and the Garden Route',
      slug: 'latest-updates-herolds-bay-garden-route',
      date: new Date().toISOString(),
      excerpt: 'Stay up to date with the latest news and events from Herolds Bay and the Garden Route.',
      coverImage: 'herolds bay beach',
      content: `# Latest Updates from Herolds Bay and the Garden Route

## Local News Highlights

${newsItems.map(item => `- ${item.title}`).join('\n')}

## Visit Vibe Beach House

Vibe Beach House offers the perfect accommodation for your Garden Route vacation. With 3 spacious bedrooms, a swimming pool, and stunning ocean views, our luxury guesthouse is the ideal base for exploring all that Herolds Bay has to offer.

[Book your stay today!](https://www.airbnb.com/rooms/1185679450503007200)
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
      repo: 'vibebeachhouse',
      path: `posts/${blogPost.slug}.md`,
      message: `Add new blog post: ${blogPost.title}`,
      content: Buffer.from(formattedContent).toString('base64'),
      branch: 'master'
    });
    
    console.log(`Blog post "${blogPost.title}" pushed to GitHub successfully`);
    return true;
  } catch (error) {
    console.error('Error pushing blog post to GitHub:', error);
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