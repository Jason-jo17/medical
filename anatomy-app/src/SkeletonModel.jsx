import React, { useState, useMemo } from "react";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";

function BonePart({ url, id, onSelect, selectedBone, hoveredPart, setHoveredPart }) {
    const { scene } = useGLTF(url);

    // Calculate center for hotspot
    const center = useMemo(() => {
        const box = new THREE.Box3().setFromObject(scene);
        return box.getCenter(new THREE.Vector3());
    }, [scene]);

    // Determine if this part is selected or hovered
    const isSelected = selectedBone === id;
    const isHovered = hoveredPart === id;

    return (
        <group name={id}>
            <primitive
                object={scene}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHoveredPart(id); // Set hover to the ID (e.g., "bone_0")
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    setHoveredPart(null);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    console.log("Clicked part:", id);
                    onSelect(id); // Select the ID
                }}
                onContextMenu={(e) => {
                    e.nativeEvent.preventDefault();
                    e.stopPropagation();
                    console.log("Right-clicked part:", id);
                    onSelect(id);
                }}
                // Update colors based on state
                onUpdate={(self) => {
                    self.traverse((child) => {
                        if (child.isMesh) {
                            if (isSelected) {
                                child.material.color.set("#f43f5e"); // Rose
                            } else if (isHovered) {
                                child.material.color.set("#5eead4"); // Teal
                            } else {
                                child.material.color.set("white");
                            }
                        }
                    });
                }}
            />
            {/* Hotspot */}
            <mesh
                position={center}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(id);
                }}
                onContextMenu={(e) => {
                    e.nativeEvent.preventDefault();
                    e.stopPropagation();
                    onSelect(id);
                }}
            >
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial
                    color={isSelected ? "#f43f5e" : (isHovered ? "#5eead4" : "yellow")}
                    transparent
                    opacity={0.6}
                    depthTest={false}
                />
                <Html distanceFactor={10}>
                    <div className="bg-black/50 text-white text-xs p-1 rounded pointer-events-none">
                        {id}
                    </div>
                </Html>
            </mesh>
        </group>
    );
}

export function SkeletonModel({ onSelectPart, selectedBone, scale = 1 }) {
    const [hoveredPart, setHoveredPart] = useState(null);
    const boneFiles = [
        { url: "/separated_bones/bone_0.glb", id: "bone_0" },
        { url: "/separated_bones/bone_1.glb", id: "bone_1" },
        { url: "/separated_bones/bone_2.glb", id: "bone_2" },
        { url: "/separated_bones/bone_3.glb", id: "bone_3" }
    ];

    return (
        <group scale={scale}>
            {boneFiles.map((bone, index) => (
                <BonePart
                    key={index}
                    url={bone.url}
                    id={bone.id}
                    onSelect={onSelectPart}
                    selectedBone={selectedBone}
                    hoveredPart={hoveredPart}
                    setHoveredPart={setHoveredPart}
                />
            ))}
        </group>
    );
}
