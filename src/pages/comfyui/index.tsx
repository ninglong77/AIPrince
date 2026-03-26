/** ComfyUI APIs management */

import { NavLink } from "react-router"
import { PrimaryButton } from "../../components/buttons"
import { ComfyUiApi } from "../../common";
import { useEffect, useState } from "react";
import { get_comfyui_apis } from "../../services/comfyui";

export function  ComfyUiApisPage() {
  const [apis, setApis] = useState<ComfyUiApi[]>([]);
  useEffect(() => {
    get_comfyui_apis().then((apis) => {
      setApis(apis);
    });
  }, [])
  return <div className="flex flex-col gap-2 items-center w-full">
    <h2>ComfyUI API 管理</h2>
    <div className="flex flex-col w-4/5 gap-4">
      <section className="flex flex-col w-32">
        <NavLink to="/comfyui/new">
          <PrimaryButton>新增API</PrimaryButton>
        </NavLink>
      </section>
      <h3 className="text-slate-500">API列表</h3>
      <div className="flex flex-col gap-2">
        {apis.map((api) => (
          <div key={api.id} className="flex flex-row gap-2 border-b pb-0.5 border-slate-200">
            <div className="flex flex-col gap-1">
              <div className="text-lg font-bold">{api.name}</div>
              <div className="text-sm text-slate-500">{api.server_url}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
}
