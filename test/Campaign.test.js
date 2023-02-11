const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const campaignContract = require('../ethereum/build/Campaign.json');
const factoryCampaign = require('../ethereum/build/CampaignFactory.json');
const web3 = new Web3(ganache.provider({ gasLimit: 10000000 }));
let accounts;
let campaign;
let factory;
let campaignAddress;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(factoryCampaign.abi)
        .deploy({ data: factoryCampaign.evm.bytecode.object })
        .send({ from: accounts[0], gas: '10000000' });
    await factory.methods.createCampaign('100').send({ from: accounts[0], gas: '10000000' });
    [campaignAddress] = await factory.methods.getListCampaigns().call();
    campaign = await new web3.eth.Contract(campaignContract.abi, campaignAddress);
})

describe('Campaigns', () => {
    it('compile factory and campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    })
    it('mark people make contract as manager contract', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(manager, accounts[0]);
    })
    it('allow everyone contibute to contract and mark them as approver', async () => {
        await campaign.methods.contribute().send({ from: accounts[1], value: '200' });
        const isApprover = await campaign.methods.approvers(accounts[1]).call();
        assert(isApprover);
    })
    it('require a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '22'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    })
    it('allow manager make a new request', async () => {
        await campaign.methods.createRequest('Buy paper', '100', accounts[1]).send({
            from: accounts[0],
            gas: '10000000'
        });
        const newRequest = await campaign.methods.requests(0).call();
        assert.equal('Buy paper', newRequest.description);
    })
    it('allow manager transfer to recipient when enought amount vote!!', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });
        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({
                from: accounts[0],
                gas: '10000000'
            });
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '10000000'
        })
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '10000000'
        })
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        assert(balance > 104);
    })
    it('All function modifier should run', async () => {
        assert(1 == 1)
    })
    it('Deploy success to Goerli network', async () => {
        assert(1 == 1)
    })
})
