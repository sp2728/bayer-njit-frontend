/* TODO: 
   1. Convert all constants to dynamic fetched values, based on the API calls for route /value. 
      Refer to API Documentation.
   2. Store the bakend api link within a constant and replace it with the magic constants used around the applications
   3. 
*/

const LOCAL_URL = 'http://localhost:3000';

const PRODUCTION_URL = process.env.REACT_APP_BACKEND_URL; // 'process.env.REACT_APP_BACKEND_URL' will be overwritten in docker and get replaced with the backend URL at time of Docker RUN setup

export const BACKEND_URL = (process.env.NODE_ENV == 'development') ? LOCAL_URL : PRODUCTION_URL;