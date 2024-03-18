import React from "react"
import CampaignItem from "./CampaignItem"

const CampaignItems = ({ campaigns }) => {
    return (
        <div className="campaign-items">
            {
                campaigns.map((campaign, id) => {
                    return <CampaignItem key={id} campaign={campaign}/>
                })
            }
        </div>
    )
}

export default CampaignItems