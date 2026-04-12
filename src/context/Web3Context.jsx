import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { auth, signInAnonymously } from '../firebaseConfig';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [reputation, setReputation] = useState(0);
    const [badges, setBadges] = useState([]);
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [signer, setSigner] = useState(null);

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contractABI = [
        "function reputationPoints(address) view returns (uint256)",
        "event BadgeIssued(address responder, uint256 tokenId, string uri)",
        "function resolveIncidentAndReward(uint256 lat, uint256 lng, string mediaHash, uint256 points, string tokenURI) external"
    ];

    const connectApp = async () => {
        // 1. Instantly trigger MetaMask to preserve User Click Gesture Security
        if (window.ethereum) {
            try {

                // Ethers v5 setup
                const prov = new ethers.providers.Web3Provider(window.ethereum);
                await prov.send("eth_requestAccounts", []);
                const sign = prov.getSigner();
                const acc = await sign.getAddress();

                // **CRITICAL FIX**: Safely handle network switching
                try {
                    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
                    if (currentChainId !== '0x7a69') {
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: '0x7a69' }], // Hex for 31337
                        });
                    }
                } catch (switchError) {
                    if (switchError.code === 4902) {
                        try {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainId: '0x7a69',
                                        chainName: 'AegisStay Local Node (Hardhat)',
                                        rpcUrls: ['http://127.0.0.1:8545/'],
                                        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }
                                    },
                                ],
                            });
                        } catch (addError) {
                            console.warn("Could not add chain automatically", addError);
                        }
                    } else {
                        // If it's already pending (-32002) or rejected, we STILL proceed 
                        // so the app connects! The user might already be on the right network anyway.
                        console.warn("Network switch non-fatal warning:", switchError);
                    }
                }

                setProvider(prov);
                setSigner(sign);
                setAccount(acc);
                // Mocking Data for Demo
                setReputation(150);
                setBadges([{ id: 1, name: 'AegisStay Hero SBT' }]);
            } catch (err) {
                console.error("Metamask error", err);
                alert(`Metamask connection failed: ${err.message || 'Check console'}`);
                return; // Don't proceed if Metamask entirely fails to fetch accounts
            }
        } else {
            alert("Please install MetaMask to use Web3 features.");
        }

        // 2. Firebase Auth (Running after Metamask so it doesnt block UI)
        try {
            if (auth && typeof signInAnonymously === 'function') {
                const credential = await signInAnonymously(auth);
                setFirebaseUser(credential.user);
            } else {
                setFirebaseUser({ uid: `did-user-${Date.now()}`, isAnonymous: true });
            }
        } catch (e) {
            console.warn("Firebase Auth fallback loaded:", e);
            setFirebaseUser({ uid: 'mock-firebase-123', isAnonymous: true });
        }
    };

    const dispatchOnChainSOS = async (points, uri) => {
        if (!signer) {
            alert("CRITICAL: Signer is null! The Web3 wallet must be connected before triggering this.");
            return false;
        }
        try {
            const directAccount = await signer.getAddress();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            console.log("Submitting incident metrics...");

            // Pure Ethers v5 standard transaction execution - Just 1 single unified MetaMask popup confirmation!
            const tx = await contract.resolveIncidentAndReward(1234, 5678, "ipfs-img-hash-1234", points, uri);
            await tx.wait();

            return true;
        } catch (err) {
            console.error("Transact Error", err);
            alert(`Blockchain Transaction Failed:\n${err.message || 'Check Browser Console for specific reverted logic'}`);
            return false;
        }
    }

    return (
        <Web3Context.Provider value={{ account, firebaseUser, connectApp, reputation, badges, dispatchOnChainSOS }}>
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3 = () => useContext(Web3Context);
