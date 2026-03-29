/** 解析 ComfyUI API JSON 参数 */

import { useEffect, useState } from "react";
import { useNotification } from "../notification";
import {
  ComfyUiResult,
  get_history_cmd,
  queue_prompt_cmd,
} from "../../services/comfyui";
import { PrimaryButton } from "../buttons";

export interface ComfyUiNode {
  inputs: {
    [key: string]: any;
  };
  class_type: string;
  _meta?: {
    title: string;
  };
}

export interface ComfyUiHistory {
  status: {
    completed: boolean,
    messages: [][],
    status_str: string;
  }
}

interface Node {
  id: string;
  node: ComfyUiNode;
}

export function ComfyUiApiParams({ api }: { api: string }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [defaultNodes, setDefaultNodes] = useState<Node[]>([]);
  const [prompt, setPrompt] = useState<string>();
  const [result, setResult] = useState<ComfyUiResult>();
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<ComfyUiHistory>();
  const notification = useNotification();
  useEffect(() => {
    if (api) {
      try {
        const json = JSON.parse(api);
        const arr: Node[] = [];
        for (const [key, value] of Object.entries(json)) {
          arr.push({
            id: key,
            node: value as ComfyUiNode,
          });
        }
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
            {nodes.map((node) => (
              <div className="flex flex-col">
                <div>
                  {node.node._meta?.title || "-"}({node.node.class_type})
                </div>
                <div className="flex flex-col">
                  {Object.entries(node.node.inputs).map(
                    ([key, value]) =>
                      !Array.isArray(value) && (
                        <div>
                          {key}: {value}
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
              <PrimaryButton
                disabled={!prompt || submitting}
                onClick={() => {
                  if (!prompt) return;
                  const obj: any = {};
                  for (const n of nodes) {
                    obj[n.id] = n.node;
                  }
                  setSubmitting(true);
                  queue_prompt_cmd(JSON.stringify(obj))
                    .then((r) => {
                      notification.success("调用成功");
                      setResult(r);
                    })
                    .catch((err) => {
                      notification.error("调用失败:" + err);
                    })
                    .finally(() => {
                      setSubmitting(false);
                    });
                }}
              >
                调用API
              </PrimaryButton>
            </div>
            <div>
              <PrimaryButton
                disabled={!result}
                onClick={() => {
                  if (result) {
                    get_history_cmd(result.prompt_id)
                      .then((r: any) => {
                        setHistory(r[result.prompt_id])
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
              {history?.status.status_str}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
