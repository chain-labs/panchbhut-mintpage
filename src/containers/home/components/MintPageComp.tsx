import React from 'react';
import ConnectWallet from '../../../components/Navbar/ConnectWallet';

const MintPageComp = () => {
	return (
		<div className="mint-page-1">
			<div className="sale-detail-box">
				<div>SUPPLY</div>
				<div>PRICE</div>
				<div>MINT</div>
			</div>
			<div className="wallet-button">
				<ConnectWallet />
			</div>
		</div>
	);
};

export default MintPageComp;
