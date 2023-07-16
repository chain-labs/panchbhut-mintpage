import React from 'react';
import ConnectWallet from 'src/components/Navbar/ConnectWallet';
import mintPageHome from 'public/static/images/mint_page_home.jpg';

const MintPage = ({contract}) => {
	return (
		<div className="">
			<input
				className="input"
				type="number"
				onWheel={e => {
					// @ts-ignore
					e.target?.blur();
				}}
			/>
			<button className="mint-btn">Mint</button>
			<ConnectWallet />
		</div>
	);
};

export default MintPage;
