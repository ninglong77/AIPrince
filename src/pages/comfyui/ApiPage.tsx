import { useNavigate, useParams } from "react-router";
import { ComfyUiApi, ParameterAlias } from "../../common";
import { get_comfyui_apis } from "../../services/comfyui";
import { useEffect, useState } from "react";
import { useComfyUiStore, Node } from "../../states/comfyui";
import { InputValueSwitch } from "../../components/comfyui/Parameters";
import CallApi from "../../components/comfyui/CallApi";

function InputParameter({
  param: {
    type,
    alias,
    default: defaultValue,
    default_value_type: defaultValueType,
  },
  setValue: setValue1,
}: {
  param: ParameterAlias;
  setValue: (value: string | number | boolean) => void;
}) {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue1(value as any);
  }, [value])
  return (
    <div className="flex flex-col gap-2">
      <h2>{alias}</h2>
      <InputValueSwitch
        value={value as any}
        setValue={setValue}
        type={type as any}
        defaultValueType={defaultValueType as any}
      />
    </div>
  );
}

export default function () {
  let navigate = useNavigate();
  const comfyui = useComfyUiStore();
  const { id } = useParams() as { id?: string };
  const [api, setApi] = useState<ComfyUiApi | undefined>();
  const [nodes, setNodes] = useState<Node[]>([]);
  useEffect(() => {
    if (id) {
      const id0 = parseInt(id);
      get_comfyui_apis().then((apis) => {
        if (apis.find((api) => api.id === id0)) {
          const api = apis.find((api) => api.id === id0)!;
          setApi(api);
        }
      });
    }
  }, [id]);
  useEffect(() => {
    if (api) {
      setNodes(comfyui.parse_prompt(api.prompt_api));
    }
  }, [api]);
  return (
    <div className="flex flex-col w-full items-center">
      <h1>{api?.name}</h1>
      <div className="w-4/5 flex flex-col gap-2">
        {nodes
          .filter(
            (i) =>
              Object.keys(i.node.inputs).filter(
                (j) => api?.alias[i.id] && api?.alias[i.id][j]?.required,
              ).length > 0,
          )
          .map((node, index) => (
            <div key={index}>
              {Object.keys(node.node.inputs)
                .filter(
                  (i) =>
                    api?.alias[node.id] && api?.alias[node.id][i]?.required,
                )
                .map((i, j) => {
                  return (
                    <div key={j}>
                      <InputParameter setValue={(value) => {
                        // change the value of the nodes
                        setNodes(nodes.map((n) => {
                          if (n.id === node.id) {
                            return {
                              ...n,
                              node: {
                                ...n.node,
                                inputs: {
                                  ...n.node.inputs,
                                  [i]: value,
                                },
                              },
                            };
                          }
                          return n
                        }))
                      }} param={api?.alias[node.id][i]!} />
                    </div>
                  );
                })}
            </div>
          ))}
      </div>
      <div className="w-4/5">
        <CallApi nodes={nodes} />
      </div>
      {/* 关闭按钮 (小叉) */}
      <button
        onClick={() => {
          navigate("/apis");
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
  );
}
