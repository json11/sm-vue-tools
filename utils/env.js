let baseUrl= '';

if(process.env.NODE_ENV === 'production') {
    baseUrl='https://romp-server.shenmajr.com/romp-server/';
    // baseUrl='http://172.16.10.124:8902/romp-server/';
} else {
    baseUrl='http://172.16.10.124:8902/romp-server/';
    baseUrl='https://easy-mock.com/mock/5c061e948f1be27163bf6e1e/wechat';
}

export {baseUrl}