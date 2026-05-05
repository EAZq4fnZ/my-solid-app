// src/index.tsx
import { render } from 'solid-js/web';
import { createRouter, RouterProvider, createRoute } from '@tanstack/solid-router';
import '@/index.css';
import { Button } from './components/ui/Button';
import { Route as rootRoute } from './routes/root';

// 1. 各ページのルート定義
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div class="flex flex-col gap-4">
      <h1 class="text-3xl font-bold text-gray-800">Home Page</h1>
      <p>Ark UI + Tailwind v4 の世界へようこそ！</p>
      <Button visual="solid" onClick={() => alert('Ready!')}>Get Started</Button>
    </div>
  ),
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: () => <h1 class="text-3xl font-bold">About Page</h1>,
})

// 2. ルーターの構築
const routeTree = rootRoute.addChildren([indexRoute, aboutRoute])
const router = createRouter({ routeTree })

// 3. アプリの起動
const rootElement = document.getElementById('root');
if (rootElement) {
  render(() => <RouterProvider router={router} />, rootElement);
}