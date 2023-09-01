import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styles from '../styles/Messages.module.css';

function Message(props) {
  const {
    message, date, updatePinned, deleteMessage, pinPrivilege = false,
  } = props;

  const {
    id, title, body, pinned, serviceArea,
  } = message;

  const serviceAreaCSS = serviceArea.length === 1 ? `serviceAreaCircle_${serviceArea[0]}` : '';

  const [anchorEl, setAnchorEl] = useState(null);
  const pinActions = ['Pin', 'Delete'];
  const unpinActions = ['Unpin', 'Delete'];
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={pinned ? styles.pinnedmessage : styles.message}>
      <div className={styles.titlediv}>
        <div className={`${styles[serviceAreaCSS]} ${styles.serviceAreaCircle}`} />
        <h1 className={styles.title_css}>
          {title}
        </h1>
        <h5 className={styles.date}>
          Posted on
          {' '}
          {date}
        </h5>
        {pinPrivilege && (
        <div>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {(pinned ? unpinActions : pinActions).map((option) => (
              <div key={option}>
                <MenuItem
                  selected={option === 'Pin' || option === 'Unpin'}
                  onClick={() => {
                    if (option === 'Pin' || option === 'Unpin') {
                      updatePinned(id, !pinned);
                    } else if (option === 'Delete') {
                      deleteMessage(id);
                    }
                  }}
                >
                  {option}
                </MenuItem>
              </div>
            ))}
          </Menu>
        </div>
        ) }
        {/* <button type="button" className={pinned ? styles.pinnedbutton : styles.button} onClick={update}>{pinned ? '❗️📌 UNPIN' : '📌 PIN' }</button> */}
      </div>

      <h6 className={styles.body_css}>
        {body}
      </h6>
    </div>
  );
}

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    pinned: PropTypes.bool.isRequired,
    serviceArea: PropTypes.arrayOf.isRequired,
  }).isRequired,
  date: PropTypes.string.isRequired,
  updatePinned: PropTypes.func.isRequired,
  deleteMessage: PropTypes.func.isRequired,
  pinPrivilege: PropTypes.bool.isRequired,
};
export default Message;
