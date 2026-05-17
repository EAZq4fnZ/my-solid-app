// src/routes/root.tsx
import { parseDate } from '@ark-ui/solid';
import { createRootRoute, Link, Outlet } from '@tanstack/solid-router';

import { DatePicker } from '@/components/ui/DatePicker';

export const Route = createRootRoute({
  component: () => (
    /*
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
    </div>*/
    <>
      <div class="p-4 bg-zinc-900 border-b border-zinc-800">
        <p class="text-xs text-zinc-500 mb-2">検証用：DateInput</p>
        <DatePicker
          label="DatePickerテスト用"
          placeholder="YYYY/MM/DD"
          helperText="動作をチェックしてください"
          locale="ja-JP"
          max={parseDate('2026-06-01')}
          min={parseDate('2026-04-30')}
        />
      </div>
      <Outlet />
    </>
  ),
});
