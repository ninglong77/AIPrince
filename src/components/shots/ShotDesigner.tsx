/**
 * 分镜设计器
 */

import { useEffect, useState } from "react";
import { ComfyUiApi } from "../../common";
import { useComfyUiApis } from "../../hooks/comfyui_apis";
import { ComfyUiApiComponent } from "../../pages/comfyui/ApiPage";
import { Shot } from "../../services/analysis";

function SelectApi({ onCreated }: { onCreated?: (image: string) => void }) {
  const { apis } = useComfyUiApis();
  const [api, setApi] = useState<ComfyUiApi | undefined>();
  useEffect(() => {
    if (apis.length > 0) {
      setApi(apis[0]);
    }
  }, [apis]);
  return (
    <div>
      {/** 选择API */}
      <div>
        <select
          value={api?.name}
          onChange={(e) => {
            console.info(e.target.value);
            setApi(apis.find((api) => "" + api.name == e.target.value));
          }}
        >
          {apis.map((api) => (
            <option key={api.name}>{api.name}</option>
          ))}
        </select>
      </div>
      {api && <ComfyUiApiComponent api={api} onImageCreated={onCreated} />}
    </div>
  );
}

export default function ShotDesigner({
  onCreated,
  shot,
}: {
  onCreated?: (image: string) => void;
  shot: Shot;
}) {
  // 当前选择的对话 ID
  const [currentDialogId, setCurrentDialogId] = useState<number>(0);
  return (
    <div className="flex flex-col gap-4">
      {/** 场景+背景 */}
      <div>
        <div>
          <span className="font-bold">场景：</span>
          <span className="">{shot.position?.name}</span>
        </div>
        <div>
          <span className="font-bold">背景：</span>
          <span className="">{shot.background}</span>
        </div>
        <div>
          <span className="font-thin">设计场景：</span>
          <div className="text-sm text-slate-400">请选择您之前设计的场景，并进行微调</div>
          {/** 选择API */}
          <SelectApi onCreated={onCreated} />
        </div>
      </div>
      {/** 角色+对话 */}
      <div className="flex flex-col gap-2">
        <div className="text-lg font-bold">角色对话</div>
        <div className="text-sm text-slate-400">
          将角色置身于特定的场景里, 并给TA加上对话
        </div>
        <div className="flex flex-row">
          {/** 对话列表 */}
          <div className="flex flex-col gap-2 w-1/2">
            {shot.dialogs.map((dialog, index) => (
              <div onClick={() => {
                setCurrentDialogId(index)
              }} key={index} className={"flex flex-row gap-2 flex-wrap w-full " + (index==currentDialogId ? " border-b border-slate-100 bg-slate-50": '')}>
                <div className="font-bold">{dialog.role.name}</div>
                <div>:</div>
                <div className="">
                  <span className="text-sm">{dialog.dialog}</span>
                </div>
              </div>
            ))}
          </div>
          {/** 分镜实现 */}
          <div className="grow bg-slate-50">
            hahha
          </div>
        </div>
      </div>
      {/** 选择API */}
      {/* <SelectApi onCreated={onCreated} /> */}
    </div>
  );
}
