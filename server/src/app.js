import express from 'express';


const app = express();

app.get('/health', (req, res) => {
  res.send('Server is running!');
});


export default app;