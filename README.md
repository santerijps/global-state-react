# global-state-react

Global state management in React. Create global states (or stores) that can be subsribed to and mutated in React components.

## Installation

```sh
npm i @santerijps/global-state-react
```

## Basic usage

First we create a new global state with the `createGlobalState` -function:

```ts
// count.ts
import { createGlobalState } from '@santerijps/global-state-react';

export const GlobalCount = createGlobalState(0);
```

Then we subscribe to the global state in a React component using the `useGlobalState` -hook:

```tsx
// counter.ts
import { useGlobalState } from '@santerijps/global-state-react';
import { GlobalCount } from './count.ts';

export default function Counter() {
  const [count, setCount] = useGlobalState(GlobalCount);

  function increment() {
    setCount(count => count + 1);
  }

  return (
    <main>
      <button onClick={increment}>Increment count</button>
      <p>Count: {count}</p>
    </main>
  );
}
```

### Defining mutators and exporting them

Instead of defining how the global state can be mutated in each subscribing component, mutators can be defined and then exported.

```ts
// count.ts
import { createGlobalState } from '@santerijps/global-state-react';

const GlobalCount = createGlobalState(0);

export function useGlobalCount() {
  const [count, setCount] = useGlobalState(GlobalCount);

  return {
    value: count,
    increment: () => setCount(count => count + 1),
  };
}
```

```tsx
// counter.ts
import { useGlobalCount } from './count.ts';

export default function Counter() {
  const count = useGlobalCount();

  return (
    <main>
      <button onClick={count.increment}>Increment count</button>
      <p>Count: {count.value}</p>
    </main>
  );
}
```

## Helpers

### `<StateRenderer />`

The `StateRenderer` is a React component can be used to quarantine state updates and re-renders to a smaller context.
In other words, this allows a re-render to only occur where it is needed.

```tsx
import { useGlobalCount } from './count.ts';
import { StateRenderer } from '@santerijps/global-state-react/helpers';

function Example1() {
  const count = useGlobalCount(); // Whenever count mutates, this entire component re-renders

  return (
    <main>
      {count.value}
      {/* Imagine a large and complex structure here */}
    </main>
  );
}

// Wrapping the hook call in StateRenderer ensures that only the StateRenderer re-renders.
// StateRenderer returns <>{value}</>
function Example2() {
  return (
    <main>
      <StateRenderer hook={() => useGlobalCount().value} />
      {/* Imagine a large and complex structure here */}
    </main>
  );
}

// The hook prop takes a function that returns some state.
// If we want more control over how the state is rendered, we can use the render prop.
function Example3() {
  return (
    <main>
      <StateRenderer hook={useGlobalCount} render={count => (
        <>
          {count.value}
          <button onClick={count.increment}>Increment</button>
        </>
      )}/>
      {/* Imagine a large and complex structure here */}
    </main>
  );
}

```
