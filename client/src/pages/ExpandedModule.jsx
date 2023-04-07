import {
  React, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useLocation, Link } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import styles from '../styles/Modules.module.css';
import Module from '../components/Module';
import { storage } from './firebase';
import * as api from '../api';

// Loads additional modules once user clicks into a root module
function ExpandedModule({ profile }) {
  const { role } = profile;
  const location = useLocation();
  const { id } = location.state;
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [attachments, setAttachments] = useState(); // MIGHT not be needed, since link = attachments storage
  const [parent, setParent] = useState();
  const [children, setChildren] = useState([]);
  const currRole = role.toLowerCase();
  const [refresh, setRefresh] = useState(false);

  const [percent, setPercent] = useState(0);
  const [uploadLinks, setUploadLinks] = useState([]);
  const [currModuleFiles, setCurrModuleFiles] = useState([]);

  // Usestates for forms
  const [mentor, setMentor] = useState(false);
  const [caregiver, setCaregiver] = useState(false);
  const [serviceArea, setServiceArea] = useState('');
  const [formTitle, setFormtitle] = useState();
  const [formBody, setFormbody] = useState();

  // set role array for later use in identifying modules to display
  const roles = [];
  if (mentor) {
    roles.push('mentor');
  }
  if (caregiver) {
    roles.push('caregiver');
  }

  const submitForm = async () => { // submit a module to the current module page
    const data = {
      title: formTitle,
      body: formBody,
      serviceArea,
      role: roles,
      parent: id,
      children: [],
      uploadLinks,
    };

    await api.updateModuleChildren(id, data); // pass in id, data to submit
    // adds data to firebase, also appends new module to children array of module with passed in id

    setFormtitle('');
    setFormbody('');
    setServiceArea('');
    setCurrModuleFiles([]);
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
      setChildren(object.childrenArray);
      setCurrModuleFiles(object.data.fileLinks);
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
      (err) => console.error(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          return url;
        });
      },
    );
  };

  const handleChange = (e) => {
    // handleUpload(e.target.files[0]);
    const urls = [];
    Array.from(e.target.files).forEach((file) => urls.push(handleUpload(file))); // allows you to upload multiple files
    setUploadLinks(urls);
  };

  useEffect(getModule, [id, currRole, refresh]);

  const ExpandedModuleForm = (
    <div>
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
  if (parent != null) {
    if (currRole === 'admin') {
      return (
        <div>
          <div className={styles.card}>
            <Link to="/expanded-module" state={{ id: parent }} className={styles.backButton}>
              Back
            </Link>
            <Module title={title} body={body} attachments={attachments} child={children} links={currModuleFiles} />
          </div>
          {ExpandedModuleForm}
        </div>
      );
    }
    return (
      <div className={styles.card}>
        <Link to="/expanded-module" state={{ id: parent }} className={styles.backButton}>
          Back
        </Link>
        <Module title={title} body={body} attachments={attachments} child={children} links={currModuleFiles} />
      </div>
    );
  }

  if (currRole === 'admin') {
    return (
      <div>
        <div className={styles.card}>
          <Link to="/resources">
            Back
          </Link>
          <Module title={title} body={body} attachments={attachments} child={children} links={currModuleFiles} />
        </div>
        {ExpandedModuleForm}
      </div>

    );
  }
  return (
    <div>
      <div className={styles.card}>
        <Link to="/resources">
          Back
        </Link>
        <Module title={title} body={body} attachments={attachments} child={children} links={currModuleFiles} />
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
