import { Editor, Transforms, Element } from "slate";
import { EditorType } from "./types";

export const CustomHelper = {
  // 判断当前选区是否在代码块中
  isCodeBlockActive(editor: EditorType) {
    const [match] = Editor.nodes(editor, {
      match: (n) => (n as any).type === "code",
    });

    return !!match;
  },
  // 切换代码块
  toggleCodeBlock(editor: EditorType) {
    const isActive = CustomHelper.isCodeBlockActive(editor);
    Transforms.setNodes(editor, { type: isActive ? null : "code" } as any, {
      match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
    });
  },
  // 在当前行插入一个新的段落
  newLine(editor: EditorType) {
    Transforms.insertNodes(
      editor,
      { type: "paragraph", children: [{ text: "" }] } as any,
      {
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
      },
    );
  },
  toggleByTrigger(editor: EditorType, target: string) {
    if (target === "newline") {
      CustomHelper.newLine(editor);
      return true;
    }
    const mapping: {
      type: "element" | "style";
      key: string;
      trigger: string;
    }[] = [
      { type: "element", key: "code", trigger: "`" },
      { type: "element", key: "title1", trigger: "1" },
      { type: "element", key: "title2", trigger: "2" },
      { type: "element", key: "title3", trigger: "3" },
      { type: "style", key: "bold", trigger: "b" },
      { type: "style", key: "italic", trigger: "i" },
      { type: "style", key: "underline", trigger: "u" },
      { type: "style", key: "lineThrough", trigger: "l" },
      { type: "element", key: "shot", trigger: "shot" },
      { type: "style", key: "role", trigger: "role" },
      { type: "element", key: "action", trigger: "action" },
      { type: "element", key: "background", trigger: "background" },
      { type: "element", key: "dialog", trigger: "dialog" },
    ];
    for (const { type, key, trigger } of mapping) {
      if (target.toLowerCase() === trigger) {
        if (type === "element") {
          const [match] = Editor.nodes(editor, {
            match: (n) => (n as any).type === key,
          });
          Transforms.setNodes(
            editor,
            { type: match ? "paragraph" : key } as any,
            {
              match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
            },
          );
        } else if (type === "style") {
          const [match] = Editor.nodes(editor, {
            match: (n) => (n as any)[key],
          });
          if (match) {
            Editor.removeMark(editor, key);
          } else {
            Editor.addMark(editor, key, true);
          }
        }
        return true;
      }
    }
    return false;
  },
};
