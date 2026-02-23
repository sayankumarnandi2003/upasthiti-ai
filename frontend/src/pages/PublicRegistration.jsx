import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Camera as CameraIcon, CheckCircle, UserPlus, ShieldCheck, Sparkles, X } from 'lucide-react';
import Webcam from "react-webcam";

export default function PublicRegistration() {
    const [step, setStep] = useState(1); // 1: Form, 2: Camera, 3: Success
    const [newStudent, setNewStudent] = useState({
        student_id: '',
        first_name: '',
        last_name: '',
        email: '',
        course_name: ''
    });
    const [createdStudent, setCreatedStudent] = useState(null);

    const webcamRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);

    // OCR Auto-Fill State
    const [showOcrModal, setShowOcrModal] = useState(false);
    const [isScanningOcr, setIsScanningOcr] = useState(false);
    const ocrWebcamRef = useRef(null);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://upasthiti-ai.onrender.com/students/', newStudent);
            setCreatedStudent(response.data);
            setStep(2);
        } catch (error) {
            alert("Registration error: " + (error.response?.data?.detail || error.message));
        }
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) setCapturedImage(imageSrc);
    }, [webcamRef]);

    const captureOcr = useCallback(async () => {
        const imageSrc = ocrWebcamRef.current?.getScreenshot();
        if (!imageSrc) return;

        setIsScanningOcr(true);
        try {
            const res = await fetch(imageSrc);
            const blob = await res.blob();
            const formData = new FormData();
            formData.append('file', blob, 'form.jpg');

            const response = await axios.post('https://upasthiti-ai.onrender.com/ocr/scan-form', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.status === 'success') {
                const data = response.data.data;
                setNewStudent(prev => ({
                    ...prev,
                    student_id: data.student_id || prev.student_id,
                    first_name: data.first_name || prev.first_name,
                    last_name: data.last_name || prev.last_name,
                    email: data.email || prev.email,
                    course_name: data.course_name || prev.course_name
                }));
                setShowOcrModal(false);
            }
        } catch (error) {
            alert("Failed to read the document. Please try again or fill manually.");
            console.error(error);
        } finally {
            setIsScanningOcr(false);
        }
    }, [ocrWebcamRef]);

    const submitFaceRegistration = async () => {
        if (!capturedImage || !createdStudent) return;
        setIsRegistering(true);
        try {
            const res = await fetch(capturedImage);
            const blob = await res.blob();
            const formData = new FormData();
            formData.append('file', blob, 'face.jpg');

            await axios.post(`https://upasthiti-ai.onrender.com/recognition/register/${createdStudent.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setStep(3);
        } catch (error) {
            alert("Error registering face: " + (error.response?.data?.detail || error.message));
            setCapturedImage(null);
        } finally {
            setIsRegistering(false);
        }
    };

    const resetFlow = () => {
        setStep(1);
        setNewStudent({ student_id: '', first_name: '', last_name: '', email: '', course_name: '' });
        setCreatedStudent(null);
        setCapturedImage(null);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto h-full flex flex-col relative">
            <div className="mb-8 text-center shrink-0">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Student Enrollment</h1>
                <p className="text-slate-500 mt-2 text-lg">Register your details and biometric profile for automated attendance</p>
            </div>

            <div className="flex-1 flex items-center justify-center min-h-0">
                {step === 1 && (
                    <div className="glass-panel w-full max-w-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 text-primary rounded-xl flex items-center justify-center">
                                    <UserPlus size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Step 1: Basic Details</h2>
                                    <p className="text-slate-500 text-sm">Create your academic profile</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowOcrModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg font-bold transition-colors text-sm"
                            >
                                <Sparkles size={16} className="text-purple-500" /> Auto-Fill with AI
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Student ID Tag</label>
                                    <input required type="text" placeholder="e.g. S1024" className="input-field bg-white/50" value={newStudent.student_id} onChange={e => setNewStudent({ ...newStudent, student_id: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Course Name</label>
                                    <input required type="text" placeholder="e.g. Computer Science" className="input-field bg-white/50" value={newStudent.course_name} onChange={e => setNewStudent({ ...newStudent, course_name: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                                    <input required type="text" placeholder="Jane" className="input-field bg-white/50" value={newStudent.first_name} onChange={e => setNewStudent({ ...newStudent, first_name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Last Name</label>
                                    <input required type="text" placeholder="Doe" className="input-field bg-white/50" value={newStudent.last_name} onChange={e => setNewStudent({ ...newStudent, last_name: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                                <input required type="email" placeholder="jane.doe@university.edu" className="input-field bg-white/50" value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} />
                            </div>

                            <div className="pt-4 mt-8 border-t border-slate-100 flex justify-end">
                                <button type="submit" className="btn-primary text-lg px-8 py-3 w-full md:w-auto flex justify-center items-center gap-2">
                                    Proceed to Biometrics <CameraIcon size={20} />
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <div className="glass-panel w-full max-w-2xl p-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Step 2: Biometric Scan</h2>
                                <p className="text-slate-500 text-sm">Register your face for {createdStudent?.first_name}</p>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-2xl overflow-hidden mb-6 flex justify-center items-center relative aspect-[4/3] w-full max-w-lg mx-auto shadow-inner">
                            {!capturedImage ? (
                                <>
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        className="w-full h-full object-cover"
                                        videoConstraints={{ facingMode: "user" }}
                                    />
                                    <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-2xl pointer-events-none"></div>
                                </>
                            ) : (
                                <img src={capturedImage} alt="Captured face preview" className="w-full h-full object-cover" />
                            )}
                        </div>

                        <div className="flex justify-center gap-4 max-w-lg mx-auto">
                            {!capturedImage ? (
                                <button onClick={capture} className="btn-primary bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 w-full flex justify-center items-center gap-2 text-lg py-3">
                                    <CameraIcon size={24} /> Capture Face
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => setCapturedImage(null)} className="btn-secondary flex-1 py-3 text-lg font-bold">
                                        Retake
                                    </button>
                                    <button onClick={submitFaceRegistration} disabled={isRegistering} className="btn-primary bg-indigo-600 flex-[2] flex justify-center items-center text-lg py-3 transition-all">
                                        {isRegistering ? "Processing..." : "Save Biometrics"}
                                    </button>
                                </>
                            )}
                        </div>
                        <p className="text-center text-sm text-slate-400 mt-6 font-medium">
                            Ensure you are in a well-lit area and looking directly at the camera.
                        </p>
                    </div>
                )}

                {step === 3 && (
                    <div className="glass-panel w-full max-w-md p-10 text-center animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner shadow-green-500/20">
                            <CheckCircle size={48} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Enrollment Complete!</h2>
                        <p className="text-slate-500 text-lg mb-8">
                            {createdStudent?.first_name}'s face biometric profile has been securely registered.
                        </p>
                        <button onClick={resetFlow} className="btn-primary w-full py-4 text-lg bg-slate-800 hover:bg-slate-900 focus:ring-slate-800 shadow-xl shadow-slate-900/20 text-white font-bold rounded-xl">
                            Register Another Student
                        </button>
                    </div>
                )}
            </div>

            {/* OCR Modal Overlay */}
            {showOcrModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-purple-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-200 rounded-lg text-purple-700">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">AI Auto-Fill</h3>
                                    <p className="text-xs text-purple-600 font-medium">Hold up a document with your details</p>
                                </div>
                            </div>
                            <button onClick={() => setShowOcrModal(false)} className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 bg-black relative flex items-center justify-center">
                            <Webcam
                                audio={false}
                                ref={ocrWebcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full h-full object-cover max-h-[50vh]"
                                videoConstraints={{ facingMode: "environment" }}
                            />
                            {/* Scanning overlay effect */}
                            {isScanningOcr && (
                                <div className="absolute inset-0 bg-purple-900/40 flex items-center justify-center">
                                    <div className="text-white text-center">
                                        <Sparkles className="animate-spin text-purple-300 mx-auto mb-4" size={48} />
                                        <p className="text-lg font-bold tracking-wider">Analyzing Text with AI...</p>
                                    </div>
                                    <div className="absolute top-0 w-full h-2 bg-purple-400/80 blur-sm animate-[scan_2s_ease-in-out_infinite]"></div>
                                </div>
                            )}
                            <div className="absolute inset-x-8 inset-y-8 border-2 border-white/50 border-dashed rounded-xl pointer-events-none"></div>
                        </div>

                        <div className="p-6 bg-slate-50 text-center">
                            <button
                                onClick={captureOcr}
                                disabled={isScanningOcr}
                                className="btn-primary w-full max-w-sm mx-auto bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 text-lg py-4 shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                            >
                                {isScanningOcr ? 'Extracting details...' : <><CameraIcon size={20} /> Capture Document</>}
                            </button>
                            <p className="text-sm text-slate-500 mt-4">
                                The AI will look for Student ID, Name, Email, and Course fields.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
