/**
 * Bachelor thesis: Vojtech Maslan
 *
 * This file contains code for express server creation.
 */

import express from 'express';
const app = express();

app.use('/dist', express.static('./dist'));

app.get('/*', (req, res) => {
    res.sendFile('./public/index.html', { root: '.' })
});

app.listen(process.env.PORT || 3000, () => console.log('Server running...'));

