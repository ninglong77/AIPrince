import { useEffect, useState } from "react";
import { ComfyUiApi } from "../../common";
import { get_comfyui_apis } from "../../services/comfyui";
import { NavLink } from "react-router";

export default function () {
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
    <div className="flex flex-col w-full items-center">
      <h1>APIs</h1>
      <div className="w-4/5 flex flex-row gap-2">
        {/** 使用卡片式列表，显示API */}
        {apis.map((api) => (
          <NavLink to={"/apis/" + api.id}>
            <div className="w-28 cursor-pointer shadow-md h-32 flex flex-row justify-center items-center">
              {api.name}
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
