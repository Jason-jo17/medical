import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useBounds } from "@react-three/drei";

export function SceneControls({ fitTrigger, isPanMode }) {
    const bounds = useBounds();
    const { camera, gl } = useThree();

    // Handle Fit to Screen
    useEffect(() => {
        if (fitTrigger > 0) {
            bounds.refresh().clip().fit();
        }
    }, [fitTrigger, bounds]);

    // Handle Pan Mode
    useEffect(() => {
        // 0 = Left Click (Rotate by default)
        // 2 = Right Click (Pan by default)

        // If Pan Mode is ON, we want Left Click to Pan.
        // OrbitControls handles this via mouseButtons prop in the main App file.
        // This component is just a placeholder if we needed direct camera manipulation.
    }, [isPanMode]);

    return null;
}
