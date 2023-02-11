import factory from '../ethereum/factory';
import {Card, Button} from 'semantic-ui-react';
import Layout from '../components/Layout';
import Link from 'next/link';

const CampaignIndex = ({campaigns}) => {

    const renderCampaign = () => {
        const items = campaigns.map((campaign) => {
            return {
                header: campaign,
                description: <Link href={`/campaigns/${campaign}`}><a>View campaign</a></Link>,
                fluid: true //để cho thành phần này chiếm hết chiều ngang
            }
        })
        return <Card.Group items={items} />
    }

    return (
        <Layout>
            <div>
                <h3>Open campaign</h3>
                <Link href="/campaigns/new">
                    <a>
                        <Button content="New campaign"
                            icon="add"
                            primary
                            floated='right'
                        />
                    </a>
                </Link>
                {renderCampaign()}
            </div>
        </Layout>
    )
}

export async function getServerSideProps(){
    const campaigns = await factory.methods.getListCampaigns().call();
    return {
        props:{
            campaigns
        }
    }
}

export default CampaignIndex;