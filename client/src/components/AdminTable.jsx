/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';

import PropTypes from 'prop-types';

export default function AdminTable({ users }) {
  const [numChecked, setNumChecked] = useState(0);

  function createData(checked, name, username, email, role, dateJoined, status) {
    let approved = '';
    console.log(dateJoined);
    const desiredDate = dateJoined.split(',')[0];
    console.log(desiredDate);
    if (status) {
      approved = 'Approved';
    } else {
      approved = 'Not Approved';
    }
    return {
      checked, name, username, email, role, dateJoined: desiredDate, approved,
    };
  }

  const rows = users.map((user) => createData(false, user.name, user.username, user.email, user.role, user.epochDate, user.status));

  // const rows = [
  //   createData(false, 'Men Tor', 'menslay', 'menslay@yahoo.com', 'Mentor', '01/01/23', 'Not Approved'),
  //   createData(false, 'Mi chin nyeon', 'michinnyeon', 'a@a.com', 'Caregiver', '01/01/23', 'Not Approved'),
  //   createData(false, 'Sarah Chang', 'sarah', 'sarah@gmail.com', 'Mentor', '01/01/23', 'Not Approved'),
  //   createData(false, 'galen heuer', 'galen', 'galenheuer@gmail.com', 'Caregiver', '01/01/23', 'Approved'),
  //   createData(false, 'Care Giver', 'caregiver', 'hwang12@ucla.edu', 'Caregiver', '01/01/23', 'Approved'),
  // ];

  function HandleChange(e) {
    console.log(e.target.value);
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
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <Checkbox align="center" onChange={(event) => { HandleChange(event); }} />
              <TableCell align="left">{row.name}</TableCell>
              <TableCell align="left">{row.username}</TableCell>
              <TableCell align="left">{row.email}</TableCell>
              <TableCell align="left">{row.role}</TableCell>
              <TableCell align="left">{row.dateJoined}</TableCell>
              <TableCell align="left">{row.approved}</TableCell>
            </TableRow>
          ))}
        </TableBody>
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
  })).isRequired,
};
