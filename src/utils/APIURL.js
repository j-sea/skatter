export default function (url) {
	return (window.location.hostname === 'localhost')
		? 'http://localhost:8080' + url
		: 'https://bailfire.herokuapp.com' + url
};