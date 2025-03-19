import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = join(process.cwd(), 'posts');

// Ensure posts directory exists
try {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
} catch (error) {
  console.error('Error creating posts directory:', error);
}

export async function getPostBySlug(slug) {
  try {
    const fullPath = join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const processedContent = await remark()
      .use(html)
      .process(content);
    const contentHtml = processedContent.toString();
    
    return {
      slug,
      content: contentHtml,
      title: data.title || '',
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || '',
      coverImage: data.coverImage || null,
    };
  } catch (error) {
    console.error(`Error getting post by slug ${slug}:`, error);
    return null;
  }
}

export async function getAllPosts() {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }
    
    const slugs = fs.readdirSync(postsDirectory)
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));
    
    const posts = await Promise.all(
      slugs.map(async (slug) => {
        const post = await getPostBySlug(slug);
        return post;
      })
    );
    
    // Sort posts by date in descending order
    return posts
      .filter(Boolean)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error getting all posts:', error);
    return [];
  }
}

export async function createPost({ title, content, excerpt, coverImage }) {
  try {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
    
    const date = new Date().toISOString();
    
    const frontmatter = {
      title,
      date,
      excerpt: excerpt || '',
      coverImage: coverImage || '',
    };
    
    const fileContent = `---\n${matter.stringify('', frontmatter).trim()}\n---\n\n${content}`;
    
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }
    
    fs.writeFileSync(join(postsDirectory, `${slug}.md`), fileContent);
    
    return {
      slug,
      title,
      date,
      excerpt,
      coverImage,
    };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}