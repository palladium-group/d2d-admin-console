import Keycloak from 'keycloak-js';

// Create a new Keycloak instance configured using environment variables.
// These values should be set in your `.env` file for security and flexibility.
export const kc = new Keycloak({
  // The base URL of your Keycloak authentication server
  url: `${process.env.REACT_APP_KEY_CLOAK_URL}`,

  // The realm in Keycloak where your app and users are managed
  realm: `${process.env.REACT_APP_KEY_CLOAK_REALM}`,

  // The client ID that represents your React application in Keycloak
  clientId: `${process.env.REACT_APP_KEY_CLOAK_CLIENT}`,

  // Ensures the user is automatically redirected to login
  // if they are not already authenticated
  onLoad: 'login-required'
});
