import { JSX } from 'react';

export type StateRendererProps<T> = {
  hook:     () => T;
  render?:  (state: T) => JSX.Element;
};

export function StateRenderer<T>(props: StateRendererProps<T>) {
  const state = props.hook();
  if (props.render) {
    return props.render(state);
  } else if (state instanceof Object) {
    return <>{JSON.stringify(state)}</>;
  } else {
    return <>{state}</>;
  }
}
