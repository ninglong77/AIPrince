/** ComfyUI APIs management */

import { NavLink } from "react-router";
import {
  DangerTextButton,
  PrimaryButton,
  PrimaryTextButton,
} from "../../components/buttons";
import { ComfyUiApi } from "../../common";
import { useEffect, useState } from "react";
import { get_comfyui_apis, remove_comfyui_api } from "../../services/comfyui";
import { useModals } from "../../components/modal";

export function ComfyUiApisPage() {
  const modal = useModals();
  const [apis, setApis] = useState<ComfyUiApi[]>([]);
  const refresh = () => {
    get_comfyui_apis().then((apis) => {
      setApis(apis);
    });
  };
  useEffect(() => {
    refresh();
  }, []);
  return (
    <div className="flex flex-col gap-2 items-center w-full">
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
            <div
              key={api.id}
              className="flex flex-row justify-between gap-2 border-b pb-0.5 border-slate-200"
            >
              <div className="flex flex-col gap-1">
                <div className="text-lg font-bold">{api.name}</div>
                <div className="text-sm text-slate-500">{api.server_url}</div>
              </div>
              <div className="flex-row h-full self-end p1-2 gap-2">
                <NavLink to={"/comfyui/edit/" + api.id}>
                  <PrimaryTextButton className="text-sm mr-4">
                    Edit
                  </PrimaryTextButton>
                </NavLink>
                <DangerTextButton
                  className="text-sm"
                  onClick={() => {
                    modal.open({
                      title: "删除 ComfyUI API",
                      content: <div>确定要删除该 ComfyUI API 吗？</div>,
                      comfirmText: "Delete",
                      cancelText: "Cancel",
                      onConfirm: () => {
                        remove_comfyui_api(api.id).finally(() => {
                          refresh();
                        });
                      },
                      onClose: () => {},
                    });
                  }}
                >
                  Delete
                </DangerTextButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
