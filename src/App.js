import { createContext, useEffect, useState } from 'react';
// routing
import Routes from 'routes';

// project imports
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';
import Notistack from 'ui-component/third-party/Notistack';
import ThemeCustomization from 'themes';
import { kc } from './keycloak';
import { Box, CircularProgress } from '@mui/material';

// Create a context to share authentication information (user data)
// across the whole application.
export const AuthProvider = createContext(null);

const App = () => {
  // State to hold user information once authenticated
  const [userInformation, SetUserInformation] = useState(null);

  // State to handle loading state while waiting for Keycloak init
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Keycloak when the app starts
    kc.init({
      onLoad: 'login-required', // Automatically redirect to login if not logged in
      checkLoginIframe: false // Disable login check in the background iframe for simplicity
    }).then((auth) => {
      try {
        if (auth) {
          // If authenticated, extract user details from the token
          const user = {
            id: kc.tokenParsed.sub, // Unique user ID (subject)
            name: kc.tokenParsed.name, // User's full name
            token: kc.token, // Access token
            roles: kc.tokenParsed?.resource_access?.['admin_console']?.roles, // roles from Keycloak
            sub: kc.tokenParsed.sub, // User subject
            tokenParsed: kc.tokenParsed, // Entire parsed token object
            OrgUnit: kc.tokenParsed.OrgUnit, // Custom claim: organization unit i.e. User Attributes
            OrgUnitValue: kc.tokenParsed.OrgUnitValue // Custom claim: organizational unit value i.e. User Attributes
          };
          SetUserInformation(user);
        } else {
          // If login failed or user not authenticated
          SetUserInformation(null);
        }
      } catch (e) {
        // Catch any unexpected errors
        console.log(e);
      } finally {
        // Mark loading as finished
        setLoading(false);
      }
    });

    // Handle token expiration – refresh 30 seconds before expiry
    kc.onTokenExpired = () => {
      kc.updateToken(30);
    };
  }, []);

  // While waiting for Keycloak authentication, show a loading spinner
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={6}>
        <CircularProgress />
      </Box>
    );
  }

  // Once loaded, provide user info via AuthProvider context
  return (
    <AuthProvider.Provider value={userInformation}>
      <ThemeCustomization>
        <RTLLayout>
          <Locales>
            <NavigationScroll>
              <>
                {/* Notification provider (snackbar system) */}
                <Notistack>
                  {/* App routes (your page navigation) */}
                  <Routes />
                  {/* Snackbar UI for showing alerts */}
                  <Snackbar />
                </Notistack>
              </>
            </NavigationScroll>
          </Locales>
        </RTLLayout>
      </ThemeCustomization>
    </AuthProvider.Provider>
  );
};

export default App;
