import { useCallback, useEffect, useState } from "react";
import { createEditor, Transforms, Element, Editor, Text } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import {
  CodeElement,
  DefaultElement,
  Title1Element,
  Title2Element,
  Title3Element,
} from "./base_elements";
import {
  ActionElement,
  BackgroundElement,
  DialogElement,
  RoleElement,
  ShotElement,
} from "./shot_elements";
import { CustomHelper } from "./helper";
import Toolbar from "./toolbar";
import { ContentNode, EditorType } from "./types";

// const initialValue1 = [
//   {
//     type: "paragraph",
//     children: [{ text: "A line of text in a paragraph." }],
//   },
// ];

// Define a React component to render leaves with bold text.
const Leaf = (props: any) => {
  if (props.leaf.role) {
    return <RoleElement {...props} />;
  }
  if (props.leaf.action) {
    return <ActionElement {...props} />;
  }
  if (props.leaf.background) {
    return <BackgroundElement {...props} />;
  }
  if (props.leaf.dialog) {
    return <DialogElement {...props} />;
  }
  let text_decoration = "none";
  if (props.leaf.underline) {
    text_decoration = "underline";
  }
  if (props.leaf.lineThrough) {
    text_decoration = "line-through";
  }
  if (props.leaf.underline && props.leaf.lineThrough) {
    text_decoration = "underline line-through";
  }
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? "bold" : "normal",
        fontStyle: props.leaf.italic ? "italic" : "normal",
        textDecoration: text_decoration,
        textDecorationColor: props.leaf.underline ? "black" : "transparent",
        textUnderlineOffset: props.leaf.underline ? "1px" : "0",
      }}
    >
      {props.children}
    </span>
  );
};

const withCodeBlock = (editor: EditorType) => {
  const { insertBreak } = editor;

  editor.insertBreak = () => {
    const [codeBlock] = Editor.nodes(editor, {
      match: (n) => (n as any).type === "shot" || (n as any).type === "code", // 根据你的节点类型调整
    });

    if (codeBlock) {
      // 在代码块内：插入一个换行符
      editor.insertText("\n");
      return;
    }

    // 其他情况执行默认换行行为
    insertBreak();
  };

  return editor;
};

export function MyEditor({
  initialValue,
  onChange,
}: {
  initialValue: ContentNode[];
  onChange?: (content: ContentNode[]) => void;
}) {
  const [editor] = useState(() => withCodeBlock(withReact(createEditor())));
  const [content, setContent] = useState<ContentNode[]>(initialValue);
  useEffect(() => {
    onChange && onChange(content);
  }, [content]);
  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      case "title1":
        return <Title1Element {...props} />;
      case "title2":
        return <Title2Element {...props} />;
      case "title3":
        return <Title3Element {...props} />;
      case "shot":
        return <ShotElement shot_seq={1} {...props} />;
      case "role":
        return <RoleElement {...props} />;
      case "action":
        return <ActionElement {...props} />;
      case "background":
        return <BackgroundElement {...props} />;
      case "dialog":
        return <DialogElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);
  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />;
  }, []);
  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => "set_selection" !== op.type,
        );
        // setContent(value as ContentNode[]);
        if (isAstChange) {
          // Save the value to Local Storage.
          setContent(value as ContentNode[]);
        }
      }}
    >
      <div className="border border-slate-100/10 p-2 rounded-md shadow-sm">
        {/** Toolbar */}
        <div className="flex gap-1 mb-2 border-b border-slate-400/20 pb-1">
          <Toolbar editor={editor} />
        </div>
        <Editable
          className="outline-0 pl-1"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={(event) => {
            // 如果当前是 role，并且用户按下了换行符符空格键或者：或者:，移除 role mark
            if (
              event.key === " " ||
              event.key === ":" ||
              event.key === "Enter"
            ) {
              const [match] = Editor.nodes(editor, {
                match: (n) => (n as any).role,
              });
              if (match) {
                const [node] = match;
                const text = (node as any).text;
                event.preventDefault();
                Transforms.insertText(editor, "");
                Editor.removeMark(editor, "role");
                if (Text.isText(node) && text.includes("：")) {
                  // remove ：and update the node text
                  // TODO 处理中文冒号情况
                }
                return;
              }
            }
            // 如果用户按下回车键，而当前处于编辑代码状态，当前行为空行，则退出代码块
            if (event.key === "Enter") {
              // 如果同时按下了 shift 键，则强制换行，不退出代码块
              if (!event.shiftKey) {
                const [match] = Editor.nodes(editor, {
                  match: (n) => (n as any).type === "code",
                });
                if (match) {
                  const [node] = match;
                  const text = (node as any).children[0].text;
                  if (text === "") {
                    event.preventDefault();
                    Transforms.setNodes(editor, { type: "paragraph" } as any, {
                      match: (n) =>
                        Element.isElement(n) && Editor.isBlock(editor, n),
                    });
                    return;
                  }
                }
              }
              // 如果当前行是标题，则退出标题
              const [match] = Editor.nodes(editor, {
                match: (n) =>
                  (n as any).type === "title1" ||
                  (n as any).type === "title2" ||
                  (n as any).type === "title3",
              });
              if (match) {
                // 强制换行
                event.preventDefault();
                CustomHelper.newLine(editor);
                return;
              }
              // 如果当前行是 shot，并且用户按下了shift+enter，退出shot
              const [shotMatch] = Editor.nodes(editor, {
                match: (n) => (n as any).type === "shot",
              });
              if (shotMatch && event.shiftKey) {
                event.preventDefault();
                CustomHelper.newLine(editor);
                Transforms.setNodes(editor, { type: "paragraph" } as any, {
                  match: (n) =>
                    Element.isElement(n) && Editor.isBlock(editor, n),
                });
                return;
              }
            }
            if (!event.ctrlKey) {
              return;
            }
            if (CustomHelper.toggleByTrigger(editor, event.key)) {
              event.preventDefault();
            }
          }}
        />
      </div>
    </Slate>
  );
}
