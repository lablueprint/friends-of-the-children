// The purpose of the NotFound page is to indicate to the user that the page they tried to access is not defined
// or it doesn't exist.

// This function is imported in the App.jsx file where NotFound will be rendered if the user tries to access a
// route that wasn't defined by any previous routes such as login, signup, etc.

import React from 'react';

export default function NotFound() {
  return (
    <div>
      <h1>Page not accesible. Please login first!</h1>
    </div>
  );
}
