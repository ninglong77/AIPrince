import { convertFileSrc } from "@tauri-apps/api/core";
import { BaseDirectory, homeDir, join } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";

export function LocalImage({src}: {src: string}) {
    const [imagePath, setImagePath] = useState<string | null>();
    async function updatePaths() {
        const img = convertFileSrc(src)
        setImagePath(img);
    }

    useEffect(() => {      
      updatePaths();
    }, [src]);

    return <>
    <button onClick={() => {
      updatePaths().then(() => {});
    }}>Test</button>
    <img src={imagePath || ''} alt="Some Image" />;
    <div>{imagePath}</div>
    </> 
    
}
