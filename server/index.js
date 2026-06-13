const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Proxy endpoint
app.use('/api', async (req, res) => {
  try {
    const targetUrl = `https://api.mangadex.org${req.url}`;
    console.log(`Proxying to: ${targetUrl}`);

    const options = {
      method: req.method,
      headers: {
        'User-Agent': 'Sparkdex/1.0.0 (https://github.com/sparkdex/sparkdex)',
        'Accept': 'application/json',
      }
    };

    // Forward request body for non-GET requests if present
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body && Object.keys(req.body).length > 0) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, options);
    
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      const textData = await response.text();
      res.status(response.status).send(textData);
    }
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({
      result: 'error',
      errors: [{
        status: 500,
        title: 'Proxy Server Error',
        detail: error.message
      }]
    });
  }
});


// Image proxy endpoint
app.get('/image/*', async (req, res) => {
  try {
    const imageUrl = req.params[0] + (req.query ? '?' + new URLSearchParams(req.query).toString() : '');
    const response = await fetch('https://' + imageUrl);
    const contentType = response.headers.get('content-type');
    res.set('Content-Type', contentType);
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).json({ error: 'Image proxy failed' });
  }
});
// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'sparkdex-proxy' });
});

app.listen(PORT, () => {
  console.log(`Sparkdex Proxy Server running on port ${PORT}`);
});

