const path = require('path');
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './', 'index.html'));
});

const urlDatabase = {};
const domainCount = {};

const getDomainName = (url) => {
    const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : 'http://' + url;
    const domain = new URL(fullUrl).hostname.replace('www.', '');
    return domain;
};

app.post('/shorten', (req, res) => {
    const longUrl = req.body.longUrl;
    console.log('Received long URL:', longUrl);
    let shortUrl = Object.keys(urlDatabase).find(key => urlDatabase[key] === longUrl);
    if (!shortUrl) {
        shortUrl = Math.random().toString(36).substring(2, 8);
        urlDatabase[shortUrl] = longUrl;

        const domain = getDomainName(longUrl);
        if (domainCount[domain]) {
            domainCount[domain]++;
        } else {
            domainCount[domain] = 1;
        }

        res.send(`Short URL: <a href="/r/${shortUrl}">/r/${shortUrl}</a>`);
    }else{
        const domain = getDomainName(longUrl);
        domainCount[domain]++;
        res.send(`Short URL: <a href="/r/${shortUrl}">/r/${shortUrl}</a>`);
    }  
});

app.get('/r/:shortUrl', (req, res) => {
    const shortUrl = req.params.shortUrl;
    const longUrl = urlDatabase[shortUrl];

    if (longUrl) {
        res.redirect(longUrl);
    } else {
        res.status(404).send('Short URL not found');
    }
});

app.get('/metrics', (req, res) => {
    
    const sortedDomains = Object.entries(domainCount)
        .sort((a, b) => b[1] - a[1]) 
        .slice(0, 3);

    
    const topDomains = sortedDomains.reduce((acc, [domain, count]) => {
        acc[domain] = count;
        return acc;
    }, {});

    res.json(topDomains);
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
});

