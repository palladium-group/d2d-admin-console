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

export const AuthProvider = createContext(null);

const App = () => {
  const [userInformation, SetUserInformation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    kc.init({
      onLoad: 'login-required',
      checkLoginIframe: false
    }).then((auth) => {
      try {
        if (auth) {
          const user = {
            id: kc.tokenParsed.sub,
            name: kc.tokenParsed.name,
            token: kc.token,
            roles: kc.tokenParsed?.resource_access?.['admin_console']?.roles,
            sub: kc.tokenParsed.sub,
            tokenParsed: kc.tokenParsed,
            OrgUnit: kc.tokenParsed.OrgUnit,
            OrgUnitValue: kc.tokenParsed.OrgUnitValue
          };
          SetUserInformation(user);
          console.log(user);
        } else {
          SetUserInformation(null);
          console.log(`login failed`);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    });
    kc.onTokenExpired = () => {
      kc.updateToken(30);
    };
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthProvider.Provider value={userInformation}>
      <ThemeCustomization>
        <RTLLayout>
          <Locales>
            <NavigationScroll>
              <>
                <Notistack>
                  <Routes />
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
