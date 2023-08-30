import { db } from '../firebase.js';

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
          if (a.date < b.date) {
            return -1;
          }
          if (a.date > b.date) {
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

const pinMessage = async (req, res) => {
  const { id } = req.params;
    try {
        db.collection('messages').doc(id).set({
          pinned,
        }, { merge: true });
    } catch (error) {
        res.status(400).json(error);
    }
};

const deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('messages').doc(id).delete();
    res.status(202).json(`successfully deleted message: ${id}`);
  } catch (error) {
    res.status(400).json(`unable to delete message: ${id}`);
  }
}

export default [getMessages, pinMessage, deleteMessage]