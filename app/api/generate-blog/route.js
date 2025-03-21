import { NextResponse } from 'next/server';
import axios from 'axios';
import OpenAI from 'openai';

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
    
    // Collect news
    const newsItems = await scrapeNews();
    
    if (newsItems.length === 0) {
      return NextResponse.json({ message: 'No relevant news found' });
    }
    
    // Generate blog content
    const blogPost = await generateBlogPost(newsItems);
    
    // Push to GitHub using Octokit
    await pushToGitHub(blogPost);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog post created successfully',
      title: blogPost.title,
      slug: blogPost.slug
    });
    
  } catch (error) {
    console.error('Error generating blog post:', error);
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
      // This is a simplified approach - may need customization
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
- slug: URL-friendly slug
- date: Current date
- excerpt: A brief 1-2 sentence summary
- coverImage: Suggested image theme for the post
- content: The full blog post in markdown format
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }]
  });
  
  return JSON.parse(completion.choices[0].message.content);
}

// Push to GitHub repository
async function pushToGitHub(blogPost) {
  const { Octokit } = await import('@octokit/rest');
  
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  
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
    console.error('Error pushing to GitHub:', error);
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