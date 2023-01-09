import web3 from './web3';
import factoryContract from './build/CampaignFactory.json';

const factory = new web3.eth.Contract(
    factoryContract.abi,
    '0xEFBb6A476dED6016452D2Ee07EB9db978f6BE051'
);
export default factory;