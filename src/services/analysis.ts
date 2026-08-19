// 剧本分析

import { ContentNode } from "../components/editor/types";

export interface Role {
  name: string;
}

export interface Position {
  name: string;
}

export interface Dialog {
  role: Role;
  dialog: string;
}

export interface Shot {
  position?: Position;
  background?: string;
  dialogs: Dialog[];
}

function extract_(content: ContentNode[], s: string): Role[] {
  const roles: any[] = [];
  for (const node of content) {
    if ((node as any)[s] === true) {
      const text = (node as any).text
      if (!text || !text.trim()) {
        continue;
      }
      if (roles.find((role) => role.name === text)) {
        continue;
      }
      roles.push({ name: (node as any).text });
    } else if (!!node.children) {
      const arr = extract_(node.children as ContentNode[], s)
      for (const role of arr) {
        if (!roles.find((r) => r.name === role.name)) {
          roles.push(role);
        }
      }
    }
  }
  return roles;
}

export function extract_postion(content: ContentNode[]): Position[] {
  return extract_(content, "position")
}

export function extract_roles(content: ContentNode[]): Role[] {
  return extract_(content, "role") 
}

export function extract_shots(content: ContentNode[]): Shot[] {
  const shots: Shot[] = [];
  for (const node of content) {
    if ((node as any)['type'] === 'shot') {
      let position: Position | undefined;
      let dialogs: Dialog[] = [];
      let background: string | undefined;

      for (const child of (node as any)['children']) {
        // 分析节点，得到 position
        if (child['position'] && !position) {
          position = {name: child.text}
        }
        // 分析节点，得到 背景
        if (child['background'] && !background) {
          background = child.text.trim()
        }
        // 分析节点，得到 角色和对话，如果当前是角色，就在 dialogs 中新增一个节点
        if (child['role']) {
          dialogs.push({
            role: {
              name: child.text.trim(),
            },
            dialog: ""
          })
        }
        // 如果是对话，则设置到 dialogs 中最后一个节点
        if (child['dialog']) {
          // 如果当前有 dialog
          if (dialogs.length) {
            dialogs[dialogs.length - 1].dialog = child.text
          }
        }
      }
      shots.push({
        position,
        dialogs,
        background
      });
    }
  }
  return shots;
}

