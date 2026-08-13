import { create } from "zustand";

interface Store {
  get: (key: string) => any;
  set: (key: string, value: any) => Promise<void>;
  store: (key: string) => Store;
}

interface KVStore {
  values: { [key: string]: any };
  store: (key: string) => Store;
}

const createStore = (preset_key: string, set: any, values: any) => ({
    get: (key: string) => {
      const key1 = `${preset_key}/${key}`;
      return values()['values'][key1];
    },
    set: async (key: string, value: any) => {
      const key1 = `${preset_key}/${key}`;
      set(() => ({ values: { ...values()['values'], [key1]: value } }))
    },
    store: (key: string) => {
      const key1 = `${preset_key}/${key}`;
      return createStore(key1, set, values);
    },
})

export const useKvStore = create<KVStore>((set, values) => ({
  values: {},
  store: (key: string) => createStore(key, set, values),
}));
