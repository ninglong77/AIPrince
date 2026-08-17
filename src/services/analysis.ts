// 剧本分析

import { ContentNode } from "../components/editor/types";

export interface Role {
  name: string;
}

export interface Position {
  name: string;
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

