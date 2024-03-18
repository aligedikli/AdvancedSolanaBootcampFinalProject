import React, {useContext, useEffect} from "react"
import CampaignItems from "../CampaignItems"
import Context from "../../context/context"
import {Link} from "react-router-dom"

const Home = () => {
    const context = useContext(Context)
    const {loadCampaigns, liveCampaigns} = context
    const renewData = async () => {
        await loadCampaigns()
        setTimeout(renewData, 10000)
    }
    useEffect(() => {
        renewData()
    }, [])
    return (
        <div>
            <p className="crowdify-header">CROWDIFY</p>
                
                    <span className="create-campaign-btn"><Link to="/create">Create Campaign</Link></span>

            <CampaignItems campaigns={liveCampaigns} />

        </div>
    )
}

export default Home