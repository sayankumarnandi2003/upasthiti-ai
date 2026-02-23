import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Plus, Search, User, Camera as CameraIcon, X } from 'lucide-react';
import Webcam from "react-webcam";

export default function Students() {
    const [students, setStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [newStudent, setNewStudent] = useState({
        student_id: '',
        first_name: '',
        last_name: '',
        email: '',
        course_name: ''
    });

    const webcamRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [registeringFace, setRegisteringFace] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('https://upasthiti-ai.onrender.com/students/');
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://upasthiti-ai.onrender.com/students/', newStudent);
            setShowModal(false);
            setNewStudent({ student_id: '', first_name: '', last_name: '', email: '', course_name: '' });
            fetchStudents();
        } catch (error) {
            alert("Error registering student: " + (error.response?.data?.detail || error.message));
        }
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
    }, [webcamRef]);

    const submitFaceRegistration = async () => {
        if (!capturedImage || !selectedStudent) return;
        setRegisteringFace(true);
        try {
            // Convert base64 to blob
            const res = await fetch(capturedImage);
            const blob = await res.blob();
            const formData = new FormData();
            formData.append('file', blob, 'face.jpg');

            await axios.post(`https://upasthiti-ai.onrender.com/recognition/register/${selectedStudent.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Face registered successfully!');
            setShowCameraModal(false);
            setCapturedImage(null);
            setSelectedStudent(null);
        } catch (error) {
            alert("Error registering face: " + (error.response?.data?.detail || error.message));
            setCapturedImage(null);
        } finally {
            setRegisteringFace(false);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Student Directory</h1>
                    <p className="text-slate-500 mt-1">Manage enrollments and biometrics</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 shadow-lg shadow-blue-500/30">
                    <Plus size={20} />
                    Add Student
                </button>
            </div>

            <div className="glass-panel overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/50">
                    <div className="relative w-64">
                        <input type="text" placeholder="Search students..." className="input-field pl-10" />
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    </div>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-500 text-sm uppercase tracking-wider">
                            <th className="p-4 font-medium">Student ID</th>
                            <th className="p-4 font-medium">Name</th>
                            <th className="p-4 font-medium">Course</th>
                            <th className="p-4 font-medium">Biometrics</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-medium text-slate-700">{student.student_id}</td>
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold text-sm">
                                        {student.first_name[0]}{student.last_name[0]}
                                    </div>
                                    <span className="text-slate-700 font-medium">{student.first_name} {student.last_name}</span>
                                </td>
                                <td className="p-4 text-slate-600">{student.course_name}</td>
                                <td className="p-4">
                                    <span className="px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">Pending Registration</span>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => { setSelectedStudent(student); setShowCameraModal(true); }}
                                        className="text-primary hover:text-blue-800 font-medium text-sm flex items-center justify-end gap-1 ml-auto"
                                    >
                                        <CameraIcon size={16} /> Register Face
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {students.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-3 py-8">
                                        <User size={48} className="text-slate-300" />
                                        <p>No students found. Add a student to get started.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Register Student</h2>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Student ID</label>
                                <input required type="text" className="input-field" value={newStudent.student_id} onChange={e => setNewStudent({ ...newStudent, student_id: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                                    <input required type="text" className="input-field" value={newStudent.first_name} onChange={e => setNewStudent({ ...newStudent, first_name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                                    <input required type="text" className="input-field" value={newStudent.last_name} onChange={e => setNewStudent({ ...newStudent, last_name: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input required type="email" className="input-field" value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                                <input required type="text" className="input-field" value={newStudent.course_name} onChange={e => setNewStudent({ ...newStudent, course_name: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Register Student</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCameraModal && selectedStudent && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-slate-800">Register Face: {selectedStudent.first_name}</h2>
                            <button onClick={() => { setShowCameraModal(false); setCapturedImage(null); }} className="text-slate-400 hover:text-slate-700">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="bg-slate-100 rounded-xl overflow-hidden mb-6 flex justify-center items-center relative" style={{ height: '360px' }}>
                            {!capturedImage ? (
                                <>
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        className="w-full h-full object-cover"
                                        videoConstraints={{ facingMode: "user" }}
                                    />
                                    <div className="absolute inset-0 border-4 border-primary/30 rounded-xl pointer-events-none">
                                        <div className="absolute inset-x-1/4 inset-y-1/4 border-2 border-dashed border-white rounded-full flex items-center justify-center">
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                            )}
                        </div>

                        <div className="flex justify-center gap-4">
                            {!capturedImage ? (
                                <button onClick={capture} className="btn-primary w-full max-w-xs flex justify-center items-center gap-2">
                                    <CameraIcon size={20} /> Capture Face
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => setCapturedImage(null)} className="btn-secondary flex-1">
                                        Retake
                                    </button>
                                    <button onClick={submitFaceRegistration} disabled={registeringFace} className="btn-primary flex-1 flex justify-center items-center">
                                        {registeringFace ? "Processing..." : "Save Biometrics"}
                                    </button>
                                </>
                            )}
                        </div>

                        <p className="text-center text-sm text-slate-500 mt-4 leading-relaxed">
                            Ensure the student is in a well-lit area and looking directly at the camera. Remove glasses or masks if possible.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
