/**
 * 剧本分析结果
 */

import { useEffect, useState } from "react";
import { extract_roles, Role } from "../../services/analysis";
import { useNotification } from "../notification";
import { useModals } from "../modal";
import RoleDesigner from "../shots/RoleDesigner";
import { LocalImage } from "../images";

const roleImagesCache: {[key: string]: string} = {}
const setRoleImagesCache = (data: {[key: string]: string}) => {
  Object.assign(roleImagesCache, data);
}

const roleImages: {[key: string]: string} = {}
const setRoleImages = (data: {[key: string]: string}) => {
  Object.assign(roleImages, data);
}


export function RolesCard({ ai_script }: { ai_script: string }) {
  const [roles, setRoles] = useState<Role[]>([]);
  const notification = useNotification();
  const {open} = useModals();
  useEffect(() => {
    try {
      if (ai_script) {
        setRoles(extract_roles(JSON.parse(ai_script)));
      }
    } catch (e) {
      notification.error("解析失败:"+e)
    }
  }, [ai_script])


  const setRoleImageFromCache = (roleName: string) => {
    if (roleImagesCache[roleName]) {
      setRoleImages({
        ...roleImages,
        [roleName]: roleImagesCache[roleName],
      })
    }
  }
  return <div>
    <div className="text-lg font-bold mb-2">角色列表</div>
    <div className="flex flex-row gap-2">
      {roles.length === 0 && (<div className="text-slate-400 text-sm">暂无数据</div>)}
      {roles.map((role, index) => (
        <div onClick={() => {
          open({
            title: `${role.name}`,
            content: <RoleDesigner onRoleCreated={(image) => {
              setRoleImagesCache({
                ...roleImagesCache,
                [role.name]: image,
              })
            }} />,
            comfirmText: "Confirm",
            cancelText: "Cancel",
            onConfirm: () => {
              setRoleImageFromCache(role.name)
            },
            onClose: () => {},
          })
        }} key={index} className="cursor-pointer flex justify-center items-center flex-col gap-1">
          <div className="text-md text-slate-800 rounded-md w-24 h-32 bg-slate-300">
            {roleImages[role.name] && <LocalImage className="w-24 max-h-32 rounded-md" src={roleImages[role.name]} />}
          </div>
          <div className="text-slate-400 text-sm self-center">{role.name}</div>
        </div>
      ))}
    </div>
  </div>
}
