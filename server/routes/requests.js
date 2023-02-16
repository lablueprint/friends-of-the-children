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

router.get('/getModulebyId/:id', async (req, res) => {
  const moduleId = req.params.id;
  const data = await db.collection('modules').doc(moduleId).get();
  res.status(202).json(data);
});

router.get('/getModulechild/:child', async(req,res) => {
  const moduleChild = req.params.id;
  const child = await db.collection('modules').doc(child).get();
  res.status(202).json(data);
});
export default router;
