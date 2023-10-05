import { db } from '../firebase.js';

const createMessage = async (req, res) => {
  const { messageData } = req.body;
  try {
    const message = db.collection('messages').doc().set(messageData);
    res.status(202).json(message);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getMessages = async (req, res) => {
  try {
    const message = [];
    db.collection('messages').get().then((sc) => {
      sc.forEach((dc) => {
        const dat = dc.data();
        dat.id = dc.id;
        message.push(dat);
      });
      // sort in reverse chronological order (i.e. newest at first)
      message.sort((a, b) => {
        if (a.date.seconds > b.date.seconds) {
          return -1;
        }
        if (a.date.seconds < b.date.seconds) {
          return 1;
        }
        return 0;
      });
      res.status(202).json(message);
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getFilteredMessages = async (req, res) => {
  const { role, serviceArea } = req.query; // use req.query instead of req.params for query parameters
  try {
    const message = [];
    const serviceAreaQuery = db.collection('messages').where('serviceArea', 'array-contains', serviceArea).get();
    const targetQuery = db.collection('messages').where('target', 'array-contains', role).get();
    const [saSnapshot, targetSnapshot] = await Promise.all([serviceAreaQuery, targetQuery]);
    const saDocs = saSnapshot.docs;
    const tDocs = targetSnapshot.docs;
    const docs = saDocs.filter((sa) => tDocs.some((td) => td.id === sa.id));
    docs.forEach((doc) => {
      message.push(doc.data());
    });
    message.sort((a, b) => {
      if (a.date.seconds > b.date.seconds) {
        return -1;
      }
      if (a.date.seconds < b.date.seconds) {
        return 1;
      }
      return 0;
    });
    res.status(202).json(message);
  } catch (error) {
    res.status(400).json(error);
  }
};

const pinMessage = async (req, res) => {
  const { id, pinned } = req.body;
  try {
    const pinnedMessage = await db.collection('messages').doc(id).set({
      pinned,
    }, { merge: true });
    res.status(202).json(pinnedMessage);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteMessage = async (req, res) => {
  const { id } = req.body;
  try {
    await db.collection('messages').doc(id).delete();
    res.status(202).json(`successfully deleted message: ${id}`);
  } catch (error) {
    res.status(400).json(`unable to delete message: ${id}`);
  }
};

export default [createMessage, getMessages, getFilteredMessages, pinMessage, deleteMessage];
