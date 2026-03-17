import { useCallback, useState } from "react";
import { createEditor, Transforms, Element, Editor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { useNotification } from "../notification";

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

// Define a React component to render leaves with bold text.
const Leaf = (props: any) => {
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? "bold" : "normal",
        fontStyle: props.leaf.italic ? "italic" : "normal",
      }}
    >
      {props.children}
    </span>
  );
};

export function MyEditor() {
  const [editor] = useState(() => withReact(createEditor()));
  const notifaction = useNotification();
  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);
  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />;
  }, []);
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        className="border border-slate-100/10 p-2 rounded-md outline-0"
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
          }
          if (!event.ctrlKey) {
            return;
          }
          switch (event.key) {
            // When "`" is pressed, keep our existing code block logic.
            case "`": {
              event.preventDefault();
              const [match] = Editor.nodes(editor, {
                match: (n) => (n as any).type === "code",
              });
              Transforms.setNodes(
                editor,
                { type: match ? "paragraph" : "code" } as any,
                {
                  match: (n) =>
                    Element.isElement(n) && Editor.isBlock(editor, n),
                },
              );
              break;
            }
            // When "B" is pressed, bold the text in the selection.
            case "b": {
              event.preventDefault();
              const [match] = Editor.nodes(editor, {
                match: (n) => (n as any).bold,
              });
              if (match) {
                Editor.removeMark(editor, "bold");
              } else {
                Editor.addMark(editor, "bold", true);
              }
              break;
            }
            // When "I" is pressed, italic the text in the selection.
            case "i": {
              event.preventDefault();
              const [match] = Editor.nodes(editor, {
                match: (n) => (n as any).italic,
              });
              if (match) {
                Editor.removeMark(editor, "italic");
              } else {
                Editor.addMark(editor, "italic", true);
              }
              break;
            }
          }
        }}
      />
    </Slate>
  );
}
