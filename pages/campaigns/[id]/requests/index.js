import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Table } from "semantic-ui-react";
import Layout from "../../../../components/Layout";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";

const RequestView = (props) => {
    const router = useRouter();
    const address = router.query.id;
    const [loadingApp, setLoadingApp] = useState(false);
    const [loadingFina, setLoadingFina] = useState(false);

    const handleApproval =async (index) => {
        setLoadingApp(true);
        const campaign = Campaign(address);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(index)
            .send({
                from: accounts[0]
            });
        setLoadingApp(false)
        router.replace(`/campaigns/${address}/requests`);
    }
    const handleFinalize =async (index) => {
        setLoadingFina(true)
        const campaign = Campaign(address);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(index)
            .send({
                from: accounts[0]
            });
        setLoadingFina(false)
        router.replace(`/campaigns/${address}/requests`);
    }

    return (
        <Layout>
            <h3>Requests</h3>
            <Link href={`/campaigns/${address}/requests/new`}>
                <a>
                    <Button primary floated="right"
                        style={{marginBottom: '10px'}}
                    >
                        Create Request!
                    </Button>
                </a>
            </Link>
            <Table celled >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Amount(ether)</Table.HeaderCell>
                        <Table.HeaderCell>Recipient</Table.HeaderCell>
                        <Table.HeaderCell>Approval Count</Table.HeaderCell>
                        <Table.HeaderCell>Approve</Table.HeaderCell>
                        <Table.HeaderCell>Finalize</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {props.requests.map((request, index)=>{
                        return (
                            <Table.Row key={index} disabled={request.complete}
                                positive={request.approvalCount>request.approverCount/2&&!request.complete} >
                                <Table.Cell>{index+1}</Table.Cell>
                                <Table.Cell>{request.description}</Table.Cell>
                                <Table.Cell>{request.value}</Table.Cell>
                                <Table.Cell>{request.recipient}</Table.Cell>
                                <Table.Cell>{request.approvalCount}/{request.approverCount}</Table.Cell>
                                <Table.Cell>
                                    {request.complete?null:
                                    <Button color="green" basic
                                        onClick={()=>handleApproval(index)}
                                        loading={loadingApp}
                                    >Approve</Button>}
                                </Table.Cell>
                                <Table.Cell>
                                    {request.complete? null:
                                    <Button color="teal" basic
                                        onClick = {()=>handleFinalize(index)}
                                        loading={loadingFina}
                                    >Finalize</Button>}
                                </Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table>
            <div>
                Found {props.numberRequest} requests
            </div>
        </Layout>
    )
};

export async function getServerSideProps(context) {
    const address = context.query.id;
    const campaign = Campaign(address);
    const numberRequest = await campaign.methods.getRequestsCount().call();
    const requests = await Promise.all(
        Array(parseInt(numberRequest)).fill().map((element, index) => {
            return campaign.methods.requests(index).call();
        })
    );
    const approverCount = await campaign.methods.approverCount().call();
    const newRequestArr = requests.map((request) =>{
        return {
            description: request.description,
            value: web3.utils.fromWei(request.value, 'ether'),
            recipient: request.recipient,
            complete: request.complete,
            approvalCount: request.approvalCount,
            approverCount
        }
    })
    return {
        props:{
            requests: newRequestArr,
            numberRequest
        }
    }
}

export default RequestView;