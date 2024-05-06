import {createContext, useEffect, useState} from "react";
// routing
import Routes from 'routes';

// project imports
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';
import Notistack from 'ui-component/third-party/Notistack';
import ThemeCustomization from 'themes';
import { kc } from "./keycloak";

export const AuthProvider = createContext(null);

const App = () => {
    const [userInformation, SetUserInformation] = useState(null);

    useEffect(() => {

        async function authenticate() {
            const authenticated =  await kc.init({
                onLoad: "login-required",
                checkLoginIframe: false,
            });
            if(authenticated) {
                const user = {
                    id: kc.tokenParsed.sub,
                    name: kc.tokenParsed.name,
                    token: kc.token,
                    roles: kc.tokenParsed?.resource_access?.["admin_console"]?.roles,
                    sub: kc.tokenParsed.sub,
                    tokenParsed: kc.tokenParsed,
                };
                SetUserInformation(user);
            }
            else {
                console.log("Login failed check why");
            }
        }
        authenticate();
        kc.onTokenExpired = () => {
            kc.updateToken(30);
        }
    }, [kc]);

    return (
        <ThemeCustomization>
            <RTLLayout>
                <Locales>
                    <NavigationScroll>
                        <AuthProvider.Provider value={userInformation}>
                            <>
                                <Notistack>
                                    <Routes />
                                    <Snackbar />
                                </Notistack>
                            </>
                        </AuthProvider.Provider>
                    </NavigationScroll>
                </Locales>
            </RTLLayout>
        </ThemeCustomization>
    );
};

export default App;
