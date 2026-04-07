import { useEffect, useState } from "react";
import { Input } from "../../components/inputs";
import { NavLink, useNavigate, useParams } from "react-router";
import { useNotification } from "../../components/notification";
import {
  add_comfyui_api,
  get_comfyui_apis,
  update_comfyui_api,
} from "../../services/comfyui";
import { ComfyUiApiParams } from "../../components/comfyui/Parameters";
import { ParameterAlias } from "../../common";

export default function () {
  let navigate = useNavigate();
  const notification = useNotification();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [prompt_api, setPromptApi] = useState("");
  const { editId } = useParams() as { editId?: string };
  // 如果是编辑模式，通过此变量决定是否已初始化
  const [inited, setInited] = useState(false);
  const [alias, setAlias] = useState<{[key: string]: {[key: string]: ParameterAlias}}>()

  useEffect(() => {
    if (editId) {
      const id = parseInt(editId);
      get_comfyui_apis().then((apis) => {
        if (apis.find((api) => api.id === id)) {
          const api = apis.find((api) => api.id === id)!;
          setName(api.name);
          setUrl(api.server_url);
          setPromptApi(api.prompt_api);
          setInited(true);
          setAlias(api.alias);
        }
      });
    } else {
      setInited(true);
    }
  }, [editId]);

  const handleSave = () => {
    if (!name) {
      notification.error("请填写名称");
      return;
    }
    if (!url) {
      notification.error("请填写URL");
      return;
    }
    if (!prompt_api) {
      notification.error("请填写Prompt API");
      return;
    }
    if (editId) {
      console.info('---->>>'+JSON.stringify(alias))
      update_comfyui_api(parseInt(editId), {
        name,
        server_url: url,
        prompt_api,
        alias: alias,
      })
        .then(() => {
          notification.success("保存成功");
          navigate("/comfyui");
        })
        .catch((err) => {
          notification.error(err.message);
        });
    } else {
      add_comfyui_api({
        name,
        server_url: url,
        prompt_api,
        alias: alias,
      })
        .then(() => {
          notification.success("添加成功");
          navigate("/comfyui");
        })
        .catch((e) => {
          notification.error("添加失败:" + e);
        });
    }
  };
  return (
    <div className="flex flex-col w-full items-center">
      <h1>创建 ComfyUI API</h1>
      {inited && (
        <div className="w-4/5 flex flex-col gap-4">
          <section className="w-48">
            <Input
              value={name}
              setValue={setName as any}
              placeholder="请输入 API 名称"
            />
          </section>
          <section className="w-48">
            <Input
              value={url}
              setValue={setUrl as any}
              placeholder="请输入 ComfyUI 地址"
            />
          </section>
          <section className="flex flex-row items-end">
            {/* 文本域 */}
            <textarea
              rows={3}
              placeholder="Prompt API"
              value={prompt_api}
              onChange={(e) => setPromptApi(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            />
          </section>
          {/* 底部按钮 */}
          <div className="flex justify-end gap-3 mt-8">
            <NavLink to="/comfyui">
              <button className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                取消
              </button>
            </NavLink>

            <button
              onClick={handleSave}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              保存
            </button>
          </div>
          <div>
            {prompt_api && <ComfyUiApiParams alias={alias || {}} onChangeAlias={alias1 => {
              setAlias(alias1)
            }} api={prompt_api} />}
          </div>

          {/* 关闭按钮 (小叉) */}
          <button
            onClick={() => {
              navigate("/comfyui");
            }}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
