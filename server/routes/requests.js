/* eslint-disable import/extensions */
import express from 'express';
import { db } from '../firebase.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('We are live!');
});

router.get('/getAllProfiles', async (req, res) => {
  const sc = await db.collection('profiles').get();

  const p = [];
  sc.forEach((doc) => {
    const data = doc.data();
    data.id = doc.id;
    p.push(data);
  });
  // res.send(p);
  res.status(202).json(p);
});

export default router;
