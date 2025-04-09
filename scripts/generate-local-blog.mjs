// scripts/generate-local-blog.mjs
import OpenAI from 'openai';
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

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create blog post generation function
async function generateBlogPost() {
  // Get the current date in YYYY-MM-DD format
  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];
  const currentYear = today.getFullYear();
  
  // Use predefined surf-related news items for blog generation
  console.log("Using predefined surf-related news items for blog generation");
  const newsItems = [
    { headline: "Fort Lauderdale sees record tourism boost for water sports in summer 2025", source: "Florida Tourism Board" },
    { headline: "New surf competitions announced for Pompano Beach this fall", source: "South Florida Surf Association" },
    { headline: "Fort Lauderdale implements enhanced beach safety measures for surfers", source: "Broward County News" },
    { headline: "Local surf instructors highlight best beginner spots in Dania Beach", source: "Fort Lauderdale Sun" },
    { headline: "South Florida water quality improvements benefit local surf communities", source: "Environmental Protection Agency" }
  ];
  
  const newsItemsText = newsItems.map(item => `- ${item.headline} (${item.source})`).join('\n');
  
  // Create prompt for OpenAI
  const prompt = `Create a compelling blog post for Vibe Surf School, a premier surf school located in Fort Lauderdale, Florida. This is NOT about Vibe Beach House or South Africa - this is about a surf school in Florida, USA. The blog post should be informative and attractive to potential visitors who might be interested in taking surf lessons or renting equipment.

Use the following recent news items as context for your post:
${newsItemsText}

The post should:
- Have an engaging title with SEO terms like "Fort Lauderdale surf lessons" or "South Florida surfing"
- Include 3-5 sections with appropriate headings
- Highlight surf conditions, beginner tips, or beach activities in Fort Lauderdale and South Florida
- Mention Vibe Surf School locations at Pompano Beach and Dania Beach in Fort Lauderdale
- Include a call-to-action encouraging readers to book a surf lesson with Vibe Surf School in Florida
- IMPORTANT: When referring to news items, use COMPLETE sentences, don't truncate or abbreviate them with "..."
- EXTREMELY IMPORTANT: DO NOT mention South Africa, Herolds Bay, Garden Route, or Vibe Beach House at all. This post is ONLY about Vibe Surf School in Fort Lauderdale, Florida, USA.

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
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a skilled content writer specializing in surf and water sports content for Vibe Surf School in Fort Lauderdale, Florida, USA. This is NOT about Vibe Beach House in South Africa. You must write ONLY about Fort Lauderdale and South Florida surf activities. When mentioning news headlines, always use the FULL headlines without truncating or adding ellipsis. Always use the current date (${currentDate}) and current year (${currentYear}) for any date references.`
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
      // Extract JSON from the response
      // Some API responses include markdown code blocks, so we need to handle that
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                        responseText.match(/{[\s\S]*}/); 
                        
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText;
      const cleanedJsonStr = jsonStr.trim();
      
      console.log("Attempting to parse JSON response:", cleanedJsonStr.substring(0, 100) + "...");
      
      const parsedResponse = JSON.parse(cleanedJsonStr);
      
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
      return createFallbackBlogPost(currentDate);
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    
    // Check for common API key issues
    if (error.message.includes('401') || error.message.includes('Incorrect API key')) {
      console.error('OpenAI API authentication failed: Invalid API key');
      // Return a fallback blog post to avoid complete failure
      return createFallbackBlogPost(currentDate);
    } else if (error.message.includes('429') || error.message.includes('Rate limit')) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later or upgrade your API plan.');
    } else if (error.message.includes('insufficient_quota') || error.message.includes('exceeded your current quota')) {
      throw new Error('OpenAI API quota exceeded. Please check your billing information or upgrade your API plan.');
    }
    
    // For other errors, use fallback content
    console.error('Using fallback content due to API error');
    return createFallbackBlogPost(currentDate);
  }
}

// Save blog post locally
async function saveBlogPostLocally(blogPost) {
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
    
    // Get the posts directory
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const postsDir = path.join(__dirname, '..', 'posts');
    
    // Create posts directory if it doesn't exist
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
      console.log(`Created posts directory at: ${postsDir}`);
    }
    
    // Save the blog post
    const filePath = path.join(postsDir, fileName);
    fs.writeFileSync(filePath, content);
    console.log(`Blog post saved locally at: ${filePath}`);
    
    // Create or update a README if it doesn't exist
    const readmePath = path.join(postsDir, 'README.md');
    if (!fs.existsSync(readmePath)) {
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
`;
      fs.writeFileSync(readmePath, readmeContent);
      console.log(`Created README.md in posts directory`);
    }
    
    return true;
  } catch (error) {
    console.error('Error saving blog post locally:', error.message);
    throw error;
  }
}

// Create fallback blog post function
function createFallbackBlogPost(currentDate) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  // Determine season based on month
  let season = "winter";
  if (month >= 2 && month <= 4) season = "spring";
  else if (month >= 5 && month <= 7) season = "summer";
  else if (month >= 8 && month <= 10) season = "fall";
  
  return {
    title: `Best Surf Spots in Fort Lauderdale for ${season.charAt(0).toUpperCase() + season.slice(1)} ${year}`,
    slug: `best-surf-spots-fort-lauderdale-${season}-${year}`,
    date: currentDate,
    excerpt: `Discover the top surf locations in Fort Lauderdale and South Florida for ${season} ${year}. Perfect for beginners and experienced surfers looking for the best waves and surf lessons.`,
    content: `# Best Surf Spots in Fort Lauderdale for ${season.charAt(0).toUpperCase() + season.slice(1)} ${year}

## Finding the Perfect Wave

Fort Lauderdale and the surrounding South Florida coastline offers surfers a variety of spots to catch waves year-round. During ${season}, conditions tend to create ideal surfing opportunities for both beginners and experienced surfers alike.

South Florida's wave patterns are influenced by tropical weather systems and cold fronts that create surfable swells along our coastline. While we don't get massive Hawaiian-style waves, our gentler breaks are perfect for learning and improving your skills.

## Top Spots in Fort Lauderdale

### Dania Beach Pier

Located just south of Fort Lauderdale, Dania Beach Pier offers consistent breaks perfect for beginners. The pier creates a sandbar that helps form waves even when other spots are flat. Vibe Surf School offers daily lessons here, taking advantage of the beginner-friendly conditions.

### Pompano Beach

Pompano Beach features more open water surfing with sandbars creating good breaks during northeast swells. This spot is slightly less crowded than other locations, making it ideal for intermediate surfers looking to practice without the pressure of an audience.

### Fort Lauderdale Beach Park

Centrally located and easily accessible, Fort Lauderdale Beach Park gets decent waves during good swell conditions. The proximity to amenities makes this a convenient spot for families and those looking to make a full day at the beach.

## Surf Conditions and Safety

Always check local surf reports before heading out. South Florida conditions can change quickly, especially during storm season. Rip currents can develop unexpectedly, so always surf with a buddy and be aware of local flags and warnings.

At Vibe Surf School, safety is our top priority. Our instructors are not only skilled surfers but also trained in water safety and first aid. When you book a lesson with us, you're getting professional instruction with an emphasis on safe surfing practices.

## Book Your Lesson Today

Ready to catch your first wave or improve your surfing skills? Vibe Surf School offers lessons for all ages and skill levels at both our Pompano Beach and Dania Beach locations. Our experienced instructors provide personalized coaching to help you progress quickly and safely.

Contact us today to book your surf lesson and experience the thrill of riding the waves in beautiful Fort Lauderdale!
`
  };
}

// Main function
async function main() {
  try {
    console.log("Starting local blog generation process");
    
    // Generate blog content
    const blogPost = await generateBlogPost();
    console.log(`Generated blog post: ${blogPost.title}`);
    
    // Save blog post locally
    await saveBlogPostLocally(blogPost);
    console.log(`Blog post "${blogPost.title}" saved successfully`);
    
    console.log("Blog generation process completed successfully");
  } catch (error) {
    console.error("Error in blog generation process:", error.message);
    process.exit(1);
  }
}

// Run the main function
main();
