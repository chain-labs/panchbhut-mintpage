import Image from 'next/image';
import React, {useState} from 'react';
import CloseButton from 'public/static/images/close_button.png';
import Logo from 'public/static/images/menu_logo.png';

const DiscountCodeComp = () => {
	const [discountCode, setDiscountCode] = useState();
	return (
		<div className="flex bg-coupon-code-lg bg-no-repeat w-[50%] relative left-[25%] top-[150px]  justify-items-center items-center flex-col">
			<div className="relative left-[45%] top-2">
				<Image
					className="cursor-pointer"
					src={CloseButton}
					alt=""
				/>
			</div>
			<div className="mt-40 flex flex-col gap-1">
				<label className="text-[#ffa800]">ENTER COUPON CODE</label>
				<input
					className=" input w-48 h-[35px] bg-slate-400 rounded text-center pl-3 overflow-hidden"
					type="text"
					onWheel={e => {
						// @ts-ignore
						e.target?.blur();
					}}
					value={discountCode}
					onChange={e => setDiscountCode(e.target?.value)}
				/>
			</div>
			<button className="bg-button-sm w-[194px] h-20 border border-transparent rounded-lg object-fill text-[#0e0e0e] flex justify-center items-start bg-no-repeat mt-4">
				<div className="mt-3">APPLY</div>
			</button>
		</div>
	);
};

export default DiscountCodeComp;
