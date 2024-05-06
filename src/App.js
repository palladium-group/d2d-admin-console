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
        kc.init({
            onLoad: "login-required",
            checkLoginIframe: false,
        }).then((auth) => {
            try {
                if(auth) {
                    const user = {
                        id: kc.tokenParsed.sub,
                        name: kc.tokenParsed.name,
                        token: kc.token,
                        roles: kc.tokenParsed?.resource_access?.["admin_console"]?.roles,
                        sub: kc.tokenParsed.sub,
                        tokenParsed: kc.tokenParsed,
                    };
                    SetUserInformation(user);
                    console.log(kc)
                }
            } catch (e) {
                console.log(e);
            }
        });
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
