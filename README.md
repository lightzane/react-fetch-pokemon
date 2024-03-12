# React Fetch Pokemon

Exploring on [custom react hook](#custom-hook) with [Axios][axios].

[axios]: https://axios-http.com/docs/intro

## Getting Started

```bash
npm create vite@latest
```

```bash
Need to install the following packages:
create-vite@5.2.2
Ok to proceed? (y) y
√ Project name: ... react-fetch-pokemon
√ Select a framework: » React
√ Select a variant: » TypeScript

Scaffolding project...

Done. Now run:

  cd react-fetch-pokemon
  npm install
  npm run dev
```

## Vite Configuration (optional)

Do this if you want it to be accessible via `file:///` protocol

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 4200,
  },
  base: '',
  build: {
    outDir: 'docs',
    rollupOptions: {
      output: {
        format: 'umd',
      },
    },
  },
});
```

### Static Build

> Use this along with the optional when using on `file:///` protocol

Create `scripts/defer-script.mjs`

```mjs
import fs from 'fs';
import path from 'path';

const outDir = 'docs';
const indexPath = path.join(outDir, 'index.html');
const index = fs.readFileSync(indexPath, { encoding: 'utf-8' });
const regex = /type="module" crossorigin/i;
const update = index.replace(regex, 'defer');

fs.writeFileSync(path.join(indexPath), update, { encoding: 'utf-8' });
```

Update `package.json`

```diff
{
  "scripts": {
    "dev": "vite",
-   "build": "tsc && vite build",
+   "build": "tsc && vite build && npm run defer",
    "preview": "vite preview",
+   "defer": "node scripts/defer-script.mjs"
  }
}
```

## Tailwind

### Installation

```bash
npm install -D tailwindcss postcss autoprefixer
```

### Init Tailwind config

This will generate `tailwind.config.js` and `postcss.config.js`

```bash
npx tailwindcss init -p
```

### Update Tailwind config

```diff
/** @type {import('tailwindcss').Config} */
export default {
  content: [
+   "./index.html",
+   "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Add Tailwind directives

`index.css`

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Custom Hook

`src/hooks/use-fetch.ts`

```ts
import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';

export const useFetch = (endpoint: string, query?: string) => {
  const [_query, setQuery] = useState(query);
  const [data, setData] = useState<PokemonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const options: AxiosRequestConfig = {
    method: 'GET',
    url: `https://pokeapi.co/api/v2/${endpoint}/${_query}`,
  };

  const fetchData = async () => {
    if (!_query) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.request<PokemonResponse>(options);
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [_query]);

  const refetch = (query: string) => {
    setData(null);
    setError(null);
    setQuery(query);
  };

  return { data, loading, error, refetch };
};
```
