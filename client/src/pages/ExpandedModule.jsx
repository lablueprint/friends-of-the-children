import {
  React, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useLocation, Link } from 'react-router-dom';
import {
  collection, addDoc, arrayUnion, updateDoc, doc,
} from 'firebase/firestore';
import {
  ref, uploadBytesResumable, getDownloadURL,
} from 'firebase/storage';
import styles from '../styles/Modules.module.css';
import Module from '../components/Module';
import { db, storage } from './firebase';
import * as api from '../api';

function ExpandedModule({ profile }) {
  const { role } = profile;
  const location = useLocation();
  const { id } = location.state;
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [attachments, setAttachments] = useState(); // MIGHT not be needed, since link = attachments storage
  const [parent, setParent] = useState();
  const [children, setChildren] = useState([]);
  // const [allImages, setImages] = useState('');
  const currRole = role.toLowerCase();
  const [refresh, setRefresh] = useState(false);

  const [percent, setPercent] = useState(0);
  const [link, setLink] = useState('');
  const [moduleImage, setModuleImage] = useState('');

  // Usestates for forms
  const [mentor, setMentor] = useState(false);
  const [caregiver, setCaregiver] = useState(false);
  const [serviceArea, setServiceArea] = useState('');
  const [formTitle, setFormtitle] = useState();
  const [formBody, setFormbody] = useState();

  const roles = [];
  if (mentor) {
    roles.push('mentor');
  }
  if (caregiver) {
    roles.push('caregiver');
  }

  const submitForm = async () => {
    const data = {
      title: formTitle,
      body: formBody,
      serviceArea,
      role: roles,
      parent: id,
      children: [],
      link,
    };

    const docRef = await addDoc(collection(db, 'modules'), data);
    console.log('Document written with ID: ', docRef.id);

    const moduleRef = doc(db, 'modules', id);
    await updateDoc(moduleRef, {
      children: arrayUnion(docRef.id),
    });

    setFormtitle('');
    setFormbody('');
    setServiceArea('');
    setModuleImage('');
    setCaregiver(false);
    setMentor(false);
    setRefresh(!refresh);
  };

  const getModulebyIdfunc = async (tempId, tempcurrRole) => {
    // data object structured as {data, children_array}
    const { data } = await api.getModulebyId(tempId, tempcurrRole);
    return data;
  };

  const getModule = () => { // gets data object from api using async "wrapper function" above
    // getModule cannot be async because it is used in the useEffect
    setChildren([]);
    getModulebyIdfunc(id, currRole).then((object) => {
      setTitle(object.data.title);
      setBody(object.data.body);
      setAttachments(object.data.attachments);
      setParent(object.data.parent);
      setChildren(object.children_array);
      console.log(object.data.link);
      setModuleImage(object.data.link);
    });
  };

  // upload file to Firebase:
  const handleUpload = (file) => {
    console.log('target:', file.name);
    // if (!file) {
    //   alert('Please choose a file first!');
    // }
    const fileName = file.name;
    const storageRef = ref(storage, `/files/${fileName}`);
    // setLink(storageRef.fullPath);
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
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          setLink(url);
        });
      },
    );
  };

  const handleChange = (e) => {
    handleUpload(e.target.files[0]);
  };

  useEffect(getModule, [id, currRole, refresh]);

  if (parent != null) {
    if (currRole === 'admin') {
      return (
        <div>
          <div className={styles.card}>
            <Link to="/expanded-module" state={{ id: parent }} className={styles.backButton}>
              Back
            </Link>
            <Module title={title} body={body} attachments={attachments} child={children} link={moduleImage} />
            {console.log(moduleImage)}
          </div>
          <form action="post">
            <h1>Upload Module</h1>
            Title:
            <input type="text" value={formTitle} onChange={(e) => setFormtitle(e.target.value)} />
            Body:
            <input type="text" value={formBody} onChange={(e) => setFormbody(e.target.value)} />
            Choose a role!!
            Caregiver
            <input type="checkbox" id="caregiver" name="caregiver" checked={caregiver} onChange={(e) => setCaregiver(e.target.checked)} />
            Mentor
            <input type="checkbox" id="mentor" name="mentor" checked={mentor} onChange={(e) => setMentor(e.target.checked)} />
            Service Area:
            <input type="text" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} />
            File:
            <input type="file" defaultValue="" onChange={handleChange} />
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
      <div className={styles.card}>
        <Link to="/expanded-module" state={{ id: parent }} className={styles.backButton}>
          Back
        </Link>
        <Module title={title} body={body} attachments={attachments} child={children} link={moduleImage} />
      </div>
    );
  }

  if (currRole === 'admin') {
    return (
      <div>
        <div className={styles.card}>
          <Link to="/modules">
            Back
          </Link>
          <Module title={title} body={body} attachments={attachments} child={children} link={moduleImage} />
        </div>
        <form action="post">
          <h1>Upload Module</h1>
          Title:
          <input type="text" value={formTitle} onChange={(e) => setFormtitle(e.target.value)} />
          Body:
          <input type="text" value={formBody} onChange={(e) => setFormbody(e.target.value)} />
          Choose a role!!
          Caregiver
          <input type="checkbox" id="caregiver" name="caregiver" checked={caregiver} onChange={(e) => setCaregiver(e.target.checked)} />
          Mentor
          <input type="checkbox" id="mentor" name="mentor" checked={mentor} onChange={(e) => setMentor(e.target.checked)} />
          Service Area:
          <input type="text" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} />
          File:
          <input type="file" defaultValue="" onChange={handleChange} />
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
      <div className={styles.card}>
        <Link to="/modules">
          Back
        </Link>
        <Module title={title} body={body} attachments={attachments} child={children} link={moduleImage} />
      </div>
    </div>
  );
}

ExpandedModule.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    serviceArea: PropTypes.string.isRequired,
  }).isRequired,
};
export default ExpandedModule;
