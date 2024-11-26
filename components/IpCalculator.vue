<template>
  <form @submit.prevent="handleSubmit" class="max-w-4xl mx-auto p-6">
    <div class="bg-white shadow-xl rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-6">IP Калькулятор</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">IP адрес</label>
          <input 
            v-model="ipAddress"
            type="text"
            @input="validateIp"
            @keydown.enter="handleEnter"
            :class="['mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500', 
              ipError ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500']"
            placeholder="192.168.1.1"
          />
          <p v-if="ipError" class="mt-1 text-sm text-red-600">{{ ipError }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Маска подсети</label>
          <input 
            v-model="subnetMask"
            type="text"
            @input="validateMask"
            @keydown.enter="handleEnter"
            :class="['mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500',
              maskError ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500']"
            placeholder="255.255.255.0"
          />
          <p v-if="maskError" class="mt-1 text-sm text-red-600">{{ maskError }}</p>
        </div>

        <div class="flex space-x-4">
          <button 
            type="submit"
            :disabled="!isValid"
            :class="['flex-1 px-4 py-2 rounded-md transition-colors duration-200',
              isValid ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed']"
          >
            Рассчитать
          </button>

          <button 
            type="button"
            v-if="networkInfo"
            @click="resetCalculator"
            class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Сбросить
          </button>
        </div>

        <div v-if="networkInfo" class="mt-6 space-y-4">
          <div class="bg-gray-50 p-4 rounded-md">
            <h3 class="font-semibold text-lg mb-4">Результаты расчета:</h3>
            <div class="space-y-4">
              <div class="p-3 bg-white rounded shadow-sm">
                <p class="font-medium text-gray-700">Введенный IP-адрес:</p>
                <p>{{ ipAddress }}</p>
                <p class="text-sm font-mono mt-1">
                  <span class="text-gray-600">Двоичное представление: </span>
                  <span v-html="ipBinary"></span>
                </p>
              </div>

              <div class="p-3 bg-white rounded shadow-sm">
                <p class="font-medium text-gray-700">Маска подсети:</p>
                <p>{{ subnetMask }}</p>
                <p class="text-sm font-mono mt-1">
                  <span class="text-gray-600">Двоичное представление: </span>
                  <span v-html="maskBinary"></span>
                </p>
              </div>

              <div class="p-3 bg-white rounded shadow-sm">
                <p class="font-medium text-gray-700">Адрес сети:</p>
                <p>{{ networkInfo.networkAddress }}</p>
                <p class="text-sm font-mono mt-1">
                  <span class="text-gray-600">Двоичное представление: </span>
                  <span v-html="networkBinary"></span>
                </p>
              </div>
              
              <div class="p-3 bg-white rounded shadow-sm">
                <p class="font-medium text-gray-700">Широковещательный адрес:</p>
                <p>{{ networkInfo.broadcastAddress }}</p>
                <p class="text-sm font-mono mt-1">
                  <span class="text-gray-600">Двоичное представление: </span>
                  <span v-html="broadcastBinary"></span>
                </p>
              </div>
              
              <div class="p-3 bg-white rounded shadow-sm">
                <p><span class="font-medium text-gray-700">Количество хостов:</span> {{ networkInfo.totalHosts }}</p>
                <p><span class="font-medium text-gray-700">Диапазон IP:</span> {{ networkInfo.firstHost }} - {{ networkInfo.lastHost }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!networkInfo" class="mt-8">
          <h3 class="text-lg font-semibold mb-4">Подсказка:</h3>
          <div class="bg-blue-50 p-4 rounded-md text-sm">
            <p>IP адрес должен состоять из четырех чисел от 0 до 255, разделенных точками (например, 192.168.1.1)</p>
            <p class="mt-2">Маска подсети может быть записана в формате:</p>
            <ul class="list-disc list-inside ml-4 mt-1">
              <li>255.255.255.0</li>
              <li>/24 (число от 0 до 32)</li>
            </ul>
            <p class="mt-2 text-xs">
              <span class="font-bold text-indigo-600">Жирным</span> выделена сетевая часть адреса
            </p>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Address4 } from 'ip-address'

const ipAddress = ref('')
const subnetMask = ref('')
const networkInfo = ref(null)
const currentCidr = ref(0)
const ipError = ref('')
const maskError = ref('')

const isValid = computed(() => {
  return !ipError.value && !maskError.value && ipAddress.value && subnetMask.value
})

function isValidIpNumber(num) {
  const n = parseInt(num)
  return !isNaN(n) && n >= 0 && n <= 255 && num === n.toString()
}

function validateIp() {
  const parts = ipAddress.value.split('.')
  
  if (parts.length !== 4) {
    ipError.value = 'IP адрес должен состоять из 4 чисел, разделенных точками'
    return false
  }
  
  for (const part of parts) {
    if (!isValidIpNumber(part)) {
      ipError.value = 'Каждое число должно быть от 0 до 255'
      return false
    }
  }
  
  ipError.value = ''
  return true
}

function validateMask() {
  if (subnetMask.value.startsWith('/')) {
    const cidr = parseInt(subnetMask.value.slice(1))
    if (isNaN(cidr) || cidr < 0 || cidr > 32) {
      maskError.value = 'CIDR должен быть числом от 0 до 32'
      return false
    }
  } else {
    const parts = subnetMask.value.split('.')
    if (parts.length !== 4) {
      maskError.value = 'Маска должна состоять из 4 чисел, разделенных точками'
      return false
    }
    
    let previousPart = 255
    for (const part of parts) {
      if (!isValidIpNumber(part)) {
        maskError.value = 'Каждое число должно быть от 0 до 255'
        return false
      }
      const currentPart = parseInt(part)
      if (previousPart !== 255 && currentPart !== 0) {
        maskError.value = 'Некорректная маска подсети'
        return false
      }
      previousPart = currentPart
    }
  }
  
  maskError.value = ''
  return true
}

function toBinary(num) {
  return parseInt(num).toString(2).padStart(8, '0')
}

function formatBinaryIP(ip, cidr, isNetworkPart = true) {
  if (!ip) return ''
  
  const parts = ip.split('.')
  const binaryParts = parts.map(part => toBinary(part))
  const binaryString = binaryParts.join('.')
  
  const totalBits = 32
  const bitsWithDots = totalBits + 3 
  const networkBits = cidr
  
  let result = ''
  let currentBit = 0
  
  for (let i = 0; i < binaryString.length; i++) {
    if (binaryString[i] === '.') {
      result += '.'
      continue
    }
    
    if ((currentBit < networkBits && isNetworkPart) || 
        (currentBit >= networkBits && !isNetworkPart)) {
      result += `<span class="font-bold text-indigo-600">${binaryString[i]}</span>`
    } else {
      result += binaryString[i]
    }
    currentBit++
  }
  
  return result
}

const ipBinary = computed(() => {
  if (!ipAddress.value) return ''
  return formatBinaryIP(ipAddress.value, currentCidr.value)
})

const maskBinary = computed(() => {
  if (!subnetMask.value) return ''
  let mask = subnetMask.value
  if (mask.startsWith('/')) {
    const cidr = parseInt(mask.slice(1))
    mask = cidrToMask(cidr)
  }
  return formatBinaryIP(mask, 32, true)
})

const networkBinary = computed(() => {
  if (!networkInfo.value) return ''
  return formatBinaryIP(networkInfo.value.networkAddress, currentCidr.value)
})

const broadcastBinary = computed(() => {
  if (!networkInfo.value) return ''
  return formatBinaryIP(networkInfo.value.broadcastAddress, currentCidr.value)
})

function cidrToMask(cidr) {
  const mask = new Array(4).fill(0)
  for (let i = 0; i < cidr; i++) {
    mask[Math.floor(i / 8)] |= 1 << (7 - (i % 8))
  }
  return mask.join('.')
}

function calculateNetwork() {
  try {
    if (!validateIp() || !validateMask()) {
      return
    }

    let cidr
    if (subnetMask.value.startsWith('/')) {
      cidr = parseInt(subnetMask.value.slice(1))
    } else {
      const parts = subnetMask.value.split('.')
      let binaryMask = parts.map(part => 
        parseInt(part).toString(2).padStart(8, '0')
      ).join('')
      
      cidr = binaryMask.split('1').length - 1
    }

    currentCidr.value = cidr

    const ipWithCidr = `${ipAddress.value}/${cidr}`
    const ip = new Address4(ipWithCidr)

    const networkAddress = ip.startAddress().address
    const broadcastAddress = ip.endAddress().address

    const totalHosts = Math.pow(2, 32 - cidr) - 2

    const firstHost = incrementIP(networkAddress)
    const lastHost = decrementIP(broadcastAddress)

    networkInfo.value = {
      networkAddress,
      broadcastAddress,
      totalHosts,
      firstHost,
      lastHost
    }
  } catch (error) {
    alert('Произошла ошибка при расчете')
    console.error(error)
  }
}

function incrementIP(ip) {
  const parts = ip.split('.')
  parts[3] = parseInt(parts[3]) + 1
  return parts.join('.')
}

function decrementIP(ip) {
  const parts = ip.split('.')
  parts[3] = parseInt(parts[3]) - 1
  return parts.join('.')
}

function resetCalculator() {
  ipAddress.value = ''
  subnetMask.value = ''
  networkInfo.value = null
  currentCidr.value = 0
  ipError.value = ''
  maskError.value = ''
}

function handleEnter(e) {
  if (isValid.value) {
    e.preventDefault()
    calculateNetwork()
  }
}

function handleSubmit() {
  if (isValid.value) {
    calculateNetwork()
  }
}
</script>
