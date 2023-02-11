// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory{
    address[] public deployCampaigns;

    function createCampaign(uint minimum) public {
        address campaign = address(new Campaign(minimum, msg.sender));
        deployCampaigns.push(campaign);
    }
    function getListCampaigns() public view returns(address[] memory){
        return deployCampaigns;
    }
}


contract Campaign{
    struct Request{
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    modifier restricted(){
        require(msg.sender == manager, "Only manager can call this function!");
        _;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address => bool)  public approvers;
    uint public numberRequest;
    mapping(uint => Request) public requests;
    uint public approverCount;

    constructor (uint minimum, address creator){
        manager = creator;
        minimumContribution = minimum; 
    }

    function contribute() public payable{
        require(msg.value > minimumContribution, "Amount ether should bigger minimum");
        if(approvers[payable(msg.sender)] == false){
            approvers[payable(msg.sender)] = true;
            approverCount ++;
        }
    }

    function createRequest(string memory description, uint value, address recipient) public restricted {
        Request storage newRequest = requests[numberRequest++];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = payable(recipient);
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender] == true, "Not contribute");
        require(request.approvals[msg.sender] == false, "You are approved!");
        request.approvals[msg.sender] = true;
        request.approvalCount ++;
    }

    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        require(!request.complete, "Request is completed!!");
        require(address(this).balance > request.value, "Not enought coin!!");
        require(request.approvalCount > approverCount / 2, "Not enought approve!");
        request.complete = true;
        request.recipient.transfer(request.value);
    }

    function getSummary() public view returns(
        uint, uint, uint, uint, address
    ){
        return (
            numberRequest,
            approverCount,
            address(this).balance,
            minimumContribution,
            manager
        );
    }

    function getRequestsCount() public view returns(uint){
        return numberRequest;
    }

}