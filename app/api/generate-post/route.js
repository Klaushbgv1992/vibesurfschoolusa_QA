import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createPost } from '../../../lib/posts';
import { fetchLocalNews } from '../../../lib/news-api';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is missing' },
        { status: 500 }
      );
    }

    // Get local news
    const newsData = await fetchLocalNews();
    if (!newsData || newsData.length === 0) {
      return NextResponse.json(
        { error: 'No relevant news found' },
        { status: 404 }
      );
    }

    // Prepare the news summary for the prompt
    const newsSummary = newsData.map(item => 
      `TITLE: ${item.title}\nSUMMARY: ${item.description || 'No description available'}`
    ).join('\n\n');

    // Generate content with OpenAI
    const prompt = `
      You are writing a blog post for "Vibe Beach House," a luxury self-catering rental in Herolds Bay, South Africa.
      
      Create a 600-word blog post based on the following local news: 
      
      ${newsSummary}
      
      Requirements:
      1. Start with an engaging title that includes "Herolds Bay" or "Garden Route"
      2. Summarize the news and why it matters to visitors
      3. Connect the news to Vibe Beach House (located at 6 Rooikransie St, Herolds Bay, 6615)
      4. Mention our amenities (3 bedrooms, pool, etc.) where relevant
      5. Include SEO terms: "Herolds Bay accommodation", "Garden Route guesthouse", "self-catering"
      6. End with a call-to-action to book a stay
      
      Format your response as a JSON object with these fields:
      - title: The blog post title
      - excerpt: A 1-2 sentence summary for the blog listing (max 150 chars)
      - coverImage: Suggest a descriptive image keyword we could use (e.g., "herolds bay beach sunset")
      - content: The full blog post content with markdown formatting
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful travel writer creating content for a guesthouse blog."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    let blogData;
    
    try {
      blogData = JSON.parse(response);
    } catch (error) {
      console.error("Failed to parse OpenAI response as JSON:", error);
      return NextResponse.json(
        { error: "Failed to parse AI-generated content" },
        { status: 500 }
      );
    }

    // Generate a cover image URL (in production, you might use a real image API)
    const coverImage = `https://source.unsplash.com/random/1200x630/?${encodeURIComponent(blogData.coverImage || 'herolds bay south africa')}`;
    
    // Save the post
    const post = await createPost({
      title: blogData.title,
      content: blogData.content,
      excerpt: blogData.excerpt,
      coverImage,
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error generating post:', error);
    return NextResponse.json(
      { error: 'Failed to generate post' },
      { status: 500 }
    );
  }
}