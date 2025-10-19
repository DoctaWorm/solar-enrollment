import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: 'http://localhost:5247/openapi/v1.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/api',
      schemas: './src/api/model',
      client: 'react-query',
      mock: false,
      override: {
        mutator: {
          path: './src/api/mutator.ts',
          name: 'customInstance',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});

