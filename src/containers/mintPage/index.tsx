import React, {useEffect, useState} from 'react';
import ConnectWallet from 'src/components/Navbar/ConnectWallet';
import {useAppSelector} from 'src/redux/hooks';
import {userSelector} from 'src/redux/user';
import {useProvider, useSigner} from 'wagmi';
import {
	getIsMintAllowListed,
	getMerkleHashes,
	getMintType,
	hashQueryData,
} from './utils';
import {BigNumber, ethers} from 'ethers';
import {MINTS, SALE_ID} from './constants';
import toast, {Toaster} from 'react-hot-toast';
import If from 'src/components/If';
import DiscountCodeComp from './components/DiscountCodeComp';
import LogoComp from './components/LogoComp';
import Image from 'next/image';
import PlusImg from 'public/static/images/plus.png';
import MinusImg from 'public/static/images/minus.png';
import {networkSelector} from 'src/redux/network';
import Buttonbg from 'public/static/images/BUTTON.png';
import MerkleTree from 'merkletreejs';

const MintPageComp = ({contract, signer}) => {
	const [saleCategory, setSaleCategory] = useState();
	const [discounted, setDiscounted] = useState<boolean>();
	const [allowListed, setAllowListed] = useState<boolean>();
	const [mintType, setMintType] = useState<number>();
	const [price, setPrice] = useState<BigNumber>();
	const [noOfTokens, setNoOfTokens] = useState<number>(1);
	const [showDiscountComp, setShowDiscountComp] = useState<boolean>(false);
	const [discountCode, setDiscountCode] = useState('');
	const user = useAppSelector(userSelector);
	const [supply, setSupply] = useState<number>();
	const [tokensMinted, setTokensMinted] = useState<number>();
	const [loading, setLoading] = useState(false);
	const [perTransactionLimit, setPerTransactionLimit] = useState<number>();
	const [perWalletLimit, setPerWalletLimit] = useState<number>();
	const provider = useProvider();
	const network = useAppSelector(networkSelector);

	useEffect(() => {
		const getSaleCategory = async () => {
			console.log(contract);
			try {
				console.log(contract);
				const saleCategory = await contract?.callStatic?.getSaleCategory(1);
				setSaleCategory(saleCategory);
				console.log('sale category', saleCategory);
			} catch (err) {
				console.log(err);
			}
		};

		if (contract && network.isValid) {
			console.log(contract?.callStatic?.getSaleCategory(1));
			getSaleCategory();
		}
	}, [contract]);

	useEffect(() => {
		//If saleCategory is present then it get the required details like isDiscountEnabled,price,merkleroot
		//for understanding the mint type
		if (saleCategory) {
			console.log(saleCategory);
			console.log(saleCategory !== undefined);
			const isDiscountEnabled = saleCategory['isDiscountEnabled'];
			const merkleRoot = saleCategory['merkleRoot'];
			const price = saleCategory['price'];
			const nftSupply = saleCategory['supply'];
			const tokens_minted = saleCategory['tokensMinted'];
			const transactionsLimit = saleCategory['perTransactionLimit'];
			const walletLimit = saleCategory['perWalletLimit'];
			const balance = provider.getBalance(contract.address).then(balance => {
				// convert a currency unit from wei to ether
				const balanceInEth = ethers.utils.formatEther(balance);
				console.log(`balance: ${balanceInEth} ETH`);
			});
			console.log(balance);
			// console.log(ethers.utils.formatUnits(balance));
			setPerTransactionLimit(parseInt(transactionsLimit));
			setPerWalletLimit(parseInt(walletLimit));
			setSupply(parseInt(nftSupply));
			setTokensMinted(parseInt(tokens_minted));
			setPrice(price);
			setDiscounted(isDiscountEnabled);
			setAllowListed(getIsMintAllowListed(merkleRoot));
		}
	}, [saleCategory, contract]);

	useEffect(() => {
		//It checks allowlisted and discounted conditions and the setMintType accordingly
		const getCurrentMintType = async () => {
			const mint_type = await getMintType(allowListed, discounted);
			setMintType(mint_type);
			console.log('Current Mint Type', mint_type);
		};
		getCurrentMintType();
	}, [discounted, allowListed]);

	//Below function checks the mint type and according to the minttype it calls the required function
	const mintController = async () => {
		setLoading(true);
		if (noOfTokens) {
			console.log(mintType);
			if (mintType === MINTS.DISCOUNTED_ALLOWLISTED) {
				console.log('Mint is discounted allowlisted');
			} else if (mintType === MINTS.PUBLIC) {
				console.log('Mint is public');
				console.log('INPUT OF PUBLIC MINT', {
					address: user.address,
					Tokens: noOfTokens,
					saleId: SALE_ID.PUBLIC,
					value: BigNumber.from(noOfTokens).mul(price),
				});
				console.log(signer);
				try {
					const transaction = await contract
						?.connect(signer)
						?.mintPublic(user.address, noOfTokens, parseInt(SALE_ID.PUBLIC), {
							value: BigNumber.from(noOfTokens).mul(price),
						});
					const event = (await transaction.wait()).events?.filter(event => {
						console.log(event.event);
						console.log(event);
						console.log(event.event === 'Transfer');
					});
					setLoading(false);
					console.log(transaction);
				} catch (error) {
					console.log({error});
					toast(`❌ Something went wrong! Please Try Again`);
					setLoading(false);
				}
			} else if (mintType === MINTS.DISCOUNTED) {
				console.log('Mint is discounted');
			} else if (mintType === MINTS.ALLOWLISTED) {
				console.log('Mint is allowlisted');
				const hashCID = 'QmT8f4uVSiUAMHB7P4Ln617ZnwqUhEjEMPNBttMrvd5L5Z';
				console.log({hashCID});
				getMerkleHashes(hashCID).then(async hashes => {
					console.log({hashes});
					//@ts-expect-error
					const leafs = hashes.map(entry => ethers.utils.keccak256(entry));
					const tree = new MerkleTree(leafs, ethers.utils.keccak256);
					// console.log({leafs, tree});
					const leaf = ethers.utils.keccak256(leafs[1]);
					const proofs = tree.getHexProof(leafs[1]);
					console.log({proofs});
					try {
						const transaction = await contract
							?.connect(signer)
							?.mintAllowlisted(user.address, noOfTokens, proofs, 10, {
								value: BigNumber.from(noOfTokens).mul(price),
							});
						console.log(transaction);
						setLoading(false);
					} catch (error) {
						console.log({error});
						toast(`❌ Something went wrong! Please Try Again`);
						setLoading(false);
					}
				});
			}
		} else {
			console.log('No of tokens is not provided');
		}
	};

	useEffect(() => {
		if (noOfTokens <= 0) {
			setNoOfTokens(1);
		}
		if (noOfTokens > perTransactionLimit) {
			setNoOfTokens(perTransactionLimit);
		}
	}, [noOfTokens]);

	// useEffect(() => {
	// 	const hashCID = 'QmT8f4uVSiUAMHB7P4Ln617ZnwqUhEjEMPNBttMrvd5L5Z';
	// 	console.log({hashCID});
	// 	getMerkleHashes(hashCID).then(hashes => {
	// 		console.log({hashes});
	// 		const leafs = hashes.map(entry => ethers.utils.keccak256(entry));
	// 		const tree = new MerkleTree(leafs, ethers.utils.keccak256);
	// 		// console.log({leafs, tree});
	// 		const leaf = ethers.utils.keccak256(leafs[0]);
	// 		const proofs = tree.getHexProof(leafs[0]);
	// 		console.log({proofs});
	// 	});
	// }, []);

	return (
		<div className="flex justify-center items-center flex-col">
			<If
				condition={user.exists}
				then={
					// <div className="flex justify-center items-center absolute top-[25%]">
					// 	<DiscountCodeComp
					// 		setDiscountCode={setDiscountCode}
					// 		setShowDiscountComp={setShowDiscountComp}
					// 		discountCode={discountCode}
					// 	/>
					// </div>
					<div className="flex justify-center items-center flex-col">
						<LogoComp />
						<If
							condition={!showDiscountComp}
							then={
								<div className="flex flex-col gap-8">
									<If
										condition={saleCategory !== undefined && network.isValid}
										then={
											<div className=" w-[500px] flex justify-around items-center text-[#ffa800]">
												<div className="flex flex-col  items-center">
													<text>Supply</text>
													<text>{supply ? supply : ''}</text>
												</div>
												<div className="flex flex-col  items-center">
													<text>Price</text>
													<text>
														{price ? ethers.utils.formatUnits(price) : ''} ETH
													</text>
												</div>
												<div className="flex flex-col  items-center">
													<text>Minted</text>
													<text>
														{tokensMinted ? tokensMinted : 0}/{supply}
													</text>
												</div>
											</div>
										}
									/>

									<div className="flex flex-col items-center">
										<label className="text-[#ffa800]">MINT QTY</label>
										<div className="flex justify-center items-center gap-2">
											<button
												className="mt-2"
												onClick={e => setNoOfTokens(noOfTokens - 1)}
											>
												<Image
													src={MinusImg}
													alt=""
												/>
											</button>
											<input
												className="input w-20 h-[35px] bg-slate-300 rounded text-center text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
												type="number"
												onWheel={e => {
													// @ts-ignore
													e.target?.blur();
												}}
												min={1}
												max={`${perTransactionLimit}`}
												value={noOfTokens}
												onChange={e => setNoOfTokens(parseInt(e.target?.value))}
											/>
											<button
												className="mt-2"
												onClick={e => setNoOfTokens(noOfTokens + 1)}
											>
												<Image
													src={PlusImg}
													alt=""
												/>
											</button>
										</div>
										<a
											className="text-[#5fca00] cursor-pointer"
											onClick={e => setShowDiscountComp(true)}
										>
											APPLY COUPON CODE
										</a>
										<button
											className="bg-button-sm w-[183px] h-20 border border-transparent rounded-lg object-fill text-[#0e0e0e] flex justify-center items-start bg-no-repeat mt-4"
											onClick={mintController}
										>
											<div className="mt-3">{loading ? 'MINTING' : 'MINT'}</div>
										</button>
									</div>
								</div>
							}
							else={
								// <div className="flex justify-center items-center flex-col gap-14">
								// 	<div className="w-[500px] flex justify-center items-center">
								// 		<ConnectWallet />
								// 	</div>
								// </div>
								<div className="flex justify-center items-center absolute top-[25%]">
									<DiscountCodeComp
										setDiscountCode={setDiscountCode}
										setShowDiscountComp={setShowDiscountComp}
										discountCode={discountCode}
									/>
								</div>
							}
						/>
					</div>
				}
				else={
					<div className="flex justify-center items-center flex-col gap-14">
						<div className="w-[500px] flex justify-center items-center">
							<ConnectWallet />
						</div>
					</div>
				}
			/>
		</div>
	);
};

export default MintPageComp;
