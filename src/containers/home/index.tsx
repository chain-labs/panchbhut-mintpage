import React, {useState} from 'react';
import useCustomContract from '../../ethereum/useCustomContract';
import {useProvider} from 'wagmi';
import {ethers} from 'ethers';
import {CONTRACT_ADDRESS} from '../../utils/constants';

const HomeContainer = () => {
	const provider = useProvider();
	const [contract, setContract] = useState<ethers.Contract>();
	const contractAddress = CONTRACT_ADDRESS;

	return <div>HomeContainer</div>;
};

export default HomeContainer;
