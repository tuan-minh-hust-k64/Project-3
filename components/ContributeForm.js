import React, {useState} from "react";
import {Form, Message, Input, Button} from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import {useRouter} from "next/router";

const ContributeForm = ({address}) => {
    const [value, setValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setLoading(true);
        const campaign = Campaign(address);
        try{
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute()
                .send({
                    from: accounts[0],
                    value: web3.utils.toWei(value, 'ether')
                })
            router.replace(`/campaigns/${address}`);
            setLoading(false);
        }catch(error){
            setErrorMessage(error.message);
        }
    }
    return (
        <Form onSubmit={handleSubmit} error={!!errorMessage} >
            <Form.Field>
                <lable>Amount of contribute: </lable>
                <Input 
                    label='ether'
                    labelPosition="right"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </Form.Field>
            <Message error header="Oops!" content={errorMessage} />
            <Button primary loading={loading}>
                Contribute!
            </Button>
        </Form>
    )
};
export default ContributeForm;