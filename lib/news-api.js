import fetch from 'isomorphic-unfetch';

// This function fetches local news from South Africa, specifically focused on
// the Garden Route or George area when possible
export async function fetchLocalNews() {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      throw new Error('News API key is missing');
    }

    // Search for news about the Garden Route or Herolds Bay
    const query = encodeURIComponent('Garden Route OR George OR Herolds Bay OR Western Cape tourism');
    const url = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(`News API error: ${data.message || 'Unknown error'}`);
    }
    
    if (!data.articles || data.articles.length === 0) {
      console.log('No news found, using fallback topics');
      return getFallbackTopics();
    }
    
    // Filter for relevant articles about tourism, travel, events, etc.
    const relevantArticles = data.articles.filter(article => {
      const text = (article.title + ' ' + article.description).toLowerCase();
      return (
        text.includes('travel') || 
        text.includes('tourism') || 
        text.includes('event') || 
        text.includes('festival') ||
        text.includes('beach') ||
        text.includes('garden route') ||
        text.includes('western cape') ||
        text.includes('herolds bay') ||
        text.includes('george')
      );
    });
    
    return relevantArticles.length > 0 ? relevantArticles : getFallbackTopics();
  } catch (error) {
    console.error('Error fetching news:', error);
    return getFallbackTopics();
  }
}

// Fallback topics in case no relevant news is found
function getFallbackTopics() {
  const fallbackTopics = [
    {
      title: 'Exploring the Beaches of Herolds Bay',
      description: 'Discover the pristine beaches and hidden coves along the Herolds Bay coastline, perfect for swimming, surfing, and sunbathing.',
      url: 'https://example.com/herolds-bay-beaches',
      publishedAt: new Date().toISOString()
    },
    {
      title: 'Garden Route Wildlife Encounters',
      description: 'The Garden Route is home to diverse wildlife and natural reserves. Learn about the best places to spot indigenous animals and birds.',
      url: 'https://example.com/garden-route-wildlife',
      publishedAt: new Date().toISOString()
    },
    {
      title: 'Top 5 Hiking Trails Near George',
      description: 'Explore the breathtaking scenery of the Garden Route on these top-rated hiking trails suitable for all experience levels.',
      url: 'https://example.com/george-hiking-trails',
      publishedAt: new Date().toISOString()
    },
    {
      title: 'Local Cuisine: A Taste of the Garden Route',
      description: 'Sample the unique flavors of the Garden Route, from fresh seafood to traditional South African dishes with a coastal twist.',
      url: 'https://example.com/garden-route-cuisine',
      publishedAt: new Date().toISOString()
    }
  ];
  
  // Return a random fallback topic
  return [fallbackTopics[Math.floor(Math.random() * fallbackTopics.length)]];
}