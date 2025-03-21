// ES Module format script for testing blog generation
import { Octokit } from '@octokit/rest';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Constants
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

// For local testing, create a dummy blog post
async function createTestBlogPost() {
  try {
    console.log("Starting blog post generation test");
    
    // Scrape news or use sample data for testing
    console.log("Collecting news items...");
    const newsItems = await scrapeNews();
    console.log(`Collected ${newsItems.length} news items`);
    
    // For debugging, print the news items
    console.log("News items found:");
    newsItems.forEach((item, i) => {
      console.log(`${i+1}. ${item.headline} (${item.source})`);
    });
    
    if (newsItems.length === 0) {
      console.log("No relevant news found. Using test data instead.");
      // Create dummy news items if none found
      newsItems.push(
        { headline: "Garden Route sees tourism boost during summer season", source: "Test Source" },
        { headline: "New hiking trail opens in Wilderness", source: "Test Source" },
        { headline: "Herolds Bay beach cleanup initiative a success", source: "Test Source" }
      );
    }
    
    // Generate blog content (simulated for local testing)
    console.log("Generating blog content...");
    const blogPost = {
      title: "Latest Updates from the Garden Route: What's Happening Around Herolds Bay",
      slug: "latest-updates-garden-route-herolds-bay",
      date: new Date().toISOString().split('T')[0],
      content: `# Latest Updates from the Garden Route: What's Happening Around Herolds Bay
 
The Garden Route, with its breathtaking natural beauty and vibrant communities, continues to be a hub of activity and excitement. Here's what's been happening around Herolds Bay and the surrounding areas.
 
## Local News Highlights
 
${newsItems.map(item => `- ${item.headline}`).join('\n')}
 
## Why Visit Herolds Bay Now
 
With these exciting developments and the area's natural beauty, there's never been a better time to visit Herolds Bay. The pristine beaches, stunning hiking trails, and warm community welcome make this a perfect getaway destination.
 
## Your Stay at Vibe Beach House
 
When planning your visit to experience all that the Garden Route has to offer, Vibe Beach House provides the perfect accommodation option. Our luxury self-catering facilities offer comfort, convenience, and breathtaking views that will make your stay unforgettable.
 
Book your stay today and experience the magic of Herolds Bay and the Garden Route!`,
      excerpt: "Discover the latest happenings in the Garden Route area, including news, events, and activities around Herolds Bay. Plus, find out why Vibe Beach House is your ideal accommodation choice."
    };
    
    console.log("Blog post generated:");
    console.log(`Title: ${blogPost.title}`);
    console.log(`Slug: ${blogPost.slug}`);
    
    // Create the posts directory if it doesn't exist
    const postsDir = path.join(__dirname, 'posts');
    if (!fs.existsSync(postsDir)) {
      console.log(`Creating posts directory: ${postsDir}`);
      fs.mkdirSync(postsDir, { recursive: true });
    }
    
    // Save to local file
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const fileName = `${dateStr}-${blogPost.slug}.md`;
    const filePath = path.join(postsDir, fileName);
    
    // Create markdown with YAML frontmatter
    const content = `---
title: "${blogPost.title}"
date: "${blogPost.date}"
slug: "${blogPost.slug}"
excerpt: "${blogPost.excerpt}"
---

${blogPost.content}`;
    
    console.log(`Writing blog post to file: ${filePath}`);
    fs.writeFileSync(filePath, content);
    
    console.log("Blog post created successfully!");
    console.log(`File path: ${filePath}`);
    
    return true;
  } catch (error) {
    console.error("Error in blog post generation:", error);
    return false;
  }
}

// Scrape news function (same as in GitHub Action)
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
      console.error(`Error scraping ${source}:`, error);
    }
  }
  
  return newsItems;
}

// Run the test
createTestBlogPost()
  .then(() => console.log("Test completed"))
  .catch(err => console.error("Test failed:", err));