import React, { useState } from "react";
import Layout from "../../components/Layout";
import {Form, Button, Input, Message} from "semantic-ui-react"
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import {useRouter} from "next/router";

const NewCampaign = () => {
    const [minimumContribution, setMinimumContribution] = useState('');
    const [errorMess, setErrorMess] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMess('');
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCampaign(minimumContribution)
                .send({
                    from: accounts[0]
                })
            router.push('/');
        }catch(err) {
            setErrorMess(err.message);
        }
        setLoading(false);
    }

    return (
        <Layout>
            <h3>Create a new campaign!</h3>
            <Form onSubmit={handleSubmit} error={!!errorMess} > {/*phải thêm thuộc tính error vào thẻ Form để hiện thông báo lỗi vào trong thẻ Message */}
                <Form.Field>
                    <label>Minimum contribution</label>
                    <Input 
                        label="Wei" 
                        labelPosition="right"
                        value = {minimumContribution}
                        onChange={(e) => {
                            setMinimumContribution(e.target.value)
                        }}
                        />
                </Form.Field>
                <Message error header="Oops!" content={errorMess} />
                <Button loading={loading} primary>Create!</Button>
            </Form>
        </Layout>
    )
}
export default NewCampaign;