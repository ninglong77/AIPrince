/** 解析 ComfyUI API JSON 参数 */

import { useEffect, useState } from "react";
import { PrimaryTextButton } from "../buttons";
import { useComfyUiStore, Node } from "../../states/comfyui";
import { Input, TextArea } from "../inputs";
import { ParameterAlias } from "../../common";
import CallApi from "./CallApi";

export function InputValueSwitch({
  type,
  value,
  setValue,
  defaultValueType,
}: {
  type: "input" | "textarea";
  value: string | number | boolean;
  setValue: (value: string | number | boolean) => void;
  defaultValueType: "string" | "number" | "boolean";
}) {
  return (
    <>
      {defaultValueType === "number" && (
        <Input type="number" value={value as string} setValue={setValue} />
      )}
      {defaultValueType === "boolean" && (
        <input
          type="checkbox"
          className=""
          checked={value as boolean}
          onChange={(e) => setValue(e.target.checked)}
        />
      )}
      {defaultValueType === "string" && (
        <>
          {type === "input" ? (
            <Input value={value as string} setValue={setValue} />
          ) : (
            <TextArea
              className=" min-h-48"
              value={value as string}
              setValue={setValue}
            />
          )}
        </>
      )}
    </>
  );
}

function KeyValue({
  key1,
  value,
  setValue,
  alias: alias1,
  onParameterChange,
}: {
  key1: string;
  value: string | number | boolean;
  setValue: (value: string | number | boolean) => void;
  alias?: ParameterAlias;
  onParameterChange?: (parameterAlias: ParameterAlias) => void;
}) {
  const [type, setType] = useState<string>(alias1?.type || "input");
  const [required, setRequired] = useState<boolean>(alias1?.required || false);
  const [alias, setAlias] = useState<string>(alias1?.alias || key1);
  const [defaultValue, setDefaultValue] = useState<string | number | boolean>(
    alias1?.default || value,
  );
  const [defaultValueType, setDefaultValueType] = useState<string | undefined>(
    alias1?.default_value_type,
  );
  useEffect(() => {
    if (onParameterChange) {
      onParameterChange({
        required,
        type: type as any,
        alias: alias ?? key1,
        default: defaultValue,
        default_value_type: defaultValueType as any,
      });
    }
  }, [type, required, alias, value, defaultValue]);
  useEffect(() => {
    setDefaultValueType(typeof value);
  }, [value]);
  useEffect(() => {
    if (alias1?.required) {
      setDefaultValue(alias1.default!!);
    }
  }, []);
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center">
        <div>
          {key1}({defaultValueType}):
        </div>
        {/** 生成一个下拉框，可以选择值的类型是 input 还是 textarea */}
        <select
          className="ml-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="input">input</option>
          <option value="textarea">textarea</option>
        </select>
        {/** 增加一个复选框，勾选是否作为可供用户看到的输入参数  */}
        <input
          type="checkbox"
          className="ml-2"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
        />
        <label className="ml-2">是否作为用户输入参数</label>
      </div>
      {required && (
        <div className="flex flex-col gap-2 py-4 pl-2">
          {/** 如果勾选了 required，则显示一个输入框，用户可以输入参数别名 */}
          <div className="flex flex-row items-center">
            <div className="w-1/5">
              <label className="w-20">别名</label>
            </div>
            <div>
              <Input
                value={alias as any}
                setValue={setAlias as any}
                placeholder="请输入参数别名"
              />
            </div>
          </div>
          <div className="flex flex-row items-center">
            <div className="w-1/5">参数默认值</div>
            <div className="">
              <InputValueSwitch
                value={defaultValue as any}
                setValue={setDefaultValue}
                type={type as any}
                defaultValueType={defaultValueType as any}
              />
            </div>
          </div>
        </div>
      )}

      <InputValueSwitch
        value={value}
        setValue={setValue}
        type={type as any}
        defaultValueType={defaultValueType as any}
      />
    </div>
  );
}

export function ComfyUiApiParams({
  api,
  onChangeAlias,
  alias: alias1,
}: {
  api: string;
  alias: {[key: string]: {[key: string]: ParameterAlias}};
  onChangeAlias?: (alias: {[key: string]: {[key: string]: ParameterAlias}}) => void;
}) {
  const comfyui = useComfyUiStore();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [defaultNodes, setDefaultNodes] = useState<Node[]>([]);
  const [prompt, setPrompt] = useState<string>();
  const [alias, setAlias] = useState<{[key: string]: {[key: string]: ParameterAlias}}>(alias1);
  useEffect(() => {
    if (api) {
      try {
        const arr = comfyui.parse_prompt(api);
        setNodes(arr);
        setDefaultNodes(arr);
      } catch (e) {
        console.error(e);
      }
    }
  }, [api]);
  useEffect(() => {
    setPrompt(JSON.stringify(nodes));
  }, [nodes]);
  useEffect(() => {
    if (onChangeAlias) {
      onChangeAlias(alias);
    }
  }, [alias]);
  return (
    <>
      {nodes && (
        <div className="flex flex-col w-full">
          <h1 className="text-slate-500">ComfyUI API </h1>
          {/** 展示参数 */}
          <div className="flex flex-col gap-4">
            {nodes.map((node, i) => (
              <div className="flex flex-col">
                <div>
                  {node.node._meta?.title || "-"}({node.node.class_type})
                </div>
                <div className="flex flex-col">
                  {Object.entries(node.node.inputs).map(
                    ([key, value]) =>
                      !Array.isArray(value) && (
                        <KeyValue
                          key1={key}
                          value={value}
                          alias={alias[node.id]?alias[node.id][key]:undefined}
                          onParameterChange={(aliasItem) => {
                            setAlias({ ...alias, [node.id]: {...alias[node.id], [key]: aliasItem} });
                          }}
                          setValue={(v1) => {
                            const obj = [...nodes].map((v, j) => {
                              return j === i
                                ? {
                                    ...v,
                                    node: {
                                      ...v.node,
                                      inputs: { ...v.node.inputs, [key]: v1 },
                                    },
                                  }
                                : v;
                            });
                            setNodes(obj);
                          }}
                        />
                      ),
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-400/20 mt-8 pt-2">
            <PrimaryTextButton
              onClick={() => {
                setNodes([...defaultNodes]);
              }}
            >
              Reset
            </PrimaryTextButton>
          </div>
          {prompt && <CallApi nodes={nodes} />}
        </div>
      )}
    </>
  );
}
