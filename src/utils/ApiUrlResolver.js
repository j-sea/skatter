const apiUrl = (window.location.hostname === 'localhost')
? 'http://localhost:8080'
: 'https://bailfire.herokuapp.com';

export default apiUrl;