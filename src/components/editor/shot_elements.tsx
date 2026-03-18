import { useEffect, useState } from "react";
import { useNotification } from "../notification";
import { RoleIcon, ShotIcon } from "../icons";


export const ShotElement = (props: any) => {
  const node = props.element as any;
  const [content, setContent] = useState("");
  const notification = useNotification();
  useEffect(() => {
    setContent(JSON.stringify(node))
  }, [props])
  useEffect(() => {
    if(content){
      // notification.info("Shot content updated: " + content);
    }
  }, [content])
  return (
    <div className="border border-slate-100 bg-white relative shadow-sm" {...props.attributes}>
      <div style={{left: -25, zIndex: 50, top: '5%'}} className="absolute bg-white border-l border-slate-300 rounded-l-2xl p-1">
        <ShotIcon />
      </div>
      {/* <div>Shot {content}</div> */}
      <div className="p-2">
        {props.children}
      </div>
    </div>
  );
}

export const RoleElement = (props: any) => {
  return (
    <span className="text-yellow-500 px-1 font-bold" {...props.attributes}>
      <span style={{height: 16, width: 16}} className="inline-block"><RoleIcon /></span>
      {props.children}
    </span>
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
