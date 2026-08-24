/**
 * 剧本分析结果
 */

import { useEffect, useState } from "react";
import { extract_shots, Shot } from "../../services/analysis";
import { useNotification } from "../notification";
import { useModals } from "../modal";
import { LocalImage } from "../images";
import { useKvStore } from "../../hooks/kv.tsx";
import ShotDesigner from "../shots/ShotDesigner.tsx";

export function ShotsCard({ ai_script, id }: { id: number, ai_script: string }) {
  const [shots, setShots] = useState<Shot[]>([]);
  const notification = useNotification();
  const {open} = useModals();
  // 存储剧本的场景数据
  const positionImages = useKvStore().store('PositionImages').store(''+id)
  const positionImagesCache = useKvStore().store('PositionImagesCache').store(''+id).store('cache')
  useEffect(() => {
    try {
      if (ai_script) {
        setShots(extract_shots(JSON.parse(ai_script)));
      }
    } catch (e) {
      notification.error("解析失败:"+e)
    }
  }, [ai_script])


  const setPositionImageFromCache = async (roleName: string) => {
    if (positionImagesCache.get(roleName)) {
      await positionImages.set(roleName, positionImagesCache.get(roleName))
    }
  }
  return <div>
    <div className="text-lg font-bold mb-2">场景列表</div>
    <div className="flex flex-row gap-2">
      {/* {JSON.stringify(shots)} */}
      {shots.length === 0 && (<div className="text-slate-400 text-sm">暂无数据</div>)}
      {shots.map((shot, index) => (
        <div onClick={() => {
          open({
            title: `Shot ${index+1}`,
            content: <ShotDesigner shot={shot} onCreated={(image) => {
              // positionImagesCache.set(position.name, image).then(() => {
              //   console.info('setRoleImagesCache success: '+ position.name+','+ image)
              // })
            }} />,
            extraClassName: '',
            comfirmText: "Confirm",
            cancelText: "Cancel",
            onConfirm: () => {
              // setPositionImageFromCache(position.name).then(() => {
              //   console.info('setPositionImages from cache success: '+ position.name)
              // })
            },
            onClose: () => {},
          })
        }} key={index} className="cursor-pointer flex justify-center items-center flex-col gap-1">
          <div className="text-md text-slate-800 rounded-md w-24 h-32 bg-slate-300">
            {/* {positionImages.get(position.name) && <LocalImage className="w-24 max-h-32 rounded-md" src={positionImages.get(position.name)} />} */}
          </div>
          <div className="text-slate-400 text-sm self-center">{'Shot '+(index+1)}</div>
        </div>
      ))}
    </div>
  </div>
}
