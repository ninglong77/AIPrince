import { invoke } from "@tauri-apps/api/core"

export async function get_kv_cmd(key: string) {
  const r = await invoke('get_kv_store_cmd', {key: key})
  return r
}

export async function set_kv_cmd(key: string, value: string) {
  const r = await invoke('upsert_kv_store_cmd', {key: key, value: value})
  return r
}

export async function list_kv_store_cmd() {
  const r = await invoke('list_kv_store_cmd')
  return r as {key: string, value: string}[]
}
