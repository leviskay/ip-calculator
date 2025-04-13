// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-04-13',
	devtools: { enabled: true },
	modules: ['@nuxtjs/tailwindcss', 'nuxt-auth-utils'],
	css: ['~/assets/css/main.css'],
	app: {
		head: {
			title: 'IP Calculator для обучения',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'description', content: 'Образовательный IP калькулятор для изучения сетевой адресации' },
			],
		},
	},

	devServer: {
		port: 3000,
		host: '0.0.0.0',
	},
})
