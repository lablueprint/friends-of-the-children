import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styles from '../styles/Messages.module.css';

function Message(props) {
  const {
    message, date, updatePinned,
  } = props;

  const {
    id, title, body, pinned,
  } = message;

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

  const update = () => {
    updatePinned(id, !pinned);
  };

  return (
    <div className={pinned ? styles.pinnedmessage : styles.message}>
      <div className={styles.titlediv}>
        <h1 className={styles.title_css}>
          {title}
        </h1>
        <h5>
          Posted at
          {' '}
          {date}
        </h5>
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
              <MenuItem key={option} selected={option === 'Pin'} onClick={update}>
                {option}
              </MenuItem>
            ))}
          </Menu>
        </div>
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
  }).isRequired,
  date: PropTypes.string.isRequired,
  updatePinned: PropTypes.func.isRequired,
};
export default Message;
