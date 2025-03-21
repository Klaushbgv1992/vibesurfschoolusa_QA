import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
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
    
    // Initialize GitHub client
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    // Check if queue.json exists, if not create it
    try {
      // Try to get the current queue file
      const { data: queueFile } = await octokit.repos.getContent({
        owner: 'Klaushbgv1992',
        repo: 'vibebeachhouse',
        path: 'blog-queue.json',
      });
      
      // If file exists, add a new job to the queue
      const content = Buffer.from(queueFile.content, 'base64').toString('utf8');
      const queue = JSON.parse(content);
      
      // Add a new job with timestamp
      queue.jobs.push({
        id: `job-${Date.now()}`,
        status: 'pending',
        created: new Date().toISOString(),
      });
      
      // Update the queue file in repository
      await octokit.repos.createOrUpdateFileContents({
        owner: 'Klaushbgv1992',
        repo: 'vibebeachhouse',
        path: 'blog-queue.json',
        message: 'Add new blog generation job to queue',
        content: Buffer.from(JSON.stringify(queue, null, 2)).toString('base64'),
        sha: queueFile.sha,
        branch: 'master'
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Blog generation job added to queue'
      });
      
    } catch (error) {
      // If file doesn't exist (404) or other error, create the queue file
      if (error.status === 404 || !error.status) {
        // Create initial queue structure
        const initialQueue = {
          jobs: [{
            id: `job-${Date.now()}`,
            status: 'pending',
            created: new Date().toISOString(),
          }]
        };
        
        // Create queue file in repository
        await octokit.repos.createOrUpdateFileContents({
          owner: 'Klaushbgv1992',
          repo: 'vibebeachhouse',
          path: 'blog-queue.json',
          message: 'Initialize blog queue',
          content: Buffer.from(JSON.stringify(initialQueue, null, 2)).toString('base64'),
          branch: 'master'
        });
        
        return NextResponse.json({ 
          success: true, 
          message: 'Blog queue initialized with new job'
        });
      } else {
        // Rethrow if it's not a 404 error
        throw error;
      }
    }
  } catch (error) {
    console.error('Error adding job to queue:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}