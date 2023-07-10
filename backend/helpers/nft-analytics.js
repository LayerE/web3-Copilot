import { getNFTRoute } from './index.js';
import axios from 'axios';

//URL SHOULD BE REMOVED LATER
const getNFTAnalytics = async (message, walletAddress, apiKey, url) => {
    try {
        const response = await getNFTRoute(message, walletAddress, apiKey);
        console.log(response);
        let Routes;
        try {
            Routes = JSON.parse(response);
        } catch (error) {
            Routes = response;
        }
        console.log(Routes);
        if (Array.isArray(Routes)) {
            let routes = Routes;
            let dataJSON = [];
            let duration = '24hours';
            for (let i = 0; i < routes.length; i++) {
                console.log(routes[i]);
                const dataFetch = await axios.get(
                    `https://nftsurfaceboard.up.railway.app/v1` + routes[i]
                );
                let data = dataFetch?.data?.data
                    ? dataFetch?.data?.data
                    : dataFetch?.data;
                if (routes[i].includes('/marketOverview/mean')) {
                    data.type = 'matic/polygin prices';
                    data.format = 'USD';
                }
                if(url === "/stats/raw")
                dataJSON.push({route: routes[i],data, absoluteRoute: `https://nftsurfaceboard.up.railway.app/v1/${routes[i]}`})
                else
                dataJSON.push(data);
            }
            console.log(dataJSON);
            return { dataJSON, duration };
        } else {
            if (Routes?.includes('false') || Routes?.includes('FALSE'))
                return {
                    dataJSON: 'false',
                    duration: 'false',
                };
            const dataFetch = await axios.get(
                `https://nftsurfaceboard.up.railway.app/v1` + Routes
            );
            let duration = dataFetch?.data?.duration
                ? dataFetch?.data?.duration
                : '24hours';
            console.log(duration);
            let dataJSON = dataFetch?.data?.data
                ? dataFetch?.data?.data
                : dataFetch?.data;
            if (response?.includes('/marketOverview/mean')) {
                dataJSON.type = 'matic/polygin prices';
                dataJSON.format = 'USD';
            }
            return { dataJSON, duration };
        }
    } catch (error) {
        console.log(error);
        return { dataJSON: 'false', duration: 'false' };
    }
};

export { getNFTAnalytics };
