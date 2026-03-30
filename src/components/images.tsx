import { convertFileSrc } from "@tauri-apps/api/core";
import { BaseDirectory, homeDir, join } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";

export function LocalImage({src}: {src: string}) {
    const [imagePath, setImagePath] = useState<string | null>();
    async function updatePaths() {
        console.info("aaa1")
        // const a = await exists('avatar.png', { baseDir: BaseDirectory.Home });
        // const a = await exists('.prince_files/ed69a039-37ed-4685-86a7-bb72a77897be.png', { baseDir: BaseDirectory.Home });
        const img = convertFileSrc(await join(await homeDir(), '.prince_files', 'ed69a039-37ed-4685-86a7-bb72a77897be.png'))
        console.log('---->>>'+img)
        setImagePath(img);
    }

    useEffect(() => {
      console.info("aaa22")
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
