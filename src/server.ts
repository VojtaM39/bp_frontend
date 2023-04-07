import express from 'express';
import path from 'path';

const app = express();

app.use('/dist', express.static('./dist'));

app.get('/*', (req, res) => {
    res.sendFile('./public/index.html', { root: '.' })
});

app.listen(process.env.PORT || 3000, () => console.log('Server running...'));

