import { React } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import styles from '../styles/Modules.module.css';

export default function FilePopup(props) {
  const {
    file, open, handleClose,
  } = props;

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{file.fileName}</DialogTitle>
        <DialogContent>
          {(file.fileType.includes('image')) && (
            <div className={styles.fileDisplay}>
              <img className={styles.displayImg} src={file.url} alt={file.fileName} />
            </div>
          )}
          {(file.fileType.includes('video')) && (
            <div className={styles.fileDisplay}>
              <video className={styles.displayImg} controls src={file.url} alt={file.fileName}>
                <track default kind="captions" />
              </video>
            </div>
          )}
          {(file.fileType.includes('pdf')) && (
            <div className={styles.fileDisplay}>
              <embed className={styles.displayPdf} src={file.url} alt={file.fileName} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

FilePopup.propTypes = {
  file: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
