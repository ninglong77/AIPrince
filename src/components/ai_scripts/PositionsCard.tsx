/**
 * 剧本分析结果
 */

import { useEffect, useState } from "react";
import { extract_postion, Position } from "../../services/analysis";
import { useNotification } from "../notification";
import { useModals } from "../modal";
import { LocalImage } from "../images";
import { useKvStore } from "../../hooks/kv.tsx";
import PositionDesigner from "../shots/PositionDesigner.tsx";

export function PositionsCard({ ai_script, id }: { id: number, ai_script: string }) {
  const [positions, setPositions] = useState<Position[]>([]);
  const notification = useNotification();
  const {open} = useModals();
  const positionImages = useKvStore().store('PositionImages').store(''+id)
  const positionImagesCache = useKvStore().store('PositionImagesCache').store(''+id).store('cache')
  useEffect(() => {
    try {
      if (ai_script) {
        setPositions(extract_postion(JSON.parse(ai_script)));
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
      {positions.length === 0 && (<div className="text-slate-400 text-sm">暂无数据</div>)}
      {positions.map((position, index) => (
        <div onClick={() => {
          open({
            title: `${position.name}`,
            content: <PositionDesigner onRoleCreated={(image) => {
              positionImagesCache.set(position.name, image).then(() => {
                console.info('setRoleImagesCache success: '+ position.name+','+ image)
              })
            }} />,
            comfirmText: "Confirm",
            cancelText: "Cancel",
            onConfirm: () => {
              setPositionImageFromCache(position.name).then(() => {
                console.info('setPositionImages from cache success: '+ position.name)
              })
            },
            onClose: () => {},
          })
        }} key={index} className="cursor-pointer flex justify-center items-center flex-col gap-1">
          <div className="text-md text-slate-800 rounded-md w-24 h-32 bg-slate-300">
            {positionImages.get(position.name) && <LocalImage className="w-24 max-h-32 rounded-md" src={positionImages.get(position.name)} />}
          </div>
          <div className="text-slate-400 text-sm self-center">{position.name}</div>
        </div>
      ))}
    </div>
  </div>
}
