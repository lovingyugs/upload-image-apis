/**
 * This File will export the required config details acc. to the process Environment.
 */

let config = {};

if (process.env.NODE_ENV === 'development') {
  config = {
    global_user_cnt: '',
    superSecret: 'i-love-secret',
    hostname: 'https://uploadimages70.herokuapp.com'
  };
} else if (process.env.NODE_ENV === 'production') {
  config = {
    global_user_cnt: '',
    superSecret: 'i-love-secret',
    hostname: 'https://uploadimages70.herokuapp.com'
  };
} else {
  config = {
    global_user_cnt: '',
    superSecret: 'i-love-secret',
    hostname: 'http://localhost:3000'
  };
}

module.exports = config;
