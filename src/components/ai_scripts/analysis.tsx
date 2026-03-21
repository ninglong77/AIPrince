/**
 * 剧本分析结果
 */

import { useEffect, useState } from "react";
import { extract_roles, Role } from "../../services/analysis";
import { useNotification } from "../notification";

export function RolesCard({ ai_script }: { ai_script: string }) {
  const [roles, setRoles] = useState<Role[]>([]);
  const notification = useNotification();
  useEffect(() => {
    try {
      if (ai_script) {
        setRoles(extract_roles(JSON.parse(ai_script)));
      }
    } catch (e) {
      notification.error("解析失败:"+e)
    }
    
  }, [ai_script])
  return <div>
    <div className="text-lg font-bold mb-2">角色列表</div>
    <div className="flex flex-row gap-2">
      {roles.length === 0 && (<div className="text-slate-400 text-sm">暂无数据</div>)}
      {roles.map((role, index) => (
        <div key={index} className="bg-slate-300 cursor-pointer rounded-md w-24 h-32 flex justify-center items-center">
          <div className="text-md text-slate-800">{role.name}</div>
        </div>
      ))}
    </div>
  </div>
}
