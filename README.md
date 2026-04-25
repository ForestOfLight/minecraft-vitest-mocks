# minecraft-vitest-mocks

A template library for mocking the Minecraft Bedrock Script API modules with Vitest. This is not designed to be exhaustive, but rather will be updated with whatever mocks I need for my own testing. If you want to contribute, please open a pull request with your changes.

To use the mocks, simply use them in your `vitest.config.ts`:

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '@minecraft/server': '@forestoflight/minecraft-vitest-mocks/server',
      '@minecraft/server-ui': '@forestoflight/minecraft-vitest-mocks/server-ui',
      '@minecraft/server-gametest': '@forestoflight/minecraft-vitest-mocks/server-gametest',
      '@minecraft/debug-utilities': '@forestoflight/minecraft-vitest-mocks/debug-utilities'
    },
    setupFiles: ['@forestoflight/minecraft-vitest-mocks/setup']
  }
})
```

### Scheduler

This class handles callbacks passed to `system.run` and other, similar methods.

To step through ticks:

```js
import { scheduler } from '@forestoflight/minecraft-vitest-mocks'
scheduler.advanceTicks(5);
```

To reset all scheduled tasks:

```js
import { scheduler } from '@forestoflight/minecraft-vitest-mocks'
scheduler.reset();
```

### Dynamic property management

```js
import { worldDynamicPropertyStore } from '@forestoflight/minecraft-vitest-mocks'
worldDynamicPropertyStore.set('key', { myProperty: 5 });
const value = worldDynamicPropertyStore.get('key'); // value is Stringified JSON: "{ myProperty: 5 }"
```

... or you can use the `dynamicProperties` property directly on the `@minecraft/server`'s `world` object.