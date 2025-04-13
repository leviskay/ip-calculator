# IP Calculator для обучения

Этот проект представляет собой образовательный инструмент для изучения сетевой адресации. Он позволяет пользователям генерировать задания, связанные с IP-адресами, масками подсетей и другими аспектами сетевой адресации. Проект интегрируется с системами управления обучением (LMS) через стандарт LTI (Learning Tools Interoperability), что позволяет использовать его в образовательных курсах.

## Основные возможности

- Генерация случайных IP-адресов и масок подсетей.
- Автоматическая проверка ответов пользователей.
- Интеграция с LMS через LTI для персонализации и передачи оценок.
- Теоретические материалы для изучения сетевой адресации.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Интеграция с LMS

Проект поддерживает стандарт LTI, что позволяет интегрировать его в такие LMS, как Moodle или Canvas. Это обеспечивает безопасный обмен данными между LMS и инструментом, включая передачу оценок и персонализацию интерфейса.

## Дополнительная информация

Для получения дополнительной информации ознакомьтесь с [документацией Nuxt](https://nuxt.com/docs/getting-started/introduction) и [документацией LTI](https://www.imsglobal.org/activity/learning-tools-interoperability).
