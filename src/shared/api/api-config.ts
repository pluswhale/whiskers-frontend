import axios from 'axios';

//@ts-ignore
const hostBackendUrl = 'https://whisk-wheel-bot-c25a548e192c.herokuapp.com/spin-and-earn/';
//@ts-ignore
const localBackendUrl = 'http://localhost:4000/spin-and-earn/';

//@ts-ignore
const dockerBackendUrl = 'http://62.72.45.191:4001/spin-and-earn/';

export const Instance = axios.create({
    baseURL: dockerBackendUrl,
    // baseURL: dockerBackendUrl,
    headers: {
        Accept: 'application/json',
        ['Content-Type']: 'application/json',
    },
});

