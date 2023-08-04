import React, {useEffect} from 'react';
import {db} from 'src/firebase';

const Test = () => {
	useEffect(() => {
		getCollection();
	});

	const getCollection = async () => {
		let codes = await db
			.collection('discountCodes')
			.doc('PANCH-JOHN-1-50')
			.get();
		// codes.forEach(doc => {
		// 	const data = doc.data();
		// 	console.log(data);
		// });
		console.log(codes.data() == null);
		if (codes.data() == null) {
			console.log('codes are wrong');
		} else {
			console.log(codes.data());
		}
	};

	return <div>Hi</div>;
};

export default Test;
