import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

export type EditorType = BaseEditor & ReactEditor;

export interface ContentNode {
  type: string;
  children:
    | ContentNode[]
    | {
        text: string;
        bold: boolean;
        italic: boolean;
        underline: boolean;
        lineThrough: boolean;
      }[];
}
