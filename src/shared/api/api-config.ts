import axios from 'axios';

//@ts-ignore
const hostBackendUrl = 'https://whiskers-be-20342f5553a6.herokuapp.com/spin-and-earn/';
//@ts-ignore
const localBackendUrl = 'http://localhost:4000/spin-and-earn/';

//@ts-ignore
const dockerBackendUrl = 'https://spinforwhisk.com/backend/spin-and-earn/';

export const Instance = axios.create({
    baseURL: dockerBackendUrl,
    // baseURL: dockerBackendUrl,
    headers: {
        Accept: 'application/json',
        ['Content-Type']: 'application/json',
    },
});

