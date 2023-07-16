/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		// Or if using `src` directory:
		'./public/**/*.{js,ts,jsx,tsx}',

		'./src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'home-lg': "url('/static/images/mint_page_home.jpg')",
				'mint-page-lg': "url('/static/images/mint_page_mintpage.jpg')",
			},
		},
	},
	plugins: [],
};
