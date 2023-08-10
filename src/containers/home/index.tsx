import React, {useEffect, useState} from 'react';
import useCustomContract, {
	getContractDetails,
} from 'src/ethereum/useCustomContract';
import {useProvider, useSigner} from 'wagmi';
import {ethers} from 'ethers';
import {CONTRACT_ADDRESS} from 'src/utils/constants';
import {useAppSelector} from 'redux/hooks';
import {userSelector} from 'redux/user';
import LogoComp from '../mintPage/components/LogoComp';
import {useRouter} from 'next/router';

const HomeContainer = () => {
	const provider = useProvider();
	const [contract, setContract] = useState<ethers.Contract>();
	const contractAddress = CONTRACT_ADDRESS;
	const {data: signer} = useSigner();
	const user = useAppSelector(userSelector);
	const {push} = useRouter();

	useEffect(() => {
		if (contractAddress && provider) {
			const abi = getContractDetails();
			const contract = new ethers.Contract(contractAddress, abi, signer);
			console.log(contract);
			setContract(contract);
		}
	}, [contractAddress, provider, signer, user]);

	return (
		<div className=" min-h-screen bg-home-lg bg-cover bg-center bg-no-repeat ">
			<div className="flex justify-center items-center flex-col">
				<LogoComp />
				<div className="flex justify-center items-center flex-col">
					<div className="text-center text-[#ffa800] text-[17px] flex flex-col gap-1">
						{' '}
						<div>Unique Multiverse storyline</div>
						<div>20K+ possible mix of traits & layers</div>
						<div>Demi-Gods, Demons & Creatures </div>
						<div>80+ Unique Characters</div>
						<div>8+ Clans</div>
					</div>
					<div className="text-[#ffffff] text-[22px]">
						Possibilities are endless!
					</div>
					<div className="text-[#ffa800] text-[32px]">Panchbhut Gameverse</div>
					<div className="text-[#ffffff] text-[22px]">
						Collect now to see what's in store for you!{' '}
					</div>
				</div>
				<div>
					<button
						className="bg-collect-button w-[368px] h-20 text-[#0e0e0e] flex justify-center items-center bg-no-repeat rounded "
						onClick={() => push('/mint-page')}
					>
						<div className="text-[#0e0e0e] text-[16px] font-bold mt-1">
							Collect & Discover
						</div>
					</button>
				</div>
			</div>
		</div>
		// 	}
		// />
	);
};

export default HomeContainer;
