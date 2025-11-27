import { createContext, useContext } from 'react';
import type { TypedPocketBase } from './types';

export const PocketbaseContext = createContext<TypedPocketBase>(
  {} as TypedPocketBase,
);

export const usePocketbase = () => useContext(PocketbaseContext);
