import { useEffect, useState } from "react";
import {
  list_local_assets_cmd,
  LocalAsset,
} from "../../services/assets_manager";
import { LocalImage, WrapperClickedEnlarge } from "../../components/images";
import { Button } from "../../components/buttons";

export default function AssetsManager() {
  const [local_assets, setLocalAssets] = useState<LocalAsset[]>([]);
  const load = () => {
    list_local_assets_cmd()
      .then((r) => {
        setLocalAssets(r);
      })
      .catch((e) => {
        console.error(e);
      });
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <div className="flex flex-col w-full items-center">
      <h1>AssetsManager</h1>
      <div className="self-start p-4">
        <Button onClick={load}>Reload</Button>
        <div className="flex flex-row flex-wrap gap-8 w-full mt-4">
          {local_assets.map((asset) => (
            <div className="p-1 shadow">
              <WrapperClickedEnlarge
                enlarge={<LocalImage className="w-75" src={asset.local_path} />}
              >
                <LocalImage className="w-36" src={asset.local_path} />
              </WrapperClickedEnlarge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
