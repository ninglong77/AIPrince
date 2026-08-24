/**
 * Get all assets from comfyUI
 */

import { useCallback, useEffect, useState } from "react";
import { fetch } from "@tauri-apps/plugin-http";
import { PrimaryTextButton } from "../buttons";
import { Modal, useModals } from "../modal";
import {
  list_local_assets_cmd,
  LocalAsset,
  uploaded_local_asset,
} from "../../services/assets_manager";
import { LocalImage, WrapperClickedEnlarge } from "../images";
import { readFile } from "@tauri-apps/plugin-fs";

interface UploadAssetResult {
  id: number;
  name: string;
  size: number;
  preview_url: string;
  hash: string; // 真正的 comfyui_path
}

async function upload_asset(
  server: string,
  local_path: string,
): Promise<UploadAssetResult | undefined> {
  // if server with / as end of url, remove it
  server = server.replace(/\/$/, "");
  // get file name from local_path
  const file_name = local_path.split("/").pop();
  const url = `${server}/api/assets`;
  const fileBytes = await readFile(local_path);
  // Create a Blob from the raw bytes
  const blob = new Blob([fileBytes], { type: "image/png" });
  const formData = new FormData();
  formData.append("file", blob, file_name!);
  // add name
  formData.append("name", file_name!);
  // add tags
  formData.append("tags", ["input", "local"].join(","));
  // Send the fetch request without a Content-Type header
  const response = await fetch(url, {
    method: "POST",
    body: formData, // The browser auto-sets Content-Type: multipart/form-data; boundary=...
  });

  if (!response.ok) {
    throw new Error("Upload failed:" + JSON.stringify(await response.json()));
  }
  const result = await response.json();
  console.info("Upload successful:" + JSON.stringify(result));
  return result;
}

/** Show image when clicked  */
function ImageComp({
  image,
  onSelected,
  selected,
}: {
  image: string;
  onSelected?: (image: string) => void;
  selected?: boolean;
}) {
  return (
    <div className="relative">
      <WrapperClickedEnlarge
        enlarge={<LocalImage className="w-75" src={image} />}
      >
        <LocalImage className="w-36" src={image} />
      </WrapperClickedEnlarge>
      <div
        onClick={() => {
          onSelected?.(image);
        }}
        className={
          "absolute w-5 h-5 cursor-pointer rounded-full top-1 right-1 border-2 border-green-500 p-px"
        }
      >
        <div
          className={
            "w-full h-full rounded-full " +
            (selected ? " bg-green-500" : "hover:bg-green-300/50")
          }
        ></div>
      </div>
    </div>
  );
}

function AssetComp({
  server,
  asset,
  onSelected,
  selected,
}: {
  asset: LocalAsset;
  server: string;
  selected?: boolean;
  onSelected?: (asset: LocalAsset) => void;
}) {
  server = server.replace(/\/$/, "");
  return (
    <div className="w-24">
      {asset.id}
      <ImageComp
        selected={selected}
        image={asset.local_path}
        onSelected={() => {
          onSelected?.(asset);
        }}
      />
    </div>
  );
}

export function LocalAssets({
  server,
  onSelected,
}: {
  server: string;
  onSelected?: (asset: LocalAsset) => void;
}) {
  const [assets, setAssets] = useState<LocalAsset[]>([]);
  const limit = 20;
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<LocalAsset>();
  const getAssets = useCallback(async () => {
    setLoading(true);
    list_local_assets_cmd()
      .then((r) => {
        setTotal(r.length);
        setAssets(r);
      })
      .catch((e) => {
        console.info(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [server, offset]);
  useEffect(() => {
    getAssets();
  }, [offset]);
  useEffect(() => {
    console.info("getting assets:" + server);
    getAssets();
  }, []);
  // const assets = get_assets(server);
  return (
    <div className="flex flex-col gap-1">
      {loading && <div className="text-slate-400 opacity-50">Loading...</div>}
      <div className="flex flex-row gap-1 flex-wrap">
        {assets.map((asset) => (
          <AssetComp
            selected={asset.id === selected?.id}
            onSelected={(a) => {
              console.info(a.id);
              // 检查是否已上传 comfyui，若已经上传，则直接获取名字
              if (a.uploaded) {
                setSelected(a);
                onSelected?.(a);
                return;
              }
              // 上传 comfyui 获取名字
              upload_asset(server, a.local_path)
                .then((r) => {
                  if (!r) {
                    return;
                  }
                  const hash = r.hash.replace("blake3:", "")+".png";
                  uploaded_local_asset(a.id, hash);
                  return hash
                })
                .then(image => {
                  if (!image) {
                    return;
                  }
                  console.info("上传成功");
                  setSelected({...a, comfyui_name: image});
                  onSelected?.({...a, comfyui_name: image});
                })
                .catch((e) => {
                  console.error("上传失败:" + e);
                });
            }}
            server={server}
            key={asset.id}
            asset={asset}
          />
        ))}
      </div>
      {/** Pagination */}
      <div className="flex flex-row gap-1">
        <PrimaryTextButton
          onClick={() => setOffset(Math.max(offset - limit, 0))}
          disabled={offset <= 0}
        >
          Prev
        </PrimaryTextButton>
        <PrimaryTextButton
          onClick={() => setOffset(Math.min(offset + limit, total))}
          disabled={offset + limit >= total}
        >
          Next
        </PrimaryTextButton>
      </div>
    </div>
  );
}

export function LocalAssetsSelectorModal({
  server,
  onSelected,
}: {
  server: string;
  onSelected?: (asset: LocalAsset) => void;
}) {
  const modal = useModals();
  const [cacheAsset, setCacheAsset] = useState<LocalAsset>();
  return (
    <Modal
      onClose={() => {
        modal.pop();
      }}
      onConfirm={() => {
        if (cacheAsset) {
          onSelected?.(cacheAsset);
        }
        modal.pop();
      }}
      title="ComfyUI 资源1"
      content={
        <LocalAssets
          onSelected={(a) => {
            setCacheAsset(a);
          }}
          server={server}
        />
      }
    />
  );
}
