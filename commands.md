You are an experienced full-stack developer with expertise in Next.js, React, Node.js, and integrating AI content via the OpenAI API. Your task is to build a Next.js website for a guesthouse that automatically publishes AI-generated blog posts twice a week. These posts should summarize relevant local news and tie the content back to our self-catering rental, “Vibe Guesthouse,” located in 6 Rooikransie St, Herolds Bay, 6615, South Africa.

## Core Requirements

1. **Technology Stack**
   - Next.js (latest version)
   - Deployment on Vercel
   - Use the OpenAI API (GPT-3.5 or GPT-4) for content generation
   - Optional: Use a minimal database or simple file storage to store posts (e.g., markdown files in a `posts/` folder or a small DB like Supabase)
   - RSS feed or news API integration (to fetch local news/events relevant to [the Garden Route George, South Africa])

2. **Project Setup**
   - Initialize a new Next.js app (e.g., `npx create-next-app`)
   - Configure `.env` with at least:
     - OPENAI_API_KEY=[YOUR_API_KEY]
     - Any other environment variables for the news feed or scheduling
   - Provide instructions on how to run and deploy on Vercel.

3. **Blog Section and Routing**
   - Create a `https://vibesurfschool.com/vibe-surf-blog/blog` page to list all blog posts.
   - Each blog post should have its own route: `/blog/[slug]`.
   - Use Next.js’s **Static Generation** or **ISR (Incremental Static Regeneration)** so that posts are SEO-friendly and load quickly.
   - Include basic SEO tags (meta title/description) in each post.

4. **AI-Generated Posts Workflow**
   - Implement a serverless function (e.g., under `/pages/api/generate-post.js`) that:
     1. Fetches recent local news or event info from a reliable source (could be a news API, RSS feed, or web-scraping approach). Filter for topics related to travel, events, or attractions in [LOCATION].
     2. Summarizes the news data and calls the OpenAI API with a carefully constructed prompt that:
        - Explains the local news/event
        - Ties it back to “Vibe Guesthouse” as a recommended place to stay
        - Maintains a friendly, helpful tone (about 500–700 words)
        - Uses simple SEO best practices (mention [LOCATION], “guesthouse,” “self-catering rental,” etc.)
        - Concludes with a short call-to-action to book a stay
     3. Receives the AI-generated text and saves it as a new blog post, either:
        - Writing a Markdown/MDX file into a `posts/` directory (committed automatically or stored locally), OR
        - Storing it in a small database (Supabase/PostgreSQL).
     4. Generates a **slug** from the post’s title for the URL.
     5. Optionally, includes a short meta description from the AI output.

5. **Scheduling**
   - Configure a twice-weekly schedule (e.g., Monday and Thursday) to run the `generate-post` API automatically. 
   - If using Vercel’s cron feature, provide instructions on setting up `vercel.json` or a separate scheduling approach (GitHub Actions, a cron job on an external server, etc.).
   - Each time the function runs, it should create and publish exactly one new post (if relevant news is found). If no valid news is available, it can fallback to a pre-set topic or skip publishing.

6. **Front-End & Display**
   - On the home page (`/`), add a link or teaser to the latest blog posts.
   - The `/blog` index should show recent posts with titles, excerpts, and publish dates. 
   - Each individual post page includes:
     - A clear H1 heading for the post title
     - The main body content from OpenAI
     - A mention or short CTA about booking at Vibe Guesthouse
     - Proper HTML tags for accessibility and SEO
   - Include any relevant images if desired (e.g., fetching a royalty-free image or using a local image folder). If automating images, outline that approach.

7. **Code Walkthrough & Comments**
   - Provide well-commented code to explain how the post generation works, how the serverless function fetches news, and how to customize the OpenAI prompt.
   - Show how to adjust the scheduling or add manual triggers to generate a new blog post on demand.

8. **Testing and Validation**
   - Show me an example of how the system fetches a local news story, calls OpenAI, and creates a new post.
   - Implement a quick fallback in case the AI generation fails (e.g., log an error, skip posting).
   - Include basic error handling so the site or build process doesn’t break if the API fails.

9. **Deployment on Vercel**
   - Provide instructions or configuration for deploying the Next.js app to Vercel.
   - Ensure environment variables for the OpenAI API key and any news API keys are secured.
   - Verify that the serverless function runs on schedule in production (twice a week).

10. **Additional Notes/Optimizations**
   - Make sure the site is mobile-friendly and fast (optimize images, use Next.js Image component).
   - Add internal links in the generated posts to relevant pages (e.g., “Rooms,” “Contact,” etc.) to improve SEO.
   - Provide a short guide on how I can adjust the AI prompt to refine the writing style or content length.

## Deliverables

- A working Next.js project scaffold with:
  - `/pages/index.js` (Homepage that includes a call to action "Book Now" that links to https://www.airbnb.com/rooms/1185679450503007200?source_impression_id=p3_1742350524_P3ntnWSMNQoPAbvn , an about page "3 Bedrooms. 6 Beds. 2.5 Bathrooms. 3 Living Rooms. Covered Braai Area. Swimming Pool. Dedicated
Work Space. Wifi (50Mbps). Kitchen. Washer. Comfortably sleeps up to 8 people", a section photo fotos, about the house, and another with surroundings of herolds bay)
  - `/pages/blog/index.js` (Blog listing)
  - `/pages/blog/[slug].js` (Individual post pages)
  - `/pages/api/generate-post.js` (or similarly named serverless function for automation)
  - `lib/` or `utils/` folder for helper scripts (fetching news, building prompts, saving posts)
- Documentation or inline comments explaining how to customize scheduling, AI prompts, and news sources.

Please provide:
1. A step-by-step setup guide (running locally, configuring `.env`, deploying to Vercel).
2. All relevant code files with clear comments.
3. Example usage showing at least one automatically generated post from local news integrated with the mention of Vibe Guesthouse.
4. Instructions for updating the scheduling frequency or adding manual triggers.