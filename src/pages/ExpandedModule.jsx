import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, Link } from 'react-router-dom';
import styles from '../styles/Modules.module.css';
import Module from '../components/Module';
import { db } from './firebase';

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

  const getModule = () => {
    setChildren([]);
    db.collection('modules').doc(id).get().then((sc) => {
      const data = sc.data();
      setTitle(data.title);
      setBody(data.body);
      setAttachments(data.attachments);
      setParent(data.parent);
      // filter the children by role
      const tempChildren = [];
      data.children.forEach((child) => {
        db.collection('modules').doc(child).get().then((snap) => {
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

  useEffect(getModule, [id, currRole]);

  if (parent != null) {
    return (
      <div className={styles.card}>
        <Link to="/expanded-module" state={{ id: parent }} className={styles.backButton}>
          Back
        </Link>
        <Module title={title} body={body} attachments={attachments} child={children} />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <Link to="/modules">
        Back
      </Link>
      <Module title={title} body={body} attachments={attachments} child={children} />
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
