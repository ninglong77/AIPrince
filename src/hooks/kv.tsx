import { create } from "zustand";
import { list_kv_store_cmd, set_kv_cmd } from "../services/kv";
import { useEffect } from "react";

interface Store {
  get: (key: string) => any;
  set: (key: string, value: any) => Promise<void>;
  store: (key: string) => Store;
}

interface KVStore {
  init: () => Promise<void>;
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
      await set_kv_cmd(key1, value);
      set(() => ({ values: { ...values()['values'], [key1]: value } }))
    },
    store: (key: string) => {
      const key1 = `${preset_key}/${key}`;
      return createStore(key1, set, values);
    },
})

/**
 * Key-Value store
 */
export const useKvStore = create<KVStore>((set, values) => ({
  values: {},
  store: (key: string) => createStore(key, set, values),
  init: async () => {
    const key_values = await list_kv_store_cmd();
    const v: {[key: string]: string} = {}
    key_values.forEach(kv => {
      v[kv.key] = kv.value;
    })
    set(() => ({ values: v }));
  }
}));

export function KvRoot({children}: {children?: React.ReactNode}) {
  const { init } = useKvStore();
  useEffect(() => {
    init().then(() => {
      console.info('KV初始化完成');
    }).catch(err => {
      console.error(err);
    });
  }, [init]);
  return <>
    {children}
  </>
}

