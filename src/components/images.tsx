import { convertFileSrc } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export function LocalImage({src, className}: {src: string, className?: string}) {
    const [imagePath, setImagePath] = useState<string | null>();
    async function updatePaths() {
        const img = convertFileSrc(src)
        setImagePath(img);
    }

    useEffect(() => {      
      updatePaths();
    }, [src]);

    return  <img className={className} src={imagePath || ''} alt="Some Image" />
}

// 点击放大
export function WrapperClickedEnlarge({children, enlarge}: {children: React.ReactNode, enlarge?: React.ReactNode}) {
  const [show, setShow] = useState(false);
  return <>
      {show && (
        <div
          className="fixed overflow-scroll top-0 left-0 flex flex-row justify-center items-center w-screen h-screen z-100 bg-black/80"
          onClick={() => setShow(false)}
        >
          {enlarge || children}
        </div>
      )}
      <div onClick={() => setShow(true)}>
        {children}
      </div>
      </>
}
