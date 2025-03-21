// test-token.js
const { Octokit } = require("@octokit/rest");
const fs = require('fs');

// Read token from .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const githubToken = envFile.split('\n')
  .find(line => line.startsWith('GITHUB_TOKEN='))
  ?.split('=')[1]?.trim();

if (!githubToken) {
  console.error("GITHUB_TOKEN not found in .env.local");
  process.exit(1);
}

async function testToken() {
  const octokit = new Octokit({
    auth: githubToken
  });
  
  try {
    const user = await octokit.users.getAuthenticated();
    console.log("✅ Token works! Authenticated as:", user.data.login);
    
    // Also test repo access
    try {
      const repo = await octokit.repos.get({
        owner: 'Klaushbgv1992',
        repo: 'vibebeachhouse'
      });
      console.log("✅ Repository access confirmed:", repo.data.full_name);
    } catch (repoError) {
      console.error("❌ Repository access error:", repoError.message);
    }
  } catch (error) {
    console.error("❌ Token error:", error.message);
  }
}

console.log("Testing GitHub token...");
testToken();