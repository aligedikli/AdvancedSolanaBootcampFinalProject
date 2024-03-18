import React, { useState, useContext } from 'react'
import Context from '../../context/context'
import Spinner from '../Spinner'

const CreateCampaign = () => {
    //name description img targetAmount delay duration
    const {processing, createCampaign} = useContext(Context)
    const [state, setState] = useState({
        name: '',
        description: '',
        targetAmount: null,
        delay: null,
        duration: null
    })
    if (processing) {
        return (
            <div>
            <p className="crowdify-header">CROWDIFY</p>
            <Spinner />
            </div>
        )
    }
    const submitHandler = async (event) => {
        event.preventDefault()
        if (state.name==='' || state.description==='' || state.targetAmount===0 || state.duration===0 || state.targetAmount===null||state.duration===null||state.delay===null|| state.targetAmount.toString()==='' || state.duration.toString()===''||state.delay.toString()==='') {
            alert("your inputs seem to be invalid :(")
            return
        }
        await createCampaign(state.name, state.description, state.targetAmount, state.delay, state.duration)

    }
    const onChange = (event) => {
        setState({...state, [event.target.name]: event.target.value})
    }
    return (
        <div className="create-campaign">
            <p className="crowdify-header">CROWDIFY</p>
            <form className="create-campaign-form" onSubmit = {submitHandler}>
            <div className="form-input">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" value={state.name} onChange={onChange} placeholder="name" className="single-line"/>
            </div><div className="form-input">
            <label htmlFor="description">Description</label>
            <textarea className="campaign-description" name="description" value={state.description} onChange={onChange} placeholder="description"/>
            </div><div className="form-input">
            <label htmlFor="targetAmount">Target Amount</label>
            <input type="number" name="targetAmount" value={state.targetAmount} onChange={onChange} placeholder="target amount (SOL)" className="single-line digit"/>
            </div><div className="form-input">
            <label htmlFor="delay">Delay</label>
            <input type="number" name="delay" value={state.delay} onChange={onChange} placeholder="delay (hrs)" className="single-line digit"/>
            </div><div className="form-input">
            <label htmlFor="duration">Duration</label>
            <input type="number" name="duration" value={state.duration} onChange={onChange} placeholder="duration (hrs)" className="single-line digit"/>
            </div><div>
            </div>
            <input className="form-submit-btn" type="submit" value="Create Campaign" />
            </form>
            
        </div>
    )
}

export default CreateCampaign