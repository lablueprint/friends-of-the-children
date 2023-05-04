import {
  React, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useLocation, Link } from 'react-router-dom';
import styles from '../styles/Modules.module.css';
import Module from '../components/Module';
import * as api from '../api';

// Loads additional modules once user clicks into a root module
function ExpandedModule({ profile }) {
  const { role } = profile;
  const location = useLocation();
  const { id } = location.state;
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [parent, setParent] = useState();
  const [children, setChildren] = useState([]);
  const currRole = role.toLowerCase();
  // const [refresh, setRefresh] = useState(false);
  // const [open, setOpen] = useState(false);

  const [currModuleFiles, setCurrModuleFiles] = useState([]);

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
      setParent(object.data.parent);
      setChildren(object.childrenArray);
      setCurrModuleFiles(object.data.fileLinks);
    });
  };

  useEffect(getModule, [id, currRole]); // possible TODO: refresh in dependency list

  const deleteChild = (childId) => {
    setChildren(children.filter((child) => child.id !== childId));
  };

  return (
    <div>
      <div>
        {parent != null ? (
          <Link to="/expanded-module" state={{ id: parent }} className={styles.backButton}>
            Back
          </Link>
        ) : (
          <Link to="/resources">
            Back
          </Link>
        )}
        <Module title={title} body={body} child={children} links={currModuleFiles} role={currRole} deleteChild={deleteChild} id={id} />
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
