import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { Camera, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export default function LiveRecognition() {
    const webcamRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);
    const [matchResult, setMatchResult] = useState(null);
    const [scanInterval, setScanInterval] = useState(null);

    const captureAndVerify = useCallback(async () => {
        if (!webcamRef.current) return;

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        try {
            const res = await fetch(imageSrc);
            const blob = await res.blob();
            const formData = new FormData();
            formData.append('file', blob, 'frame.jpg');

            const response = await axios.post('http://localhost:8000/recognition/verify', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.status === 'success') {
                setMatchResult({
                    type: 'success',
                    student: response.data.student,
                    message: 'Attendance Marked Present'
                });
            } else {
                setMatchResult({
                    type: 'warning',
                    message: 'Face not recognized.'
                });
            }
        } catch (error) {
            console.log('Verification frame dropped or no face:', error.response?.data?.detail);
            setMatchResult({
                type: 'error',
                message: 'No face detected or seeking...'
            });
        }
    }, [webcamRef]);

    const toggleScanning = () => {
        if (isScanning) {
            clearInterval(scanInterval);
            setScanInterval(null);
            setIsScanning(false);
            setMatchResult(null);
        } else {
            setIsScanning(true);
            // Capture a frame every 2 seconds
            const interval = setInterval(() => {
                captureAndVerify();
            }, 2000);
            setScanInterval(interval);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (scanInterval) clearInterval(scanInterval);
        };
    }, [scanInterval]);


    return (
        <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Live Recognition Station</h1>
                    <p className="text-slate-500 mt-1">Autonomous attendance marking via camera feed</p>
                </div>
                <button
                    onClick={toggleScanning}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${isScanning ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30 text-white' : 'bg-green-500 hover:bg-green-600 shadow-green-500/30 text-white'}`}
                >
                    {isScanning ? <XCircle size={20} /> : <Camera size={20} />}
                    {isScanning ? 'Stop Scanning' : 'Start Camera Match'}
                </button>
            </div>

            <div className="flex-1 flex gap-8 min-h-0">
                <div className="flex-1 bg-black rounded-3xl overflow-hidden relative shadow-2xl flex items-center justify-center">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                        videoConstraints={{ facingMode: "user" }}
                    />

                    {/* Scanning Overlay UI */}
                    <div className="absolute inset-0 border-8 border-white/10 pointer-events-none rounded-3xl"></div>
                    {isScanning && (
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-8 left-8 flex items-center gap-2 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                LIVE FEED
                            </div>
                            {/* Scan box reticle */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/30 border-dashed rounded-3xl flex items-center justify-center">
                                <div className="w-full h-1 bg-green-400/50 mix-blend-screen absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-96 flex flex-col gap-6 shrink-0">
                    <div className="glass-panel p-6 flex-1 flex flex-col">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <RefreshCw size={18} className={`text-primary ${isScanning ? 'animate-spin' : ''}`} />
                            Status
                        </h2>

                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                            {!isScanning && !matchResult && (
                                <div className="text-slate-400">
                                    <Camera size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>System Idle. Start camera match to begin autonomous attendance.</p>
                                </div>
                            )}

                            {isScanning && !matchResult && (
                                <div className="text-slate-500 animate-pulse">
                                    <p className="font-medium text-lg text-primary">Scanning for faces...</p>
                                    <p className="text-sm mt-2">Please look directly at the camera.</p>
                                </div>
                            )}

                            {matchResult && matchResult.type === 'success' && (
                                <div className="animate-in zoom-in duration-300">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800">{matchResult.student.name}</h3>
                                    <p className="text-slate-500">{matchResult.student.id}</p>
                                    <span className="inline-block mt-4 px-4 py-1.5 bg-green-500 text-white text-sm font-bold tracking-wide rounded-full shadow-lg shadow-green-500/30">
                                        {matchResult.message}
                                    </span>
                                </div>
                            )}

                            {matchResult && matchResult.type === 'warning' && (
                                <div className="text-amber-500">
                                    <span className="inline-block px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-200">
                                        {matchResult.message}
                                    </span>
                                </div>
                            )}

                            {matchResult && matchResult.type === 'error' && (
                                <div className="text-slate-400 text-sm">
                                    {matchResult.message}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
