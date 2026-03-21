// 剧本分析

import { ContentNode } from "../components/editor/types";

export interface Role {
  name: string;
}

export function extract_roles(content: ContentNode[]): Role[] {
  const roles: Role[] = [];
  for (const node of content) {
    if ((node as any).role === true) {
      if (roles.find((role) => role.name === (node as any).text)) {
        continue;
      }
      roles.push({ name: (node as any).text });
    } else if (!!node.children) {
      const arr = extract_roles(node.children as ContentNode[])
      for (const role of arr) {
        if (!roles.find((r) => r.name === role.name)) {
          roles.push(role);
        }
      }
    }
  }
  return roles;
}

