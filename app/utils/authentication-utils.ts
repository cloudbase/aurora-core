import { Credentials, InvalidJsonError } from '../common';

export class AuthenticationUtils {
  /**
   * Parse standard authentication body and return an object depending on the Keystone API version and authentication method
   * 
   * @static
   * @param {Credentials} credentials 
   * @param {string} apiVersion 
   * @returns {Promise<any>} 
   * 
   * @memberOf AuthenticationUtils
   */
  static parseCredentials(credentials: Credentials, apiVersion: string): Promise<any> {
      if (credentials['username'] && credentials['password']) {
        return AuthenticationUtils.getDefaultScopedAuthObject(credentials, apiVersion)
          .then(authObject => { 
            if (apiVersion === '3') {
              if (credentials.tenant) {
                authObject.scope.project = {name: credentials['tenant'], domain: {id: 'default'}};
              }  
              if (credentials.domain) { 
                return authObject.scope.domain = credentials.domain; 
              }
            }
            return Promise.resolve(authObject); 
          });
        }
        else { return Promise.reject(new InvalidJsonError()); }
  }

  static getDefaultScopedAuthObject(credentials: Credentials, apiVersion: string): Promise<any> {
    if (apiVersion === '2.0') {
      return Promise.resolve({
        auth: {
          tenantName: credentials.tenant || '',
          passwordCredentials: {
            username: credentials.username,
            password: credentials.password
          }}});
        } else if (apiVersion === '3') {
          return Promise.resolve({
            auth: {
              identity: {
                method: ['password'],
                password: {
                  name: credentials.username,
                  password: credentials.password,
                  domain: {id: 'default'}
                }}}});
        }
   }
}
