export default async function handler(req, res) {
  const { id } = req.query;
  const baseUrl = `https://${req.headers.host}`;
  
  try {
    // 1. Fetch base index.html
    const indexRes = await fetch(`${baseUrl}/index.html`);
    let html = await indexRes.text();

    if (!id) {
      return res.status(200).send(html);
    }

    // 2. Fetch product from Appwrite REST API directly to avoid SDK overhead
    const projectId = '69c138dc003803eb6ca8';
    const databaseId = 'main';
    const collectionId = 'products';
    
    // We use the REST API directly
    const appwriteUrl = `https://cloud.appwrite.io/v1/databases/${databaseId}/collections/${collectionId}/documents/${id}`;
    
    // Note: We need the API Key to read if the collection is not fully public, 
    // but products should be public to read. Let's assume public read.
    const productRes = await fetch(appwriteUrl, {
      headers: {
        'x-appwrite-project': projectId,
        'Content-Type': 'application/json'
      }
    });

    if (productRes.ok) {
      const product = await productRes.json();
      
      const title = `${product.name} | Boutique Creattive`;
      const description = product.description || 'Tu espacio para estilo personalizado en Punta Cana & Michès.';
      const image = product.image || `${baseUrl}/og-image.jpg`;
      const url = `${baseUrl}/product/${id}`;
      const price = product.price;

      // 3. Inject OG tags into HTML
      html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
      
      const newMeta = `
        <meta name="description" content="${description}">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${description}">
        <meta property="og:image" content="${image}">
        <meta property="og:url" content="${url}">
        <meta property="og:type" content="product">
        <meta property="product:price:amount" content="${price}">
        <meta property="product:price:currency" content="DOP">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="${image}">
      `;
      
      // We insert the new meta tags right before </head>
      html = html.replace('</head>', `${newMeta}</head>`);
      
      // Remove any default OG tags that might conflict
      html = html.replace(/<meta property="og:(title|description|image|url|type)".*?>/g, '');
      html = html.replace(/<meta name="twitter:(card|title|description|image)".*?>/g, '');
    }

    // Return the modified HTML!
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300'); // Cache for 1 min, serve stale for 5 min
    return res.status(200).send(html);

  } catch (error) {
    console.error('Error in product OG handler:', error);
    // Fallback: redirect to base
    res.redirect(302, '/');
  }
}
