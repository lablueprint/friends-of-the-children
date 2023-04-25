import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ref, uploadBytesResumable } from 'firebase/storage';

import { db, storage } from './firebase';
import styles from '../styles/Modules.module.css';
import * as api from '../api';

function Resources({ profile }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [mentor, setMentor] = useState(false);
  const [caregiver, setCaregiver] = useState(false);
  const roles = [];
  const [modules, setModules] = useState([]);
  const { role } = profile;
  const currRole = role.toLowerCase();
  const [percent, setPercent] = useState(0);
  const [fileLinks, setFileLinks] = useState([]);

  // add permissions to view module. order doesn't matter
  if (mentor) {
    roles.push('mentor');
  }
  if (caregiver) {
    roles.push('caregiver');
  }
  // getting all modules relevant to current user
  const fetchData = async () => {
    const { data } = await api.getModules(currRole);
    setModules(data);
  };

  // TODO: Move to backend, figure out how to maintain setPercent once it is moved to the backedn and sent back as a promise chain
  // upload file to Firebase:
  const handleUpload = (file) => {
    // if (!file) {
    //   alert('Please choose a file first!');
    // }
    const fileName = file.name;
    const storageRef = ref(storage, `/files/${fileName}`);
    // setLinks(storageRef.fullPath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const p = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );

        // update progress
        setPercent(p);
      },
      (err) => console.error(err),
    );
    return storageRef.fullPath;
    // set linkstate here:
  };

  const handleChange = (e) => {
    const urls = [];
    Array.from(e.target.files).forEach((file) => urls.push(handleUpload(file))); // allows you to upload multiple files
    setFileLinks(urls);
  };

  const submitForm = async () => { // adds a module to the root module page
    const data = {
      title,
      body,
      serviceArea,
      role: roles,
      children: [],
      parent: null,
      fileLinks, // set from handleChange, which triggers handleUpload of all the files
    };
    // receive module id
    // TODO: Create api call (move db.collection to backend)
    const tempId = (await db.collection('modules').add(data)).id;

    data.id = tempId;

    setModules([...modules, data]);

    // setModules([...modules, data]); // why is this run twice? - dk

    setTitle('');
    setBody('');
    setServiceArea('');
    setCaregiver(false);
    setMentor(false);
    setFileLinks([]);
  };

  const deleteModule = async (moduleId) => {
    await api.deleteModule(moduleId);
    setModules(modules.filter((module) => module.id !== moduleId));
  };

  // empty dependency array means getModules is only being called on page load
  useEffect(() => {
    // saving all the user profiles from Firebase in an array (useProfiles) only on first load
    fetchData().catch(console.error);
  }, []);

  if (currRole === 'admin') {
    return (
      <div>
        {modules.map((card) => (
          <div key={card.id} className={styles.card}>
            <Link
              to="/expanded-module"
              state={{ id: card.id }}
            >
              <div>
                <h1>{card.title}</h1>
              </div>
            </Link>
            <button type="button" onClick={() => { deleteModule(card.id); }}> Delete Module </button>

          </div>
        ))}
        <form action="post">
          <h1>Upload Module</h1>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          Body:
          <input type="text" value={body} onChange={(e) => setBody(e.target.value)} />
          Choose a role!!
          Caregiver
          <input type="checkbox" id="caregiver" name="caregiver" checked={caregiver} onChange={(e) => setCaregiver(e.target.checked)} />
          Mentor
          <input type="checkbox" id="mentor" name="mentor" checked={mentor} onChange={(e) => setMentor(e.target.checked)} />
          Service Area:
          <input type="text" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} />
          File:
          <input type="file" defaultValue="" onChange={handleChange} multiple />
          <p>
            {percent}
            {' '}
            % done
          </p>
          <button type="button" onClick={submitForm}>Submit</button>

        </form>
      </div>
    );
  }
  return (
    <div>
      {modules.map((card) => (
        <div key={card.id}>
          <Link
            to="/expanded-module"
            state={{ id: card.id }}
          >
            <div className={styles.card}>
              <h1>{card.title}</h1>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

Resources.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
  }).isRequired,
};
export default Resources;
