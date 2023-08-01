import React, {useState} from 'react';
import ConnectWallet from '../../../components/Navbar/ConnectWallet';
import LogoComp from './LogoComp';

const MintPageComp = () => {
	const [supply, setSupply] = useState(100);
	const [price, setPrice] = useState(100);
	const [mint, setMint] = useState(100);

	return (
		<div>
			{/* <div className="mint-page-1">
				<div className="sale-detail-box">
					<div className="detail-text">
						<text>SUPPLY</text>
						<text>{supply}</text>
					</div>
					<div className="detail-text">
						<text>PRICE</text>
						<text>{price}</text>
					</div>
					<div className="detail-text">
						<text>MINT</text>
						<text>{mint}</text>
					</div>
				</div>
				<ConnectWallet />
			</div> */}
			<div className="flex justify-center items-center flex-col">
				<LogoComp />
				<div className="text-center text-[#ffa800]">
					{' '}
					Unique Multiverse storyline
					<div>20K+ possible mix of traits & layers</div>
					<div>Demi-Gods, Demons & Creatures 80+ Unique Characters</div>
					<div>8+ Clans</div>
					<div>Possibilities are endless!</div>
					<div>Panchbhut Gameverse Collect now to see</div>
					<div>what's in store for you! </div>
				</div>
				<button className="bg-collect-button w-[92%] h-20 object-contain text-[#0e0e0e] flex justify-center items-center bg-no-repeat rounded">
					Collect & Discover
				</button>
			</div>
		</div>
	);
};

export default MintPageComp;
