import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import { useAiScriptsStore } from "../../states/ai_scripts";
import { useNotification } from "../../components/notification";
import { v4 } from "uuid";
import { add_ai_script, update_ai_script } from "../../services/ai_scripts";
import { MyEditor } from "../../components/editor";
import { ContentNode } from "../../components/editor/types";

export default function NewAiScript() {
  // 分析当前是不是编辑模式：如果 URL 中有 editId 参数，则为编辑模式，否则为新增模式
  const { info, error } = useNotification();
  let navigate = useNavigate();
  const { findById } = useAiScriptsStore();
  const { editId } = useParams() as { editId?: string };
  const [id, setId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", content: "" });
  const [initialData, setInitialData] = useState<ContentNode[]>([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);
  // 如果是编辑模式，通过此变量决定是否已初始化
  const [inited, setInited] = useState(false);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (formdata: { name: string; content: string }) => {
    // navigate("/");
    if (!formdata.name.trim() || !formdata.content.trim()) {
      error("Please fill in both name and content");
      return;
    }
    if (id) {
      const obj = findById(id);
      if (!obj) {
        error("AiScript not found");
        return;
      }
      update_ai_script(id, { ...formData, uuid: obj.uuid })
        .then(() => {
          info("Successfully edited AiScript");
        })
        .catch((e) => {
          error("Failed to edit AiScript:" + e);
        });
    } else {
      const uid = v4();
      add_ai_script({ ...formdata, uuid: uid })
        .then(() => {
          info("Successfully added new AiScript");
        })
        .catch((e) => {
          error("Failed to add AiScript:" + e);
        });
      // add(formdata);
      // info("Successfully added new AiScript");
    }
    navigate("/");
  };

  useEffect(() => {
    if (editId) {
      setId(parseInt(editId));
    }
  }, [editId]);

  useEffect(() => {
    if (!id) return;
    const obj = findById(id);
    if (obj) {
      setFormData({ name: obj.name, content: obj.content });
      
      setInitialData(
        !!obj.content
          ? JSON.parse(obj.content)
          : [
              {
                type: "paragraph",
                children: [{ text: "" }],
              },
            ],
      );
      setTimeout(() => {
        setInited(true);
      }, 50);
    } else {
      error("AiScript not found");
      navigate("/");
    }
  }, [id]);

  return (
    <div className="">
      {/* 全屏模态框主体 */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all">
          {/* 内边距 p-8 使内容不贴边 */}
          <div className="p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              {editId ? "编辑脚本" : "新增脚本"}
            </h3>

            <div className="space-y-6">
              {/* 名称输入 */}
              <div>
                <label
                  htmlFor="modal-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  名称
                </label>
                <input
                  id="modal-name"
                  type="text"
                  name="name"
                  placeholder="例如：Hello World"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 内容文本域 */}
              <div>
                <label
                  htmlFor="modal-content"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  内容
                </label>
                {/* {inited && <div>{JSON.stringify(initialData)}</div>} */}
                <div className="p-1">
                  {(!editId || (!!editId && inited)) && (
                    <MyEditor
                      initialValue={initialData}
                      onChange={(contentNode) => {
                        setFormData({
                          ...formData,
                          content: JSON.stringify(contentNode),
                        });
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="flex justify-end gap-3 mt-8">
              <NavLink to="/">
                <button className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                  取消
                </button>
              </NavLink>

              <button
                onClick={() => handleSave(formData)}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                保存
              </button>
            </div>

            {/* 关闭按钮 (小叉) */}
            <button
              onClick={() => {
                navigate("/");
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
        </div>
      </div>
    </div>
  );
}
