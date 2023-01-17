import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, Link } from 'react-router-dom';
import styles from '../styles/Modules.module.css';
import Module from '../components/Module';
import { db } from './firebase';

function ExpandedModule(profile) {
  // remove later
  console.log(profile);
  const location = useLocation();
  const { id } = location.state;
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [attachments, setAttachments] = useState();
  const [parent, setParent] = useState();
  const [children, setChildren] = useState([]);
  const [titles, setTitles] = useState([]);

  const getTitles = () => {
    setTitles([]);
    for (let i = 0; i < children.length; i += 1) {
      db.collection('modules').doc(children[i]).get().then((sc) => {
        setTitles((prev) => [...prev, sc.data().title]);
      });
    }
  };

  const getModule = () => {
    db.collection('modules').doc(id).get().then((sc) => {
      const data = sc.data();
      setTitle(data.title);
      setBody(data.body);
      setAttachments(data.attachments);
      setParent(data.parent);
      setChildren(data.children);
    });
  };

  useEffect(getModule, [id]);
  useEffect(getTitles, [children]);

  if (parent != null) {
    return (
      <div className={styles.card}>
        <Link to="/expanded-module" state={{ id: parent }} className={styles.backButton}>
          Back
        </Link>
        <Module title={title} body={body} attachments={attachments} titles={titles} child={children} />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <Link to="/modules">
        Back
      </Link>
      <Module title={title} body={body} attachments={attachments} titles={titles} child={children} />
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
