import { useEffect, useState } from "react";
import { ComfyUiApi } from "../common";
import { get_comfyui_apis } from "../services/comfyui";

/**
 * 获取本地设计的所有 ComfyUi API
 * @returns
 */
export const useComfyUiApis = () => {
  const [apis, setApis] = useState<ComfyUiApi[]>([]);
  const [loading, setLoading] = useState(false);
  const load  = () => {
    setLoading(true);
    get_comfyui_apis().then(setApis).finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [])
  return { apis, loading, load };
}
