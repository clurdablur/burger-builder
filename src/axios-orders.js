import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://react-burger-app-da62e.firebaseio.com/'
});

export default instance;