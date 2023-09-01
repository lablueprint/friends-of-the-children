/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import PropTypes from 'prop-types';
import styles from '../styles/Requests.module.css';
import ApproveIcon from '../assets/icons/approved.svg';
import UnapproveIcon from '../assets/icons/unapproved.svg';

import * as api from '../api';

export default function AdminTable({
  users, setRowsSelected, cancelButton, setCancelButton, approveButton, setApproveButton, deleteButton, setDeleteButton, selectMode,
}) {
  const [table, setTable] = useState([]);

  function createData(checked, name, username, email, role, dateJoined, status, id, serviceArea) {
    let approved = '';
    const desiredDate = dateJoined.split(',')[0];
    if (status) {
      approved = 'Approved';
    } else {
      approved = 'Not Approved';
    }
    return {
      checked, name, username, email, role, dateJoined: desiredDate, approved, id, serviceArea,
    };
  }

  useEffect(() => {
    setTable(users.map((user) => createData(false, user.name, user.username, user.email, user.role, user.epochDate, user.status, user.id, user.serviceArea)));
  }, [users]);

  // print whenever table is updated
  useEffect(() => {
    const num = table.reduce((accum, user) => {
      if (user.checked) { return accum + 1; }
      return accum;
    }, 0);
    setRowsSelected(num);
  }, [table]);

  useEffect(() => {
    if (cancelButton) {
      setTable((prevValue) => prevValue.map((user) => ({
        name: user.name, username: user.username, email: user.email, role: user.role, dateJoined: user.dateJoined, approved: user.approved, id: user.id, serviceArea: user.serviceArea, checked: false,
      })));
      setCancelButton(false);
    }
  }, [cancelButton]);

  useEffect(() => {
    async function ApproveButtonHandler() {
      const approvedPayloadToMailchimp = [];
      const approvedAccounts = [];
      if (approveButton) {
        table.forEach((user) => {
          if (user.checked) {
            approvedAccounts.push({ id: user.id, fields: { approved: true } });

            const payload = {
              email_address: user.email,
              firstName: user.name.split(' ')[0],
              lastName: user.name.split(' ')[1],
              role: user.role,
              serviceArea: user.serviceArea,
            };
            approvedPayloadToMailchimp.push(payload);
          }
        });

        await api.batchUpdateProfile(approvedAccounts);
        await api.batchAddToList(approvedPayloadToMailchimp);

        setTimeout(() => { window.location.reload(); }, 800);
        setApproveButton(false);
      }
    }

    ApproveButtonHandler();
  }, [approveButton]);

  useEffect(() => {
    async function DeleteButtonHandler() {
      const selectedAccounts = [];
      if (deleteButton) {
        table.forEach((user) => {
          if (user.checked) {
            selectedAccounts.push(user.id);
            const payload = {
              email_address: user.email,
              firstName: user.name.split(' ')[0],
              lastName: user.name.split(' ')[1],
              role: user.role,
              serviceArea: user.serviceArea,
            };
          }
        });

        api.batchDeleteProfile(selectedAccounts);

        setTimeout(() => { window.location.reload(); }, 800);
        setDeleteButton(false);
      }
    }

    DeleteButtonHandler();
  }, [deleteButton]);

  function handleChange(e, username) {
    setTable((prevValue) => prevValue.map((user) => {
      if (user.username === username) {
        return {
          // return the user with the checked state updated
          name: user.name, username: user.username, email: user.email, role: user.role, dateJoined: user.dateJoined, approved: user.approved, checked: !user.checked, id: user.id,
        };
      }
      return user;
    }));
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Select</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Username</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Role</TableCell>
            <TableCell align="left">Date Joined</TableCell>
            <TableCell align="left">Status</TableCell>
          </TableRow>
        </TableHead>
        { selectMode ? (
          <TableBody>
            {table.map((row) => (
              <TableRow key={row.username} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <Checkbox align="center" checked={row.checked} onChange={(event) => { handleChange(event, row.username); }} />
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.username}</TableCell>
                <TableCell align="left">{row.email}</TableCell>
                <TableCell align="left">
                  <div className={`${styles.roleWrapper} ${styles[row.role]}`}>
                    {row.role}
                  </div>
                </TableCell>
                <TableCell align="left">{row.dateJoined}</TableCell>
                <TableCell align="left">
                  {row.approved === 'Approved' ? <img className={styles.approveIcon} src={ApproveIcon} alt="approved" /> : <img className={styles.approveIcon} src={UnapproveIcon} alt="not approved" /> }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            {table.map((row) => (
              <TableRow
                key={row.username}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <Checkbox disabled align="center" checked={row.checked} onChange={(event) => { handleChange(event, row.username); }} />
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.username}</TableCell>
                <TableCell align="left">{row.email}</TableCell>
                <TableCell align="left">
                  <div className={`${styles.roleWrapper} ${styles[row.role]}`}>
                    {row.role}
                  </div>
                </TableCell>
                <TableCell align="left">{row.dateJoined}</TableCell>
                <TableCell align="left">
                  {row.approved === 'Approved' ? <img className={styles.approveIcon} src={ApproveIcon} alt="approved" /> : <img className={styles.approveIcon} src={UnapproveIcon} alt="not approved" /> }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
}

AdminTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    date: PropTypes.string,
    status: PropTypes.bool,
    id: PropTypes.string,
  })).isRequired,
  setRowsSelected: PropTypes.func.isRequired,
  cancelButton: PropTypes.bool.isRequired,
  setCancelButton: PropTypes.func.isRequired,
  approveButton: PropTypes.bool.isRequired,
  setApproveButton: PropTypes.func.isRequired,
  deleteButton: PropTypes.bool.isRequired,
  setDeleteButton: PropTypes.func.isRequired,
  selectMode: PropTypes.bool.isRequired,
};
