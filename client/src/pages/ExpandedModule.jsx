import {
  React, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useLocation, Link } from 'react-router-dom';
import {
  collection, addDoc, arrayUnion, updateDoc, doc,
} from 'firebase/firestore';
import styles from '../styles/Modules.module.css';
import Module from '../components/Module';
import { db } from './firebase';
import * as api from '../api';


function ExpandedModule({ profile }) {
  const { role } = profile;
  const location = useLocation();
  const { id } = location.state;
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [attachments, setAttachments] = useState();
  const [parent, setParent] = useState();
  const [children, setChildren] = useState([]);
  const currRole = role.toLowerCase();
  const [refresh, setRefresh] = useState(false);

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
    };

    // db.collection('modules').doc().add(data).then((dataRef) => {
    // if (dataRef.id) {
    //   console.log(dataRef.id);
    // }
    // });
    const docRef = await addDoc(collection(db, 'modules'), data);
    console.log('Document written with ID: ', docRef.id);

    const moduleRef = doc(db, 'modules', id);
    await updateDoc(moduleRef, {
      children: arrayUnion(docRef.id),
    });

    setFormtitle('');
    setFormbody('');
    setServiceArea('');
    setCaregiver(false);
    setMentor(false);
    setRefresh(!refresh);
  };

  const getModulebyIdfunc = async () => {
    console.log(api.getModulebyId())
    return await api.getModulebyId();
  }

  const getModuleChildfunc = async () => {
    const {child} = await api.getModuleChild()
    return child;
  }

  const getModule = () => {
    setChildren([]);
    getModulebyIdfunc().then((sc) => {
      const data = sc.data();
      setTitle(data.title);
      setBody(data.body);
      setAttachments(data.attachments);
      setParent(data.parent);
      // filter the children by role
      const tempChildren = [];
      data.children.forEach((child) => {
        getModuleChildfunc().then((snap) => {
          const childData = snap.data();
          if (currRole === 'admin' || childData.role.includes(currRole)) {
            const friend = {
              id: child, title: childData.title, role: childData.role,
            };
            tempChildren.push(friend);
          }
          setChildren(tempChildren);
        });
      });
    });
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
            <Module title={title} body={body} attachments={attachments} child={children} />
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
        <Module title={title} body={body} attachments={attachments} child={children} />
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
          <Module title={title} body={body} attachments={attachments} child={children} />
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
        <Module title={title} body={body} attachments={attachments} child={children} />
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
