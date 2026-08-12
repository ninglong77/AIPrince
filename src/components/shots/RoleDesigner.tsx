/**
 * 角色设计器
 */

import { useEffect, useState } from "react";
import { ComfyUiApi } from "../../common";
import { useComfyUiApis } from "../../hooks/comfyui_apis";
import { ComfyUiApiComponent } from "../../pages/comfyui/ApiPage";

export default function RoleDesigner({onRoleCreated}: {onRoleCreated?: (image: string) => void}) {
  const {apis} = useComfyUiApis();
  const [api, setApi] = useState<ComfyUiApi | undefined>();
  useEffect(() => {
    if (apis.length > 0) {
      setApi(apis[0]);
    }
  }, [apis]);
  return <div>
    {/** 选择API */}
    <div>
      <select value={api?.id} onChange={e => setApi(apis.find(api => api.id == e.target.value as unknown as number))} >
        {apis.map(api => <option key={api.id}>{api.name}</option>)}
      </select>
    </div>
    {api && <ComfyUiApiComponent api={api} onImageCreated={onRoleCreated} />}
  </div>
}
