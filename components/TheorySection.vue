<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white shadow-xl rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-6">Основы IP-адресации</h2>
      
      <div class="space-y-6">
        <section>
          <h3 class="text-xl font-semibold mb-3">Что такое IP-адрес?</h3>
          <p class="text-gray-700">
            IP-адрес - это уникальный идентификатор устройства в сети, использующей протокол IP.
            IPv4 адрес состоит из 32 бит, записанных в виде четырех октетов (чисел от 0 до 255),
            разделенных точками.
          </p>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Маска подсети</h3>
          <p class="text-gray-700">
            Маска подсети определяет, какая часть IP-адреса относится к адресу сети,
            а какая - к адресу хоста. Маска может быть записана в двух форматах:
          </p>
          <ul class="list-disc list-inside mt-2 text-gray-700">
            <li>Десятичный формат (например, 255.255.255.0)</li>
            <li>Префиксный формат (/24)</li>
          </ul>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Классы IP-адресов</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Класс
                  </th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Диапазон
                  </th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Маска по умолчанию
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">A</td>
                  <td class="px-6 py-4 whitespace-nowrap">1.0.0.0 - 126.255.255.255</td>
                  <td class="px-6 py-4 whitespace-nowrap">/8 (255.0.0.0)</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">B</td>
                  <td class="px-6 py-4 whitespace-nowrap">128.0.0.0 - 191.255.255.255</td>
                  <td class="px-6 py-4 whitespace-nowrap">/16 (255.255.0.0)</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">C</td>
                  <td class="px-6 py-4 whitespace-nowrap">192.0.0.0 - 223.255.255.255</td>
                  <td class="px-6 py-4 whitespace-nowrap">/24 (255.255.255.0)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Специальные адреса</h3>
          <ul class="space-y-2 text-gray-700">
            <li><span class="font-medium">Адрес сети</span> - адрес, идентифицирующий сеть (все биты хостовой части равны 0)</li>
            <li><span class="font-medium">Широковещательный адрес</span> - адрес для отправки данных всем устройствам в сети (все биты хостовой части равны 1)</li>
            <li><span class="font-medium">Localhost</span> - 127.0.0.1 (зарезервирован для локального компьютера)</li>
          </ul>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Полезные формулы</h3>
          <div class="bg-gray-50 p-4 rounded-md">
            <ul class="space-y-2 text-gray-700">
              <li>Количество хостов = 2<sup>n</sup> - 2, где n - количество бит хостовой части</li>
              <li>Количество подсетей = 2<sup>m</sup>, где m - количество заимствованных бит</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
