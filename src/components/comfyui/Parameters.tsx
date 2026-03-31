/** 解析 ComfyUI API JSON 参数 */

import { useEffect, useState } from "react";
import { useNotification } from "../notification";
import {
  ComfyUiResult,
} from "../../services/comfyui";
import { PrimaryButton, PrimaryTextButton } from "../buttons";
import { ComfyUiHistory, useComfyUiStore, Node } from "../../states/comfyui";
import { Input } from "../inputs";
import { LocalImage } from "../images";

export function ComfyUiApiParams({ api }: { api: string }) {
  const comfyui = useComfyUiStore();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [defaultNodes, setDefaultNodes] = useState<Node[]>([]);
  const [prompt, setPrompt] = useState<string>();
  const [result, setResult] = useState<ComfyUiResult>();
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<ComfyUiHistory>();
  const [pending, setPending] = useState<boolean>(false);
  const [image, setImage] = useState<string>();
  const notification = useNotification();
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
                        <div>
                          {key}: <Input value={value} setValue={v1 => {
                            const obj = [...nodes].map((v, j) => {
                              return j === i ? { ...v, node: { ...v.node, inputs: { ...v.node.inputs, [key]: v1 } } } : v
                            })
                            setNodes(obj)
                          }} />
                        </div>
                      ),
                  )}
                </div>
              </div>
            ))}
          </div>
          {/** 调用API */}
          <div className="mt-4 flex border-t mb-8 py-4 border-slate-200 flex-col gap-2">
            <div>
              <PrimaryTextButton onClick={() => {
                setNodes([...defaultNodes])
              }}>Reset</PrimaryTextButton>
            </div>
            <div>
              <PrimaryButton
                disabled={!prompt || submitting || pending}
                onClick={() => {
                  if (!prompt) return;
                  setSubmitting(true);
                  comfyui.queue_prompt(nodes)
                    .then((r) => {
                      notification.success("调用成功");
                      setResult(r);
                      // wait for result
                      setPending(true);
                      comfyui.wait_for_result(r.prompt_id)
                        .then((r) => {
                          setHistory(r);
                        })
                        .catch((e) => {
                          notification.error("调用 wait_for_result 失败:"+e);
                        })
                        .finally(() => {
                          setPending(false);
                        })
                    })
                    .catch((err) => {
                      notification.error("调用失败:" + err);
                    })
                    .finally(() => {
                      setSubmitting(false);
                    });
                }}
              >
                {pending ? 'Pending': '调用API'}
              </PrimaryButton>
            </div>
            <div>
              <PrimaryButton
                disabled={!result}
                onClick={() => {
                  if (result) {
                    comfyui.get_history(result.prompt_id)
                      .then((r) => {
                        setHistory(r)
                      })
                      .catch((err) => {
                        notification.error("调用history失败:" + err);
                      });
                  }
                }}
              >
                CheckHistory
              </PrimaryButton>
            </div>
            <div>
              <PrimaryButton
                onClick={() => {
                  if (history) {
                    comfyui.get_image("http://192.168.31.99:18188", history)
                      .then((r) => {
                        if (r && r.length > 0) {
                          setImage(r[0])
                        }
                        notification.success("Download 成功"+r);
                      }).catch(e => {
                        notification.error("Download 失败"+e);
                      })
                  }
                }}
              >
                Download Image
              </PrimaryButton>
            </div>
            <div>
              {history?.status.status_str}
            </div>
            <div>
              {history?.outputs && JSON.stringify(history?.outputs)}
            </div>
            <div>
              {image && <LocalImage src={image} />}
              {/* <img src={'asset://Users/liaojinlong/.prince_files/ed69a039-37ed-4685-86a7-bb72a77897be.png'} alt="Generated Image" /> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
