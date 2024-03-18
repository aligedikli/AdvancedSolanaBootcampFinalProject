import React, {useContext} from "react"
import { Link } from 'react-router-dom'
import Context from "../context/context"

const Status = {
    Scheculed: 0,
    Live: 1,
    Completed: 2,
}

const CampaignItem = ({campaign}) => {
    const {setCampaign} = useContext(Context)
    const {name, collectedAmount, targetAmount, endTime, startTime, id} = campaign
    
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
    const status = getCampaignStatus(startTime, endTime)

    return (
        <Link to={`/campaign/${id}`} className="campaign-info-link">
        <span onClick={()=>{setCampaign(campaign)}}>
        <div className="campaign-item">
            
                <h3>{name}</h3>
                <p>{collectedAmount}/{targetAmount}SOL</p>
                {
                    status.status===Status.Completed?<p>Campaign completed</p>:
                    status.status===Status.Live?<p>{`Time remaining: ${status.hrs}h ${status.min}m ${status.sec}s`}</p>:
                    <p>{`Live in: ${status.hrs}h ${status.min}m ${status.sec}s`}</p>
                } 
        </div>
        </span>
        </Link>
        
    )
}

export default CampaignItem