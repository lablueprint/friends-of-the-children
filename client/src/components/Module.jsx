import { React } from 'react';
import { Link } from 'react-router-dom';
import { Checkbox } from '@mui/material';
import PropTypes from 'prop-types';
import FolderIcon from '@mui/icons-material/Folder';
import styles from '../styles/Modules.module.css';

function Module(props) {
  const {
    title, id, role, deleteModule, editable, checked, handleCheckboxChange,
  } = props;

  return (
    <div>
      <div className={styles.filecard}>
        {editable ? (
          <Checkbox
            checked={checked.includes(id)} // dunno how to go about this
            onChange={(event) => handleCheckboxChange(event, id)}
            className={styles.checkbox}
          />
        ) : (<FolderIcon className={styles.fileIcon} />)}

        <Link className={styles.resourcelink} to="/expanded-module" state={{ id }} key={id}>
          <h3 className={styles.resourcetext}>{title}</h3>
        </Link>
        {role === 'admin' && (
        <button className={styles.deleteButton} type="button" onClick={() => { deleteModule(id); }}>
          {' '}
          Delete Module
          {' '}
          {id}
          {' '}
        </button>
        )}
      </div>
    </div>
  );
}

Module.defaultProps = {
  editable: false,
};

Module.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  deleteModule: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  editable: PropTypes.bool,
  checked: PropTypes.arrayOf.isRequired,
};

export default Module;
