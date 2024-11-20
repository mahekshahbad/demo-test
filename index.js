const path = require('path');
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './', 'index.html'));
});

const urlDatabase = {};

app.post('/shorten', (req, res) => {
    const longUrl = req.body.longUrl;
    console.log('Received long URL:', longUrl);
    let shortUrl;
    shortUrl = Math.random().toString(36).substring(2, 8);
    urlDatabase[shortUrl] = longUrl;

    res.send(`Short URL: <a href="/r/${shortUrl}">/r/${shortUrl}</a>`);
    
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
});

