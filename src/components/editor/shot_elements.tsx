import { useEffect, useState } from "react";
// import { ActionIcon, BackgroundIcon, DialogIcon, RoleIcon, ShotIcon } from "../icons";

/**
 * 分镜头元素
 * @param props 
 * @returns 
 */
export const ShotElement = (props: any) => {
  const node = props.element as any;
  const [content, setContent] = useState("");
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
      {/* <div style={{left: -25, zIndex: 50, top: '5%'}} className="absolute bg-white border-l border-slate-300 rounded-l-2xl p-1">
        <ShotIcon />
      </div> */}
      {/* <div>Shot {content}</div> */}
      <div className="p-2">
        {props.children}
      </div>
    </div>
  );
}


/**
 * 角色元素
 * @param props 
 * @returns 
 */
export const RoleElement = (props: any) => {
  return (
    <span className="text-yellow-500 px-1 font-bold" {...props.attributes}>
      {/* <span style={{height: 16, width: 16}} className="inline-block"><RoleIcon /></span> */}
      {props.children}
    </span>
  );
}


/**
 * 动作元素
 * @param props 
 * @returns 
 */
export const ActionElement = (props: any) => {
  return (
    <span className="text-green-500 px-1" {...props.attributes}>
      {/* <span style={{height: 16, width: 16}} className="inline-block"><ActionIcon /></span> */}
      {props.children}
    </span>
  );
}


/**
 * 背景元素
 * @param props 
 * @returns 
 */
export const BackgroundElement = (props: any) => {
  return (
    <span className="text-blue-500 px-1" {...props.attributes}>
      {/* <span style={{height: 16, width: 16}} className="inline-block"><BackgroundIcon /></span> */}
      {props.children}
    </span>
  );
}


/**
 * 对话元素
 * @param props 
 * @returns 
 */
export const DialogElement = (props: any) => {
  return (
    <span className="text-pink-500 px-1" {...props.attributes}>
      {/* <span style={{height: 16, width: 16}} className="inline-block"><DialogIcon /></span> */}
      {props.children}
    </span>
  );
}
