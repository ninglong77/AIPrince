
 // Define a React component renderer for our code blocks.
export const CodeElement = (props: any) => {
  return (
    <pre
      className="text-slate-800 border-l-2 border-purple-600 pl-1"
      {...props.attributes}
    >
      <code>{props.children}</code>
    </pre>
  );
};

export const DefaultElement = (props: any) => {
  return (
    <p className="text-slate-900" {...props.attributes}>
      {props.children}
    </p>
  );
};

export const Title1Element = (props: any) => {
  return (
    <h1 className="text-2xl font-bold text-blue-700" {...props.attributes}>
      {props.children}
    </h1>
  );
};

export const Title2Element = (props: any) => {
  return (
    <h2 className="text-xl font-bold text-blue-600" {...props.attributes}>
      {props.children}
    </h2>
  );
};

export const Title3Element = (props: any) => {
  return (
    <h3 className="text-lg font-bold text-blue-500" {...props.attributes}>
      {props.children}
    </h3>
  );
};
