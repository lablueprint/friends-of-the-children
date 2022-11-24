import React from 'react';

// function sConsole(event) {
//   event.preventDefault();
//   const data = document.getElementById('LastName');
//   console.log(data.value);
// }
const formData = new FormData(document.forms[0]);

const obj = Object.fromEntries(Array.from(formData.keys()).map((key) => [key,
  formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)]));

console.log(`<pre>${JSON.stringify(obj)}</pre>`);
function Signup() {
  return (
    <div>
      <form>
        <label htmlFor="FirstName">
          First name:
          <br />
          <input type="text" id="signinform" name="FirstName" />
        </label>
        <label htmlFor="LastName">
          Last name:
          <br />
          <input type="text" id="signinform" name="LastName" />
        </label>
        <label htmlFor="Email">
          Email:
          <br />
          <input type="email" id="signinform" name="Email" />
        </label>
        <label htmlFor="ServiceArea">
          ServiceArea:
          <br />
          <input type="text" id="signinform" name="ServiceArea" />
        </label>
        <label htmlFor="Role">
          Choose a role:
          <br />
          <select id="signinform" name="Role">
            <option value="Caregiver">Caregiver</option>
            <option value="Mentor">Mentor</option>
          </select>
        </label>
        <label htmlFor="Username">
          Username:
          <br />
          <input type="text" id="signinform" name="Username" />
        </label>
        <label htmlFor="Password">
          Password:
          <br />
          <input type="text" id="signinform" name="Password" />
        </label>
        <label htmlFor="ConfirmPassword">
          Confirm Password:
          <br />
          <input type="text" id="signinform" name="ConfirmPassword" />
        </label>
      </form>
      <input type="submit" value="Submit" />
    </div>
  );
}

export default Signup;
