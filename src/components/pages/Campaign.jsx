import React, {useState, useContext} from "react"
import Spinner from "../Spinner"
import Context from '../../context/context'
import {Link} from 'react-router-dom'

const Status = {
    Scheculed: 0,
    Live: 1,
    Completed: 2,
}

const Campaign = () => {
    const context = useContext(Context)
    const { campaign, donate, processing} = context
    const [amount, setAmount] = useState(null)
    if(processing || campaign==null) {
        return (
            <div>
            <p className="crowdify-header">CROWDIFY</p>
            <Spinner />
            </div>
        );
    }
    const getCampaignStatus = (startTime, endTime) => {
        let res = {status: Status.Scheculed, hrs:0, min:0, sec:0}
        const currTime = Math.floor(Date.now() / 1000)
        if (currTime>=endTime) {
            res.status=Status.Completed
            return res
        }
        let timeRemaining
        if (startTime>currTime) {
            timeRemaining = startTime-currTime
            res.status=Status.Scheculed
        } else {
            timeRemaining = endTime-currTime
            res.status = Status.Live
        }
            res.hrs = Math.floor(timeRemaining/3600)
            timeRemaining = timeRemaining%3600
            res.min = Math.floor(timeRemaining/60)
            timeRemaining = timeRemaining%60
            res.sec = timeRemaining
            return res
        
    }
    
    const {name, admin, description, collectedAmount, targetAmount, startTime, endTime} = campaign
    const status = getCampaignStatus(startTime, endTime)
    

    const onChange = (event) => {
        setAmount(event.target.value);
    }
    const submitHandler = async (event) => {
        event.preventDefault()
        if (amount===null|| amount.toString()==='' || amount===0) {
            alert("Invalid amount :(")
            return 
        }
        await donate(amount)
    }
    
    return (
        <div className="campaign-page">
            <p className="crowdify-header">CROWDIFY</p>
            <div className="full-campaign-info">
                <h1>{name}</h1>
                <div className="campaign-details">
                    <p>{description}</p>
                    <p>Admin: {admin}</p>
                    <p>Amount raised: {collectedAmount}/{targetAmount}SOL</p>
                    {
                    status.status===Status.Completed?<p>Campaign completed</p>:
                    status.status===Status.Live?<p>{`Time remaining: ${status.hrs}h ${status.min}m ${status.sec}s`}</p>:
                    <p>{`Live in: ${status.hrs}h ${status.min}m ${status.sec}s`}</p>
                } 
                </div>
            </div>
            {
                status.status===Status.Live &&
                <form onSubmit={submitHandler}>
                    <input className="donate-input" type="number" value={amount} onChange={onChange} placeholder="SOL" />
                    <input className="donate-btn" type="submit" value="Donate" />
                </form>
            }
            
        </div>
    )
}

export default Campaign