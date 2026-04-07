import { useEffect, useState } from "react";
import { ComfyUiHistory, useComfyUiStore, Node } from "../../states/comfyui";
import { PrimaryButton, PrimaryTextButton } from "../buttons";
import { ComfyUiResult } from "../../services/comfyui";
import { useNotification } from "../notification";
import { LocalImage } from "../images";

export default function ({ nodes }: { nodes: Node[] }) {
  const comfyui = useComfyUiStore();
  const [result, setResult] = useState<ComfyUiResult>();
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<ComfyUiHistory>();
  const [pending, setPending] = useState<boolean>(false);
  const [image, setImage] = useState<string>();
  const notification = useNotification();
  return (
    <div className="mt-4 flex border-t mb-8 py-4 border-slate-200 flex-col gap-2">
      <div>
        <PrimaryButton
          disabled={submitting || pending}
          onClick={() => {
            setSubmitting(true);
            comfyui
              .queue_prompt(nodes)
              .then((r) => {
                setResult(r);
                // wait for result
                setPending(true);
                console.info(JSON.stringify(r))
                if (r) {
                  console.info(JSON.stringify(r))
                  notification.success("调用成功");
                comfyui
                  .wait_for_result(r.prompt_id)
                  .then((r) => {
                    setHistory(r);
                  })
                  .catch((e) => {
                    notification.error("调用 wait_for_result 失败:" + e);
                  })
                  .finally(() => {
                    setPending(false);
                  });
                } else {
                  throw Error("Result is null")
                }
              })
              .catch((err) => {
                notification.error("调用失败:" + err);
                setPending(false)
              })
              .finally(() => {
                setSubmitting(false);
              });
          }}
        >
          {pending ? "Pending" : "调用API"}
        </PrimaryButton>
      </div>
      <div>
        <PrimaryButton
          disabled={!result}
          onClick={() => {
            if (result) {
              comfyui
                .get_history(result.prompt_id)
                .then((r) => {
                  setHistory(r);
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
              comfyui
                .get_image("http://192.168.31.99:18188", history)
                .then((r) => {
                  if (r && r.length > 0) {
                    setImage(r[0]);
                  }
                  notification.success("Download 成功" + r);
                })
                .catch((e) => {
                  notification.error("Download 失败" + e);
                });
            }
          }}
        >
          Download Image
        </PrimaryButton>
      </div>
      <div>{history?.status.status_str}</div>
      <div>{history?.outputs && JSON.stringify(history?.outputs)}</div>
      <div>
        {image && <LocalImage src={image} />}
        {/* <img src={'asset://Users/liaojinlong/.prince_files/ed69a039-37ed-4685-86a7-bb72a77897be.png'} alt="Generated Image" /> */}
      </div>
    </div>
  );
}
