import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../../../components/Layout";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";

const NewRequest = () => {
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');
    const [recipient, setRecipient] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();
    const address = router.query.id;
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const accounts = await web3.eth.getAccounts();
            const campaign = Campaign(address);
            await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
                .send({
                    from: accounts[0],
                });
            router.push(`/campaigns/${address}/requests`);
        }catch(err){
            setErrorMessage(err.message);
        }
        setLoading(false);
    }

    return (
        <Layout>
            <Link href={`/campaigns/${address}/requests`}>
                <a>Back</a>
            </Link>
            <h3>Create a new request</h3>
            <Form error={!!errorMessage} onSubmit={handleSubmit} >
                <Form.Field>
                    <label>Description</label>
                    <Input 
                        value={description}
                        onChange={(e)=>{
                            setDescription(e.target.value)
                        }}
                    />
                </Form.Field>

                <Form.Field>
                    <label>Value in Ether</label>
                    <Input 
                        value={value}
                        onChange={(e)=>{
                            setValue(e.target.value)
                        }}                   />
                </Form.Field>

                <Form.Field>
                    <label>Recipient</label>
                    <Input 
                        value={recipient}
                        onChange={(e) =>{
                            setRecipient(e.target.value)
                        }}
                    />
                </Form.Field>
                <Message error header="Oops!" content={errorMessage} />
                <Button primary loading={loading} >Create!</Button>
            </Form>
        </Layout>
    );
}

export default NewRequest;