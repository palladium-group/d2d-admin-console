import Keycloak from "keycloak-js";

export const kc = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'd2d',
    clientId: 'admin_console'
});
