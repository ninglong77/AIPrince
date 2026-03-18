

export const ShotElement = (props: any) => {
  return (
    <div className="border border-green-500 bg-green-50 p-2" {...props.attributes}>
      {props.children}
    </div>
  );
}

export const RoleElement = (props: any) => {
  return (
    <div className="border border-yellow-500 bg-yellow-50 p-2" {...props.attributes}>
      {props.children}
    </div>
  );
}

export const ActionElement = (props: any) => {
  return (
    <div className="border border-blue-500 bg-blue-50 p-2" {...props.attributes}>
      {props.children}
    </div>
  );
}

export const BackgroundElement = (props: any) => {
  return (
    <div className="border border-purple-500 bg-purple-50 p-2" {...props.attributes}>
      {props.children}
    </div>
  );
}

export const DialogElement = (props: any) => {
  return (
    <div className="border border-pink-500 bg-pink-50 p-2" {...props.attributes}>
      {props.children}
    </div>
  );
}
