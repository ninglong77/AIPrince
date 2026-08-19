/**
 * Get all assets from comfyUI
 */

import { useCallback, useEffect, useState } from "react";
import { fetch } from "@tauri-apps/plugin-http";
import { PrimaryTextButton } from "../../components/buttons";
import { Modal, useModals } from "../../components/modal";

export interface Asset {
  id: string;
  name: string;
  size: number;
  asset_hash: string;
  tags: string[];
  preview_url: string;
  prompt_id: string;
  user_metadata: {
    [key: string]: string;
  };
}

interface AllAssets {
  assets: Asset[];
  total: number;
  has_more: boolean;
}

async function get_assets(server: string, limit = 100, offset = 0) {
  // if server with / as end of url, remove it
  server = server.replace(/\/$/, "");
  const include_tags = "uploaded";
  const exclude_tags = "";
  const url = `${server}/api/assets?limit=${limit}&offset=${offset}&include_tags=${include_tags}&exclude_tags=${exclude_tags}`;
  return (await fetch(url).then((res) => res.json())) as AllAssets;
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
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <img src={image} alt="asset" onClick={() => setShow(true)} />
      {show && (
        <div
          className="fixed overflow-scroll top-0 left-0 flex flex-row justify-center items-center w-screen h-screen z-100 bg-black/80"
          onClick={() => setShow(false)}
        >
          <img className="max-w-75" src={image} alt="asset" />
        </div>
      )}
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
  asset: Asset;
  server: string;
  selected?: boolean;
  onSelected?: (asset: Asset) => void;
}) {
  server = server.replace(/\/$/, "");
  return (
    <div className="w-24">
      {/* <img className="" src={`${server}${asset.preview_url}`} alt={asset.name} /> */}
      <ImageComp
        selected={selected}
        image={`${server}${asset.preview_url}`}
        onSelected={() => {
          onSelected?.(asset);
        }}
      />
      <div className="">
        <div className="text-sm overflow-clip text-ellipsis">{asset.name}</div>
        <div className="text-xs text-slate-400">{asset.size / 1024} KB</div>
        <div>{JSON.stringify(asset.tags)}</div>
      </div>
    </div>
  );
}

export default function ComfyUiAssets({
  server,
  onSelected,
}: {
  server: string;
  onSelected?: (asset: Asset) => void;
}) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const limit = 20;
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Asset>();
  const getAssets = useCallback(async () => {
    setLoading(true);
    get_assets(server, limit, offset)
      .then((r) => {
        console.info("get assets:" + r.total);
        console.info("has more:" + r.has_more);
        setTotal(r.total);
        setAssets(r.assets);
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
            onSelected={() => {
              console.info(asset.id);
              setSelected(asset);
              onSelected?.(asset);
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

export function ComfyUiAssetsSelectorModal({
  server,
  onSelected,
}: {
  server: string;
  onSelected?: (asset: Asset) => void;
}) {
  const modal = useModals();
  const [cacheAsset, setCacheAsset] = useState<Asset>();
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
        <ComfyUiAssets
          onSelected={(a) => {
            setCacheAsset(a);
          }}
          server={server}
        />
      }
    />
  );
}
