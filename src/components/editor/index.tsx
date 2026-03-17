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

const Title1Element = (props: any) => {
  return (
    <h1 className="text-2xl font-bold text-blue-700" {...props.attributes}>
      {props.children}
    </h1>
  );
}

const Title2Element = (props: any) => {
  return (
    <h2 className="text-xl font-bold text-blue-600" {...props.attributes}>
      {props.children}
    </h2>
  );
}

const Title3Element = (props: any) => {
  return (
    <h3 className="text-lg font-bold text-blue-500" {...props.attributes}>
      {props.children}
    </h3>
  );
}

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
                match: (n) => (n as any).type in ["code"],
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
              Transforms.insertNodes(
                editor,
                { type: "paragraph", children: [{ text: "" }] } as any,
                {
                  match: (n) =>
                    Element.isElement(n) && Editor.isBlock(editor, n),
                },
              );
              return;
            }
          }
          if (!event.ctrlKey) {
            return;
          }
          const mapping: { type: 'element'|'style', key: string, trigger: string }[] = [
            { type: 'element', key: 'code', trigger: '`' },
            { type: 'element', key: 'title1', trigger: '1' },
            { type: 'element', key: 'title2', trigger: '2' },
            { type: 'element', key: 'title3', trigger: '3' },
            { type: 'style', key: 'bold', trigger: 'b' },
            { type: 'style', key: 'italic', trigger: 'i' },
            { type: 'style', key: 'underline', trigger: 'u' },
            { type: 'style', key: 'lineThrough', trigger: 'l' },
          ]
          for (const { type, key, trigger } of mapping) {
            if (event.key.toLowerCase() === trigger) {
              event.preventDefault();
              if (type === 'element') {
                const [match] = Editor.nodes(editor, {
                  match: (n) => (n as any).type === key,
                });
                Transforms.setNodes(
                  editor,
                  { type: match ? "paragraph" : key } as any,
                  {
                    match: (n) =>
                      Element.isElement(n) && Editor.isBlock(editor, n),
                  },
                );
              } else if (type === 'style') {
                const [match] = Editor.nodes(editor, {
                  match: (n) => (n as any)[key],
                });
                if (match) {
                  Editor.removeMark(editor, key);
                } else {
                  Editor.addMark(editor, key, true);
                }
              }
              return;
            }
          }
        }}
      />
    </Slate>
  );
}
