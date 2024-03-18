import React, { useReducer } from 'react'
import Context from './context'
import Reducer from './reducer'
import { SET_CAMPAIGN, LOAD_CAMPAIGNS, SET_LOADING, SET_PROCESSING, UNSET_PROCESSING } from './types'
import * as anchor from "@project-serum/anchor"
import idl from '../utils/idl.json'
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { clusterApiUrl, Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { AnchorProvider, Program, BN, web3 } from '@project-serum/anchor'
import * as token from '@solana/spl-token'

const programId = new anchor.web3.PublicKey("BPkUzYUDvSXxoJZTHi2s4MCHEa37CnLVQLTfsXBDXMsa")

const State = (props) => {
    const { connection } = useConnection()
    const wallet = useWallet()
    const provider = new anchor.AnchorProvider(connection, wallet, 'processed')
    anchor.setProvider(provider)

    

    const getProvider = () => {
        const network = clusterApiUrl('devnet')
        const connection = new Connection(network, 'processed')
        const provider = new AnchorProvider(connection, wallet, 'processed')
        return provider
      }
      const test = async () => {
        const provider = getProvider()
        const program = new Program(idl, programId, provider)
        const accounts = await program.account.campaign.all([])
        console.log(accounts)
      }

    const initialState = {
        campaign: null,
        liveCampaigns: [],
        loading: false,
        processing: false,
    }

    const [state, dispatch] = useReducer(Reducer, initialState)

    const loadCampaigns = async () => {
        setLoading()
        const provider = getProvider()
        const program = new Program(idl, programId, provider)
        const rawCampaigns = await program.account.campaign.all([])

        const campaigns = rawCampaigns.map((campaign) => {
            const temp = campaign.account
            let res = {name: temp.name, description: temp.description, image: temp.img, admin: temp.admin.toString(), collectedAmount: (temp.collectedAmount.toNumber()/LAMPORTS_PER_SOL).toFixed(2), targetAmount: temp.targetAmount.toNumber()/LAMPORTS_PER_SOL, startTime: temp.startTime.toNumber(), endTime: temp.endTime.toNumber(), id: temp.id.toNumber() }
            return res
        })
        campaigns.sort((a,b)=>{return b.startTime-a.startTime})
        console.log(campaigns)
        dispatch({type: LOAD_CAMPAIGNS, payload: campaigns})
    }
    const setCampaign = async (campaign) => {
        setLoading()
        dispatch({type: SET_CAMPAIGN, payload: campaign})
    }
    const donate = async (solAmount) => {
        //campaign, user, mint, mintAuthority, tokenAccount, associatedTokenProgram, tokenProgram, systemProgram, rent
        const [campaign] = PublicKey.findProgramAddressSync([new BN(state.campaign.id).toArrayLike(Buffer, 'be', 8)], programId)
        const [mint] = PublicKey.findProgramAddressSync([Buffer.from("mint"), new BN(state.campaign.id).toArrayLike(Buffer, 'be', 8)], programId)
        const [mintAuthority] = PublicKey.findProgramAddressSync([Buffer.from("authority")], programId)
        const tokenAccount = token.getAssociatedTokenAddressSync(mint, wallet.publicKey)

        setProcessing()
        const provider = getProvider()
        const program = new Program(idl, programId, provider)
        try {
            const signature = await program.methods.donate(new BN(state.campaign.id), new BN(solAmount*LAMPORTS_PER_SOL))
        .accounts({
            campaign,
            user: wallet.publicKey,
            mint,
            mintAuthority,
            tokenAccount,
            associatedTokenProgram: token.ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenProgram: token.TOKEN_PROGRAM_ID,
            systemProgram: web3.SystemProgram.programId,
            rent: web3.SYSVAR_RENT_PUBKEY
        }).rpc()
        alert(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
        } catch (error) {
            alert(error)
        }
        
        unsetProcessing()
    }
    const createCampaign = async (name, description, targetAmount, delay, duration) => {
         //campaign, counter, mint, mintAuthority, user, tokenProgram, systemProgram, rent

         
         const [counter] = PublicKey.findProgramAddressSync([Buffer.from("counter")], programId)
         const [mintAuthority] = PublicKey.findProgramAddressSync([Buffer.from("authority")], programId)
 
         setProcessing()
         const provider = getProvider()
         const program = new Program(idl, programId, provider)
         const counterAccount = await program.account.campaignCounter.fetch(counter)
         const [campaign] = PublicKey.findProgramAddressSync([counterAccount.counter.toArrayLike(Buffer, 'be', 8)], programId)
         const [mint] = PublicKey.findProgramAddressSync([Buffer.from("mint"), counterAccount.counter.toArrayLike(Buffer, 'be', 8)], programId)
         try {
             const signature = await program.methods.createCampaign(name, description, 'https://png.pngitem.com/pimgs/s/130-1306754_pokemon-bulbasaur-hd-png-download.png', new BN(targetAmount*LAMPORTS_PER_SOL), new BN(delay), new BN(duration))
         .accounts({
             campaign,
             counter,
             mint,
             mintAuthority,
             user: wallet.publicKey,
             tokenProgram: token.TOKEN_PROGRAM_ID,
             systemProgram: web3.SystemProgram.programId,
             rent: web3.SYSVAR_RENT_PUBKEY
         }).rpc()
         alert(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
         } catch (error) {
             alert(error)
         }
         
         unsetProcessing()
    }


    const setLoading = () => dispatch({type: SET_LOADING})
    const unsetProcessing = () => dispatch({type: UNSET_PROCESSING})
    const setProcessing = () => dispatch({type: SET_PROCESSING})

    return (
        <Context.Provider
            value={{campaign: state.campaign, liveCampaigns: state.liveCampaigns, loading: state.loading, processing: state.processing, loadCampaigns, setCampaign, test, donate, createCampaign }}>
            {props.children}
        </Context.Provider>
    )
}

export default State