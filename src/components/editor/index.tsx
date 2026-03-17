import { useCallback, useState } from "react";
import { createEditor, Transforms, Element, Editor, BaseEditor } from "slate";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { useNotification } from "../notification";

type EditorType = BaseEditor & ReactEditor;

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

// Define a React component renderer for our code blocks.
const CodeElement = (props: any) => {
  return (
    <pre
      className="text-red-400 border-l-2 border-purple-600 pl-1"
      {...props.attributes}
    >
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props: any) => {
  return (
    <p className="text-green-700" {...props.attributes}>
      {props.children}
    </p>
  );
};

const Title1Element = (props: any) => {
  return (
    <h1 className="text-2xl font-bold text-blue-700" {...props.attributes}>
      {props.children}
    </h1>
  );
};

const Title2Element = (props: any) => {
  return (
    <h2 className="text-xl font-bold text-blue-600" {...props.attributes}>
      {props.children}
    </h2>
  );
};

const Title3Element = (props: any) => {
  return (
    <h3 className="text-lg font-bold text-blue-500" {...props.attributes}>
      {props.children}
    </h3>
  );
};

// Define a React component to render leaves with bold text.
const Leaf = (props: any) => {
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

const CustomHelper = {
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

export function MyEditor() {
  const [editor] = useState(() => withReact(createEditor()));
  const notifaction = useNotification();
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
        if (isAstChange) {
          // Save the value to Local Storage.
          const content = JSON.stringify(value);
          // localStorage.setItem('content', content)
          console.log("Content was updated:", content);
        }
      }}
    >
      <div className="border border-slate-100/10 p-2 rounded-md">
        {/** Toolbar */}
        <div className="flex gap-1 mb-2">
          <button
            onMouseDown={(event) => {
              event.preventDefault();
              CustomHelper.toggleCodeBlock(editor);
            }}
            className="px-1 rounded hover:bg-slate-700/50"
          >
            code
          </button>
        </div>
        <Editable
          className="outline-0"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={(event) => {
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
