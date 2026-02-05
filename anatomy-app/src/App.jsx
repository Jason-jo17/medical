import React, { useState, Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Bounds, useBounds } from "@react-three/drei";
import { XR, ARButton, Hands } from "@react-three/xr";
import { SkeletonModel } from "./SkeletonModel";
import { anatomyData } from "./anatomyData";

function CameraRig({ selectedBone }) {
    const bounds = useBounds();
    const { scene } = useThree();

    useEffect(() => {
        if (selectedBone) {
            const targetObj = scene.getObjectByName(selectedBone);
            if (targetObj) {
                bounds.refresh(targetObj).clip().fit();
            }
        } else {
            bounds.refresh().clip().fit();
        }
    }, [selectedBone, bounds, scene]);
    return null;
}

function App() {
    const [selectedBone, setSelectedBone] = useState(null);
    const [quizMode, setQuizMode] = useState(false);
    const [targetBone, setTargetBone] = useState(null);
    const [quizMessage, setQuizMessage] = useState("");
    const [modelScale, setModelScale] = useState(1);

    const startQuiz = () => {
        const keys = Object.keys(anatomyData).filter(k => !k.startsWith("_TEMPLATE_") && !k.startsWith("bone_"));
        // If no real bones mapped yet, fall back to bone_0 etc for testing
        const pool = keys.length > 0 ? keys : Object.keys(anatomyData).filter(k => !k.startsWith("_TEMPLATE_"));

        if (pool.length === 0) {
            alert("No bones available for quiz!");
            return;
        }

        const randomKey = pool[Math.floor(Math.random() * pool.length)];
        setTargetBone(randomKey);
        setQuizMode(true);
        setQuizMessage("");
        setSelectedBone(null);
    };

    const handleBoneSelect = (boneId) => {
        setSelectedBone(boneId);
        if (quizMode && targetBone) {
            if (boneId === targetBone) {
                setQuizMessage("🎉 Correct! Well done!");
            } else {
                setQuizMessage("❌ Incorrect. Try again!");
            }
        }
    };

    const nextQuestion = () => {
        startQuiz();
    };

    const exitQuiz = () => {
        setQuizMode(false);
        setTargetBone(null);
        setQuizMessage("");
        setSelectedBone(null);
    };

    const info = selectedBone
        ? (anatomyData[selectedBone] || {
            title: selectedBone, // Show the raw bone name if not found in data
            type: "Unknown Bone",
            articulation: "Unknown",
            description: `No data found for bone ID: "${selectedBone}". Please add this ID to anatomyData.js.`,
            clinicalSignificance: "Unknown",
            funFact: "Unknown"
        })
        : {
            title: "Human Skeleton",
            type: "Skeletal System",
            articulation: "N/A",
            description: "Select a bone to view details.",
            clinicalSignificance: "The human skeleton provides structure, protection, and movement.",
            funFact: "The adult human skeleton is made up of 206 bones."
        };

    return (
        <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
            <ARButton />
            <Canvas camera={{ position: [0, 1.5, 2], fov: 50 }}>
                <XR>
                    <Hands />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Suspense fallback={null}>
                        <Bounds fit clip observe margin={1.2}>
                            <SkeletonModel
                                selectedBone={selectedBone}
                                onSelectPart={handleBoneSelect}
                                scale={modelScale}
                            />
                            <CameraRig selectedBone={selectedBone} />
                        </Bounds>
                        <Environment preset="city" />
                        <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
                    </Suspense>
                    <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
                </XR>
            </Canvas>

            {/* Sidebar Overlay */}
            <div className="absolute top-0 right-0 w-96 h-full bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 flex flex-col shadow-2xl">

                {!quizMode ? (
                    <>
                        <div className="p-6 border-b border-slate-800">
                            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                                {info.title}
                            </h1>
                        </div>

                        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                            {/* Controls */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => setSelectedBone(null)}
                                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium text-slate-300 border border-slate-700 transition-colors"
                                >
                                    Reset View / Auto Fit
                                </button>

                                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                                        Model Scale (AR Resize)
                                    </label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="3"
                                        step="0.1"
                                        value={modelScale}
                                        onChange={(e) => setModelScale(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                    />
                                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                                        <span>Small</span>
                                        <span>{modelScale}x</span>
                                        <span>Large</span>
                                    </div>
                                </div>

                                <select
                                    value={selectedBone || ""}
                                    onChange={(e) => handleBoneSelect(e.target.value || null)}
                                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                >
                                    <option value="">Select a bone...</option>
                                    {Object.keys(anatomyData)
                                        .map((key) => (
                                            <option key={key} value={key}>
                                                {anatomyData[key].title}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Type</p>
                                    <p className="text-lg font-semibold text-white">{info.type || "Unknown"}</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Articulation</p>
                                    <p className="text-lg font-semibold text-white">{info.articulation || "N/A"}</p>
                                </div>
                            </div>

                            {/* Clinical Significance Card */}
                            <div className="bg-slate-800/30 p-5 rounded-xl border-l-4 border-cyan-500">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                                        Clinical Significance
                                    </h3>
                                </div>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    {info.clinicalSignificance || "Select a bone to view clinical details."}
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Description</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    {info.description}
                                </p>
                            </div>

                            {/* Fun Fact */}
                            {selectedBone && (
                                <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                                    <p className="text-yellow-500 text-sm font-medium">
                                        💡 <span className="font-bold">Did you know?</span> {info.funFact}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-slate-800 bg-[#0f172a]">
                            <button
                                onClick={startQuiz}
                                className="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 rounded-xl font-bold text-white shadow-lg shadow-cyan-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Start Quiz on {selectedBone ? info.title : "Skeleton"}
                            </button>
                        </div>
                    </>
                ) : (
                    // QUIZ MODE UI
                    <div className="flex flex-col h-full p-6">
                        <div className="border-b border-slate-800 pb-6 mb-6">
                            <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider mb-2">Quiz Mode</h2>
                            <h1 className="text-3xl font-black text-white">
                                Find the <span className="text-teal-400">{anatomyData[targetBone]?.title || targetBone}</span>
                            </h1>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                            {quizMessage ? (
                                <div className={`p-6 rounded-2xl border-2 ${quizMessage.includes("Correct") ? "bg-green-500/20 border-green-500 text-green-400" : "bg-red-500/20 border-red-500 text-red-400"}`}>
                                    <p className="text-2xl font-bold">{quizMessage}</p>
                                </div>
                            ) : (
                                <p className="text-slate-400 text-lg">
                                    Rotate the model and click on the correct bone!
                                </p>
                            )}
                        </div>

                        <div className="space-y-3 mt-auto">
                            {quizMessage.includes("Correct") && (
                                <button
                                    onClick={nextQuestion}
                                    className="w-full py-4 bg-teal-600 hover:bg-teal-500 rounded-xl font-bold text-white shadow-lg transition-all"
                                >
                                    Next Question
                                </button>
                            )}
                            <button
                                onClick={exitQuiz}
                                className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-slate-300 border border-slate-700 transition-all"
                            >
                                Exit Quiz
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
