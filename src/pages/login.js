import React from 'react';

function Login() {
  return (
    <div>
      <form>
        <label htmlFor="fname">First name:</label>
        <br />
        <input type="text" id="fname" name="fname" />
        <br />
        <label htmlFor="lname">Last name:</label>
        <br />
        <input type="text" id="lname" name="lname" />
      </form>
    </div>
  );
}

export default Login;
