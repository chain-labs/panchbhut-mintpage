import React, {useEffect, useState} from 'react';
import {db} from 'src/firebase';

const Test = () => {
	const [discountCode, setDiscountCode] = useState();
	// useEffect(() => {
	// 	getCollection();
	// });

	const getCollection = async () => {
		// let codes = await db.collection('discountCodes').doc(discountCode).get();
		// codes.forEach(doc => {
		// 	const data = doc.data();
		// 	console.log(data);
		// });
		// console.log(codes.data() == null);
		// if (codes.data() == null) {
		// 	console.log('codes are wrong');
		// 	return null;
		// } else {
		// 	console.log(codes.data());
		// 	return codes.data();
		// }
		console.log('Hi');
		let codes = await db
			.collection('discountCodes')
			.doc('PANCH-JOHN-1-50')
			.get();
		console.log(codes.data());
		// codes.forEach(doc => {
		// 	const data = doc.data();
		// 	console.log(data);
		// });
	};

	const applyDiscountCode = async () => {
		const discount_code = await getCollection();
		console.log(discount_code);
	};
	return (
		<div className="flex flex-col gap-2">
			<input
				className="input"
				type="text"
				onWheel={e => {
					// @ts-ignore
					e.target?.blur();
				}}
				value={discountCode}
				onChange={e => setDiscountCode(e.target?.value)}
			/>
			<button
				className="bg-yellow-100 w-50 rounded-sm"
				onClick={applyDiscountCode}
			>
				Apply code
			</button>
		</div>
	);
};

export default Test;
