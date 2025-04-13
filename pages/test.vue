<template>
	<div class="p-6">
		<a :href="session.returnUrl" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 inline-block mb-4">Назад к курсу</a>

		<h1 class="text-2xl font-bold mb-4">Тест по работе с IP-адресами</h1>
		<div>Уважаемый {{ session.userFullName }}, выполните задания и нажмите кнопку отправить</div>
		<ClientOnly>
			<div v-for="(task, index) in tasks" :key="index" class="mb-6">
				<h2 class="text-xl font-semibold mb-2">Задача {{ index + 1 }}</h2>
				<p class="mb-4">{{ task.question }}</p>
				<label :for="'answer-' + index" class="block mb-2">Ваш ответ:</label>
				<input v-model="task.userAnswer" :id="'answer-' + index" type="text" class="border p-2 rounded w-full" />
				<p v-if="task.feedback !== null" class="mt-4 font-semibold">{{ task.feedback }}</p>
			</div>
			<button
				@click="checkAllAnswers"
				:disabled="submitted"
				class="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				Отправить ответ
			</button>
			<p v-if="score !== null" class="mt-6 text-lg font-bold">Ваша оценка: {{ score }}%</p>
			<a v-if="submitted" :href="session.returnUrl" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 inline-block mt-4"
				>Назад к курсу</a
			>
		</ClientOnly>
	</div>
</template>

<script setup>
	import { ref } from 'vue'
	import { useFetch } from '#app'

	const { session } = useUserSession()
	function generateRandomIP() {
		return Array(4)
			.fill(0)
			.map(() => Math.floor(Math.random() * 256))
			.join('.')
	}

	function generateRandomPrefix() {
		return Math.floor(Math.random() * 9) + 22 // Префикс от /22 до /30
	}

	function generateSimpleIP() {
		return `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
	}

	function generateTasks() {
		return [
			(() => {
				const prefix = generateRandomPrefix()
				return {
					question: `Сколько всего IP-адресов в сети с маской /${prefix}?`,
					correctAnswer: (2 ** (32 - prefix)).toString(),
					userAnswer: '',
					feedback: null,
				}
			})(),
			(() => {
				const prefix = generateRandomPrefix()
				const totalIPs = 2 ** (32 - prefix)
				const correctAnswer = prefix === 32 ? '1' : (totalIPs - 2).toString()
				return {
					question: `Сколько доступных для устройств IP-адресов в сети с маской /${prefix}?`,
					correctAnswer,
					userAnswer: '',
					feedback: null,
				}
			})(),
			(() => {
				const prefix = generateRandomPrefix()
				const mask = (0xffffffff << (32 - prefix)) >>> 0
				const correctAnswer = [(mask >>> 24) & 0xff, (mask >>> 16) & 0xff, (mask >>> 8) & 0xff, mask & 0xff].join('.')
				return {
					question: `Как выглядит маска /${prefix} в десятично-точечном формате?`,
					correctAnswer,
					userAnswer: '',
					feedback: null,
				}
			})(),
			(() => {
				const ip1 = generateSimpleIP()
				const ip2 = generateSimpleIP()
				const prefix = Math.floor(Math.random() * 3) + 24 // Префикс от /24 до /26
				const mask = (0xffffffff << (32 - prefix)) >>> 0

				const ipToInt = (ip) => ip.split('.').reduce((acc, octet) => (acc << 8) | parseInt(octet, 10), 0)

				const sameNetwork = (ipToInt(ip1) & mask) === (ipToInt(ip2) & mask)

				return {
					question: `Находятся ли IP-адреса ${ip1} и ${ip2} в одной сети с маской /${prefix}? (да/нет)`,
					correctAnswer: sameNetwork ? 'да' : 'нет',
					userAnswer: '',
					feedback: null,
				}
			})(),
			(() => {
				const prefix = generateRandomPrefix()
				const mask = [
					((0xffffffff << (32 - prefix)) >>> 24) & 0xff,
					((0xffffffff << (32 - prefix)) >>> 16) & 0xff,
					((0xffffffff << (32 - prefix)) >>> 8) & 0xff,
					(0xffffffff << (32 - prefix)) & 0xff,
				].join('.')
				return {
					question: `Какой префикс соответствует маске ${mask}?`,
					correctAnswer: `/${prefix}`,
					userAnswer: '',
					feedback: null,
				}
			})(),
		]
	}

	const tasks = ref(generateTasks())
	const score = ref(null)
	const submitted = ref(false)

	async function checkAllAnswers() {
		if (submitted.value) return
		let correctCount = 0
		tasks.value.forEach((task) => {
			if (task.userAnswer.trim() === task.correctAnswer) {
				task.feedback = 'Правильно!'
				correctCount++
			} else {
				task.feedback = `Неправильно. Правильный ответ: ${task.correctAnswer}`
			}
		})
		score.value = (correctCount / tasks.value.length) * 100 // Оценка в процентах
		submitted.value = true

		// Отправка оценки на сервер
		try {
			await useFetch('/api/send-grade', {
				method: 'POST',
				body: { grade: correctCount / tasks.value.length }, // Оценка от 0 до 1
			})
		} catch (error) {
			console.error('Ошибка при отправке оценки:', error)
		}
	}
</script>

<style scoped>
	/* Добавьте стили, если необходимо */
</style>
