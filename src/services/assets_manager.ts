import { invoke } from "@tauri-apps/api/core"

export interface LocalAsset {
  id: number;
  local_path: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export async function get_assets_cmd(id: number) {
  const r = await invoke('get_assets_cmd', {id: id})
  return r
}

export async function create_local_asset(local_path: string, tags: string[]) {
  const r = await invoke('insert_assets_cmd', {localPath: local_path, tags: tags.join(",")})
  return r
}

export async function list_local_assets_cmd() {
  const r: {tags: string}[] = await invoke('list_assets_cmd')
  return r.map(i => ({...i, tags: i.tags.split(",")})) as unknown as LocalAsset[]
}
