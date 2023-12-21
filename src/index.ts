// Reference: https://dev.to/yezyilomo/global-state-management-in-react-with-global-variables-and-hooks-state-management-doesn-t-have-to-be-so-hard-2n2c

import { useEffect, useState } from 'react';

export type NotifyChangeFunction    = () => void;
export type StateUpdateFunction<T>  = (stateUpdate: T | Partial<T> | ((state: T) => T | Partial<T>)) => void;

export class GlobalState<T> {

  private state:            T;
  private subscribers:      NotifyChangeFunction[];
  public readonly isObject: boolean;

  constructor(initialState: T) {
    this.state        = initialState;
    this.subscribers  = [];
    this.isObject     = initialState instanceof Object;
  }

  getState(): T {
    if (this.isObject) {
      return {...this.state};
    } else {
      return this.state;
    }
  }

  setState(state: T | Partial<T>): void {
    if (this.getState() !== state) {
      if (this.isObject) {
        this.state = {...this.state, ...state};
      } else {
        this.state = state as T;
      }
      this.subscribers.forEach(notify => notify());
    }
  }

  subscribe(notifyChangeFn: NotifyChangeFunction): void {
    if (!this.subscribers.includes(notifyChangeFn)) {
      this.subscribers.push(notifyChangeFn);
    }
  }

  unsubscribe(notifyChangeFn: NotifyChangeFunction): void {
    this.subscribers = this.subscribers.filter(notify => notify !== notifyChangeFn);
  }

}

export function createGlobalState<T>(initialState: T) {
  return new GlobalState(initialState);
}

export function useGlobalState<T>(globalState: GlobalState<T>): [T, StateUpdateFunction<T>] {
  const [_, setState] = useState({});
  const state: T = globalState.getState();
  const onNotification = () => setState(() => ({}));

  useEffect(() => {
    globalState.subscribe(onNotification);
    return () => globalState.unsubscribe(onNotification);
  }, []); // TODO: Do we need the dep array? (original solution didn't have the empty dep array)

  function updateState(stateUpdate: T | Partial<T> | ((currentState: T) => T | Partial<T>)): void {
    if (typeof stateUpdate === 'function') {
      const partialState = (stateUpdate as (currentState: T) => T | Partial<T>)(state);
      globalState.setState(globalState.isObject ? { ...state, ...partialState } : partialState as T);
    } else {
      globalState.setState(globalState.isObject ? { ...state, ...stateUpdate } : stateUpdate as T);
    }
  }

  return [state, updateState];
}
