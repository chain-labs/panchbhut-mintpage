import React, {useState} from 'react';
import LogoComp from './LogoComp';
import ConnectWallet from 'src/components/Navbar/ConnectWallet';
import PlusImg from 'public/static/images/plus.png';
import MinusImg from 'public/static/images/minus.png';

import Image from 'next/image';
import DiscountCodeComp from './DiscountCodeComp';
import If from 'src/components/If';

const MintPageComp2 = () => {
	const [noOfTokens, setNoOfTokens] = useState(0);
	const [applyDiscoundCode, setApplyDiscountCode] = useState<boolean>(false);
	return (
		<div>
			<If
				condition={applyDiscoundCode}
				then={<DiscountCodeComp />}
				else={
					<div className="flex justify-center items-center flex-col gap-10">
						<LogoComp />
						<div className=" w-[500px] flex justify-around items-center text-[#ffa800]">
							<div>Supply</div>
							<div>Supply</div>
							<div>Supply</div>
						</div>
						{/* <ConnectWallet /> */}
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
									className="input w-20 h-[35px] bg-slate-300 rounded text-center pl-3 overflow-hidden"
									type="number"
									onWheel={e => {
										// @ts-ignore
										e.target?.blur();
									}}
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
								onClick={e => setApplyDiscountCode(true)}
							>
								APPLY COUPON CODE
							</a>
							<button className="bg-button-sm w-[183px] h-20 border border-transparent rounded-lg object-fill text-[#0e0e0e] flex justify-center items-start bg-no-repeat mt-4">
								<div className="mt-3">MINT</div>
							</button>
						</div>
					</div>
				}
			/>
		</div>
	);
};

export default MintPageComp2;
