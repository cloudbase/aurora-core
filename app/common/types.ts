/**
 * Types declarations
 */

/**
 * Propreties of a entry from the Service Calalog list
 * 
 * @export
 * @interface ServicePropreties
 */
export interface ServicePropreties {
    id: string;
    publicURL: string;
    internalURL: string;
    adminURL: string;
    name: string;
    region: string;
}

 /**
  * General error message fron a request on an OpenStack service API
  * 
  * @export
  * @interface OpenstackAPIError
  */
 export interface OpenstackAPIError {
     error: {
         message: string,
         code: number,
         title: string
     }
 }

 export interface Credentials {
     username: string;
     password: string;
     tenant?: string;
     domain?: string;
 }