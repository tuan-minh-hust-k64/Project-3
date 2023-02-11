import React, { useState } from "react";
import {useRouter} from "next/router";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import { Button, Card, Grid } from "semantic-ui-react";
import web3 from "../../../ethereum/web3";
import ContributeForm from "../../../components/ContributeForm";
import Link from "next/link";

const DetailCampaign = (props) => {

    const router = useRouter();

    
    const renderCampaign = () => {
        const items = [
            {
                header: props.manager,
                meta: 'Address of Manager',
                description: 'The manager created this campaign and can create request to withdraw money',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: props.minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You can contribute at least this much wei to become an approver'
            },
            {
                header: props.numberRequest,
                meta: 'Number of Request',
                description: 'A request tries to withdraw money from the contract. Requests must be approved by approver'
            },
            {
                header: props.approverCount,
                meta: 'Number of Approvers',
                description: 'Number of people who have already donated to this campaign'
            },
            {
                header: web3.utils.fromWei(props.campaignBalance, 'ether'),
                meta:'Campaign Balance (ether)',
                description: 'The balance how much money this campaign has left to spend.'
            }
        ];
        return <Card.Group items={items} />
    }

    return (
        <Layout>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10} >
                        <h3>Campaign show</h3>
                        {renderCampaign()}

                        
                    </Grid.Column>

                    <Grid.Column width={6} >
                        <ContributeForm address={props.address} />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column> {/*mỗi khi dùng Row thì phần tử trong Row nên nằm trong 1 Column để không bị vỡ layout*/}
                        <Link href={`/campaigns/${props.address}/requests`}>    
                            <a>
                                <Button primary >
                                    View Requests
                                </Button>
                            </a>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            
        </Layout>
        
    )
}

export async function getServerSideProps(context){
    const campaign = Campaign(context.query.id);
    const summary = await campaign.methods.getSummary().call();
    return {
        props: {
            numberRequest: summary[0],
            approverCount: summary[1],
            campaignBalance: summary[2],
            minimumContribution: summary[3],
            manager: summary[4],
            address: context.query.id
        }
    }
}

export default DetailCampaign;