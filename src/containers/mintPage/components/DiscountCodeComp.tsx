import Image from 'next/image';
import React, {useState} from 'react';
import CloseButton from 'public/static/images/close_button.png';
import {db} from 'src/firebase';
import toast from 'react-hot-toast';

interface Props {
	setDiscountCode: (any) => void;
	setShowDiscountComp: (boolean) => void;
	discountCode: any;
}

const DiscountCodeComp = ({
	setDiscountCode,
	setShowDiscountComp,
	discountCode,
}: Props) => {
	const [inputCode, setInputCode] = useState('');

	// useEffect(() => {
	// 	getCollection();
	// });

	const getCollection = async () => {
		if (inputCode !== '') {
			let codes = await db
				.collection('discountCodes')
				.doc(inputCode.toUpperCase())
				.get();
			// codes.forEach(doc => {
			// 	const data = doc.data();
			// 	console.log(data);
			// });
			console.log(codes.data());
			if (codes.data() == null) {
				console.log('codes are wrong');
				toast('❌ Code is Invalid');
				setInputCode('');
				return null;
			} else {
				console.log(codes.data());
				setDiscountCode(codes.data());
				setShowDiscountComp(false);
				return codes.data();
			}
		}
	};

	const applyDiscountCode = async () => {
		const discount_code = await getCollection();
		console.log(discount_code);
	};
	return (
		<div className="flex bg-coupon-code-lg bg-no-repeat w-[693px] h-[419px] justify-center items-center flex-col ">
			<div
				className="relative left-[45%] top-[-7px]"
				onClick={() => setShowDiscountComp(false)}
			>
				<Image
					className="cursor-pointer"
					src={CloseButton}
					alt=""
				/>
			</div>
			<div className="mt-40 flex flex-col gap-1">
				<label className="text-[#ffa800]">ENTER COUPON CODE</label>
				<input
					className=" input w-48 h-[35px] bg-slate-300 text-black rounded text-center pl-3 overflow-hidden"
					type="text"
					onWheel={e => {
						// @ts-ignore
						e.target?.blur();
					}}
					value={inputCode}
					onChange={e => setInputCode(e.target?.value)}
				/>
			</div>
			<button
				className="bg-button-sm w-[194px] h-20 border border-transparent rounded-lg object-fill text-[#0e0e0e] flex justify-center items-start bg-no-repeat mt-4"
				onClick={applyDiscountCode}
			>
				<div className="mt-3 font-bold">APPLY</div>
			</button>
		</div>
	);
};

export default DiscountCodeComp;
