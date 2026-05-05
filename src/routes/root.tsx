import { createRootRoute, Link, Outlet } from '@tanstack/solid-router'

export const Route = createRootRoute({
  component: () => (
    <div class="min-h-screen bg-gray-50">
      <nav class="p-4 bg-white shadow-sm flex gap-4">
        <Link to="/" class="text-blue-600 font-bold" activeProps={{ class: 'underline' }}>
          Home
        </Link>
        <Link to="/about" class="text-blue-600 font-bold" activeProps={{ class: 'underline' }}>
          About
        </Link>
      </nav>
      <main class="p-8">
        <Outlet />
      </main>
    </div>
  ),
})