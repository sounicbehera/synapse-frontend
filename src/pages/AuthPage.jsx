import { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, Image, Loader2 } from 'lucide-react';

const ENDPOINT = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    // Core Auth Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pic, setPic] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Default anonymous avatar if no custom image is supplied during registration
        let profilePicUrl = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

        // ==========================================
        // PHASE 1: CLOUDINARY BINARY UPLOAD PIPELINE
        // ==========================================
        if (!isLogin && pic) {
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "hzoopks8"); // <-- Paste your preset here
            data.append("cloud_name", "dsdqehqrb");   // <-- Paste your Cloud Name here

            try {
                const res = await fetch("https://api.cloudinary.com/v1_1/dsdqehqrb/image/upload", {
                    method: "POST",
                    body: data,
                });

                const fileData = await res.json();
                if (fileData.url) {
                    profilePicUrl = fileData.url.toString();
                    console.log("📸 Cloudinary CDN Image Pointer Live:", profilePicUrl);
                } else {
                    throw new Error("Cloudinary did not return a valid asset URL");
                }
            } catch (err) {
                console.error("Cloudinary Upload Fault:", err);
                alert("Image upload failed. Checking configurations...");
                setLoading(false);
                return;
            }
        }

        // ==========================================
        // PHASE 2: FULL-STACK BACKEND INJECTION
        // ==========================================
        try {
            if (isLogin) {
                // --- LOGIN ENDPOINT CHANNEL ---
                const response = await fetch(`${ENDPOINT}/api/user/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (!response.ok) throw new Error(data.message || "Authentication node rejected credentials");

                console.log("🔒 Session Initialized. User Session Data:", data);
                localStorage.setItem("userInfo", JSON.stringify(data));
                alert("Login Successful!");
                window.location.reload();
            } else {
                // --- REGISTRATION ENDPOINT CHANNEL ---
                const response = await fetch(`${ENDPOINT}/api/user`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password, pic: profilePicUrl }),
                });

                const data = await response.json();

                if (!response.ok) throw new Error(data.message || "Registration node creation rejected");

                console.log("🧬 Identity Node Linked. Registration Response Data:", data);
                localStorage.setItem("userInfo", JSON.stringify(data));
                alert("Registration Successful!");

                // Smoothly return user to login interface upon creation
                setIsLogin(true);
            }
        } catch (error) {
            console.error("Full-Stack Communication Error:", error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="max-w-md w-full bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8 transition-all duration-300">

                {/* Branding Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent tracking-tight">
                        Synapse
                    </h1>
                    <p className="text-slate-400 text-sm mt-2">
                        {isLogin ? "Welcome back! Connect to your neural network." : "Create your cognitive chat link node."}
                    </p>
                </div>

                {/* Tab Control Switcher */}
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80 mb-6">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${isLogin ? 'bg-slate-800 text-cyan-400 shadow-md' : 'text-slate-400 hover:text-slate-200 disabled:opacity-50'
                            }`}
                    >
                        <LogIn size={16} /> Login
                    </button>
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${!isLogin ? 'bg-slate-800 text-cyan-400 shadow-md' : 'text-slate-400 hover:text-slate-200 disabled:opacity-50'
                            }`}
                    >
                        <UserPlus size={16} /> Register
                    </button>
                </div>

                {/* Core Input Form Submission Frame */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Dynamic Full Name Input (Signup Only) */}
                    {!isLogin && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-400 block tracking-wide uppercase">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-500/50 transition-colors"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Email Address Input (Shared) */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 block tracking-wide uppercase">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-500/50 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input (Shared) */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 block tracking-wide uppercase">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-500/50 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Dynamic Custom Profile Picture Selector (Signup Only) */}
                    {!isLogin && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-400 block tracking-wide uppercase">Profile Picture (Optional)</label>
                            <div className="relative">
                                <Image className="absolute left-3 top-3.5 text-slate-500" size={18} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setPic(e.target.files[0])}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-400 hover:file:bg-slate-700 outline-none cursor-pointer"
                                />
                            </div>
                        </div>
                    )}

                    {/* Interactive Core Form Submit Trigger */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl py-3.5 shadow-lg shadow-cyan-500/10 active:scale-[0.98] transition-all duration-150 mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Processing Node...
                            </>
                        ) : (
                            isLogin ? "Authenticate Interface" : "Initialize Account Node"
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default AuthPage;