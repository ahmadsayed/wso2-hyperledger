
var ClientOAuth2 = require('client-oauth2')
var soap = require('soap');
var url = 'https://localhost:9443/services/OAuth2TokenValidationService?wsdl';
var ClientOAuth2 = require('client-oauth2')

var wso2Auth = new ClientOAuth2({
    clientId: 'p4qCAaZOmfKU7Jp9atQ8W6Ahhnka',
    clientSecret: '52kPCwSW86JjqLsTl_gDXWSva90a',
    accessTokenUri: 'http://localhost:9763/oauth2/token',
    authorizationUri: 'https://localhost:9443/oauth2/introspect',
    redirectUri: 'http://example.com/auth/github/callback',
})

var getJWTTokenFromWSO2 = (username, password) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    return new Promise((resolve, reject) => {
        wso2Auth.credentials.getToken({ 'tokenType': 'bearer' })
            .then(token => {
                var args = {
                    "validationReqDTO": {
                        "accessToken": {
                            "identifier": token.data.access_token,
                            "tokenType": "Bearer"
                        },
                        "requiredClaimURIs": "http://wso2.org/claims/active"
                    }
                };
                soap.createClientAsync(url)
                    .then((client) => {
                        client.setSecurity(new soap.BasicAuthSecurity(username, password));
                        return client.validateAsync(args);
                    })
                    .then((result) => {
                        (typeof result === 'undefined') ? reject("Error") :                         
                        resolve(result.return.authorizationContextToken.tokenString);
                    })


            }, error => reject(error));
    }
    );
}

getJWTTokenFromWSO2('admin', 'admin').then(console.log, console.error);

exports. getJWTTokenFromWSO2 = getJWTTokenFromWSO2;