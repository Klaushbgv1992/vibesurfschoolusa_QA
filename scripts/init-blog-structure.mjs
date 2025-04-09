// scripts/init-blog-structure.mjs
import { Octokit } from '@octokit/rest';
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

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

async function initBlogStructure() {
  try {
    console.log("Starting blog structure initialization");
    
    const owner = "Klaushbgv1992";
    const repo = "vibesurfschoolusa";
    const branch = "master";
    
    // Create blog queue file
    const queueData = {
      jobs: [],
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    
    // Create posts directory with a README file
    const readmeContent = `# Vibe Surf School Blog Posts

This directory contains all blog posts for the Vibe Surf School website.
Posts are automatically generated and manually curated to provide valuable content for our visitors.

## Post Format

Each post should be in Markdown format with the following frontmatter:

\`\`\`
---
title: "Post Title"
date: "YYYY-MM-DD"
slug: "url-friendly-slug"
excerpt: "Brief description of the post"
---

Content goes here...
\`\`\`

## Categories

- Surf Lessons in Fort Lauderdale
- South Florida Surf Spots
- Surfing Tips for Beginners
- Water Safety
- Beach Activities
`;

    // Create empty welcome post
    const currentDate = new Date().toISOString().split('T')[0];
    
    const welcomePost = `---
title: "Welcome to Vibe Surf School Blog"
date: "${currentDate}"
slug: "welcome-to-vibe-surf-school-blog"
excerpt: "Stay updated with the latest surf conditions, events, and tips for surfing in Fort Lauderdale and South Florida."
---

# Welcome to the Vibe Surf School Blog

We're excited to launch our new blog where we'll be sharing:

- Surf reports and conditions in Fort Lauderdale
- Upcoming local surfing events
- Tips for beginners and advanced surfers
- Highlights from our surf lessons and student achievements
- Beach and ocean conservation efforts

Stay tuned for regular updates and follow us on social media for daily surf conditions!

Want to book a surf lesson? [Contact us today](https://vibesurfschool.setmore.com/fortlauderdale) to reserve your spot.
`;

    try {
      // Try to create the README.md file in posts directory
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: "posts/README.md",
        message: "Initialize blog posts directory with README",
        content: Buffer.from(readmeContent).toString('base64'),
        branch
      });
      console.log("Created posts/README.md");
    } catch (error) {
      console.error("Error creating posts/README.md:", error.message);
    }
    
    try {
      // Create the welcome post
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: `posts/${currentDate}-welcome-to-vibe-surf-school-blog.md`,
        message: "Add welcome blog post",
        content: Buffer.from(welcomePost).toString('base64'),
        branch
      });
      console.log("Created welcome blog post");
    } catch (error) {
      console.error("Error creating welcome post:", error.message);
    }
    
    try {
      // Create queue file
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: "blog-queue.json",
        message: "Initialize blog queue",
        content: Buffer.from(JSON.stringify(queueData, null, 2)).toString('base64'),
        branch
      });
      console.log("Created blog-queue.json");
    } catch (error) {
      console.error("Error creating blog-queue.json:", error.message);
    }
    
    // Create local directories as well
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const postsDir = path.join(__dirname, '..', 'posts');
      
      // Create posts directory if it doesn't exist
      if (!fs.existsSync(postsDir)) {
        fs.mkdirSync(postsDir, { recursive: true });
        console.log("Created local posts directory");
        
        // Create local README.md and welcome post
        fs.writeFileSync(path.join(postsDir, 'README.md'), readmeContent);
        fs.writeFileSync(path.join(postsDir, `${currentDate}-welcome-to-vibe-surf-school-blog.md`), welcomePost);
        console.log("Added local README.md and welcome post");
      }
    } catch (localError) {
      console.warn('Could not create local directory structure:', localError.message);
    }
    
    console.log("Blog structure initialization completed");
  } catch (error) {
    console.error("Error initializing blog structure:", error.message);
    process.exit(1);
  }
}

// Run the initialization function
initBlogStructure();
