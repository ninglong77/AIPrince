/**
 * Get all assets from comfyUI
 */

import { useCallback, useEffect, useState } from "react";
import { fetch } from '@tauri-apps/plugin-http';
import { PrimaryTextButton } from "../../components/buttons";

interface Asset {
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
  const include_tags = "output";
  const url = `${server}/api/assets?limit=${limit}&offset=${offset}&include_tags=${include_tags}`;
  return await fetch(url).then((res) => res.json()) as AllAssets;
}

function AssetComp({server, asset}: {asset: Asset, server: string}) {
  server = server.replace(/\/$/, "");
  return (
    <div className="asset">
      <img src={`${server}${asset.preview_url}`} alt={asset.name} />
      <div className="asset-info">
        <div className="asset-name">{asset.name}</div>
        <div className="asset-size">{asset.size}</div>
        {/** tags */}
        <div className="flex flex-row text-sm gap-2 text-slate-500">
          {asset.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div>user metadata: {JSON.stringify(asset.user_metadata)}</div>
      </div>
    </div>
  );
}

export default function ({server}: {server: string}) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const limit = 20;
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const getAssets = useCallback(async () => {
    setLoading(true);
    get_assets(server, limit, offset).then(r => {
      console.info("get assets:"+r.total)
      console.info("has more:"+r.has_more)
      setTotal(r.total)
      setAssets(r.assets)
    }).catch(e => {
      console.info(e);
    }).finally(() => {
      setLoading(false);
    });
  }, [server, offset]);
  useEffect(() => {
    getAssets()
  }, [offset])
  useEffect(() => {
    console.info("getting assets:"+server)
    getAssets()
  }, []);
  // const assets = get_assets(server);
  return <div className="flex flex-col gap-1">
    {loading && <div className="text-slate-400 opacity-50">Loading...</div>}
    {assets.map(asset => <AssetComp server={server} key={asset.id} asset={asset} />)}
    {/** Pagination */}
    <div className="flex flex-row gap-1">
      <PrimaryTextButton onClick={() => setOffset(Math.max(offset - limit, 0))} disabled={offset <= 0}>Prev</PrimaryTextButton>
      <PrimaryTextButton onClick={() => setOffset(Math.min(offset + limit, total))} disabled={offset + limit >= total}>Next</PrimaryTextButton>
    </div>
  </div>
}
