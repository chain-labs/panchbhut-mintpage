import React, {useEffect, useState} from 'react';
import {ConnectButton} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import {useSigner, useSwitchNetwork} from 'wagmi';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {
	removeUser,
	setProvider,
	setSigner,
	setUser,
	userSelector,
} from '../../redux/user';
import {networkSelector, setNetwork} from 'src/redux/network';
import {TEST_ENV, getChain, getNetwork} from 'src/utils/constants';
import {networks} from 'src/redux/user/types';
const ConnectWallet = () => {
	const dispatch = useAppDispatch();

	const user = useAppSelector(userSelector);
	const network = useAppSelector(networkSelector);
	const {switchNetwork} = useSwitchNetwork();
	const correctChain = getChain();
	const {data: Signer} = useSigner();
	const [wrongNetwork, setWrongNetwork] = useState(false);

	const changeNetwork = () => {
		switchNetwork?.(parseInt(correctChain));
	};
	useEffect(() => {}, [network]);

	return (
		<ConnectButton.Custom>
			{({
				account,
				chain,
				openConnectModal,
				openChainModal,
				openAccountModal,
			}) => {
				useEffect(() => {
					if (process.browser) {
						window?.ethereum.on('chainChanged', chainId => {
							const chain = parseInt(chainId, 16);

							if (correctChain == chain.toString()) {
								setWrongNetwork(false);
							} else {
								setWrongNetwork(true);
								dispatch(removeUser());
							}
						});
					}
				}, []);

				useEffect(() => {
					console.log(Signer);
					// dispatch(setSigner(Signer));
				}, [Signer]);

				useEffect(() => {
					if (user.signer) {
						try {
							user.signer
								.getAddress()
								.then(address => {
									dispatch(setUser(address));
								})
								.catch(err => {
									console.log({err});
								});
						} catch (err) {
							console.log(err);
						}
					}
				}, [user.signer]);
				useEffect(() => {
					if (user.address) {
						dispatch(setNetwork({chainId: chain?.id, name: chain?.name}));
						console.log(chain?.id, chain?.name);
					}
				}, [user, chain?.id]);

				useEffect(() => {
					if (account?.address) {
						if (chain?.id === parseInt(correctChain)) {
							dispatch(setUser(account.address));
						}
					}
				}, [account]);

				return (
					<div>
						{(() => {
							if (!account?.address) {
								return (
									<button
										onClick={openConnectModal}
										type="button"
										className="mr-3 rounded-lg bg-yellow-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-yellow-800 focus:outline-none focus:ring-4 focus:ring-violet-300  md:mr-0"
									>
										Connect Wallet
									</button>
								);
							}
							if (chain?.id !== parseInt(correctChain)) {
								return (
									<button
										onClick={changeNetwork}
										type="button"
										className="mr-3 rounded-lg bg-violet-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-violet-800 focus:outline-none focus:ring-4 focus:ring-violet-300   md:mr-0"
									>
										Please switch network
									</button>
								);
							}
							if (user.exists) {
								return (
									<div
										style={{display: 'flex', gap: 12}}
										className="mr-3 rounded-lg bg-violet-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-violet-800 focus:outline-none focus:ring-4 focus:ring-violet-300   md:mr-0"
									>
										<button
											onClick={openChainModal}
											style={{display: 'flex', alignItems: 'center'}}
											type="button"
										>
											{chain?.hasIcon && (
												<div
													style={{
														background: chain.iconBackground,
														width: 12,
														height: 12,
														borderRadius: 999,
														overflow: 'hidden',
														marginRight: 4,
													}}
												>
													{chain?.iconUrl && (
														<img
															alt={chain.name ?? 'Chain icon'}
															src={chain.iconUrl}
															style={{width: 12, height: 12}}
														/>
													)}
												</div>
											)}
											{chain?.name}
										</button>
										<button
											onClick={openAccountModal}
											type="button"
										>
											{account?.displayName}
											{account?.displayBalance
												? ` (${account?.displayBalance})`
												: ''}
										</button>
									</div>
								);
							}
						})()}
					</div>
				);
			}}
		</ConnectButton.Custom>
	);
};

export default ConnectWallet;
