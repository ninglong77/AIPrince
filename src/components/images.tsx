import { convertFileSrc } from "@tauri-apps/api/core";
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

    return  <img src={imagePath || ''} alt="Some Image" />
}
