import { React } from 'react';
import {
  TextField,
} from '@mui/material';
import styles from '../styles/Login.module.css';

const lowerCase = (str) => str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => (word.toLowerCase()));
const camelCase = (str) => str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase())).replace(/\s+/g, '');

const createTextField = (label, foo, setFoo, width, type = 'text', error = false, helperText = '', defaultValue = '', multiline = false) => (
  <TextField
    id={camelCase(label)}
    label={label}
    type={type}
    defaultValue={defaultValue === '' ? `Enter your ${lowerCase(label)}` : defaultValue}
    value={foo}
    onChange={(e) => setFoo(e.target.value)}
    error={error}
    helperText={helperText}
    className={`${styles.textfield} ${styles.half_width}`}
    multiline={multiline}
    required
    sx={{
      height: 45,
      width,
    }}
  />
);

export { createTextField, lowerCase, camelCase };
