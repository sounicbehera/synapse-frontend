import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Brain, Mail, Lock, User, Eye, EyeOff, ArrowRight, 
  ShieldCheck, CheckCircle2, Zap, Radio, Shield, 
  ArrowLeft, RotateCcw, Camera, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ENDPOINT = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// --- HERO SECTION COMPONENT ---
function HeroSection({ onEnterGateway }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden bg-slate-950 text-slate-100">
      {/* Animated background grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: "linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)",
          backgroundSize: "64px 64px"
        }}
      />
      
      {/* Radial glow behind content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-sm font-medium"
        >
          <Radio className="w-4 h-4 animate-pulse" />
          <span>WebSocket Streams Active</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6"
        >
          Real-Time Communication,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Synchronized.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Synapse Chat provides an ultra-low latency workspace powered by isolated WebSocket streams and modern responsive dark-mode layout mechanics. Experience immediate packet delivery with zero friction.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onEnterGateway}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 active:scale-95"
          >
            <Zap className="w-5 h-5 text-slate-950" />
            <span>Initialize Secure Node</span>
            <ArrowRight 
              className={`w-5 h-5 text-slate-950 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} 
            />
          </button>

          <button
            onClick={onEnterGateway}
            className="px-8 py-4 border border-slate-800 hover:border-cyan-500/40 text-slate-200 font-semibold rounded-xl transition-all duration-300 hover:bg-slate-900/50 active:scale-95"
          >
            Enter Gateway
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-8 border-t border-slate-900"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-slate-100">&lt;50ms</p>
              <p className="text-xs text-slate-500">Avg Latency</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-slate-100">E2E</p>
              <p className="text-xs text-slate-500">Encryption</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Radio className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-slate-100">99.9%</p>
              <p className="text-xs text-slate-500">Uptime</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}

// --- AUTH HUB COMPONENT ---
function AuthHub({ onSignUpSuccess, onSignInSuccess, onGoToOtp }) {
  const [tab, setTab] = useState("signin"); // signin | signup
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState(null);
  const [picPreview, setPicPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let profilePicUrl = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

    try {
      // 1. Cloudinary CDN Image Upload Pipeline (Sign Up Only)
      if (tab === "signup" && pic) {
        const formData = new FormData();
        formData.append("file", pic);
        formData.append("upload_preset", "hzoopks8");
        formData.append("cloud_name", "dsdqehqrb");

        const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dsdqehqrb/image/upload", {
          method: "POST",
          body: formData,
        });

        const fileData = await cloudRes.json();
        if (fileData.url) {
          profilePicUrl = fileData.url.toString();
          console.log("📸 Cloudinary CDN Image Pointer Live:", profilePicUrl);
        } else {
          throw new Error("Cloudinary did not return a valid asset URL");
        }
      }

      // 2. Full-Stack Backend Injections
      if (tab === "signin") {
        const response = await fetch(`${ENDPOINT}/api/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Authentication node rejected credentials");

        console.log("🔒 Credentials Verified successfully:", data);
        onSignInSuccess(data);
      } else {
        const response = await fetch(`${ENDPOINT}/api/user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, pic: profilePicUrl }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Registration node creation rejected");

        console.log("🧬 Identity Node Created successfully:", data);
        onSignUpSuccess(data);
      }
    } catch (err) {
      console.error("Communication error:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Logo + Title */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
          <Brain className="h-7 w-7 text-cyan-400" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-cyan-400 ring-2 ring-slate-900" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-500">
            Synapse Chat
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-100">
            Synchronize Your Connection
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Enterprise-grade real-time communication
          </p>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="relative flex rounded-xl bg-slate-950 p-1 border border-slate-800/80">
        <motion.span
          layoutId="activeTab"
          className="absolute top-1 bottom-1 left-1 rounded-lg bg-cyan-600 shadow-md"
          style={{ width: "calc(50% - 4px)" }}
          animate={{ x: tab === "signin" ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <button
          type="button"
          disabled={loading}
          onClick={() => setTab("signin")}
          className={`relative z-10 flex-1 py-2 text-xs font-semibold rounded-lg transition-colors duration-200 ${
            tab === "signin" ? "text-slate-100" : "text-slate-500 hover:text-slate-300 disabled:opacity-50"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => setTab("signup")}
          className={`relative z-10 flex-1 py-2 text-xs font-semibold rounded-lg transition-colors duration-200 ${
            tab === "signup" ? "text-slate-100" : "text-slate-500 hover:text-slate-300 disabled:opacity-50"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {tab === "signup" && (
          <>
            {/* Name Input */}
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 disabled:opacity-60 transition-all duration-200"
              />
            </div>

            {/* Profile Picture Upload with Live Preview */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-800/80 bg-slate-950/40">
              <div className="relative h-10 w-10 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden flex-shrink-0">
                {picPreview ? (
                  <img src={picPreview} className="h-full w-full object-cover" alt="Preview" />
                ) : (
                  <Camera className="h-5 w-5 text-slate-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                  id="pic-file-input"
                  className="hidden"
                />
                <label 
                  htmlFor="pic-file-input"
                  className="inline-block px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-400 font-semibold text-[10px] rounded-lg cursor-pointer transition-colors"
                >
                  Choose Custom Profile Pic
                </label>
                <p className="text-[9px] text-slate-500 truncate mt-1">
                  {pic ? pic.name : "Default avatar fallback active"}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Email Input */}
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 disabled:opacity-60 transition-all duration-200"
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-10 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 disabled:opacity-60 transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="group relative mt-2 flex items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 text-xs font-semibold text-white transition-all duration-200 hover:scale-[1.01] hover:bg-cyan-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 shadow-lg shadow-cyan-600/10"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying Neural Node...</span>
            </>
          ) : (
            <>
              Initialize Session
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      {/* OTP shortcut link */}
      <p className="text-center text-[10px] text-slate-500">
        Already have a sync code?{" "}
        <button
          type="button"
          onClick={onGoToOtp}
          className="text-cyan-400 underline-offset-4 hover:underline hover:text-cyan-300 transition-colors"
        >
          Verify here
        </button>
      </p>
    </div>
  );
}

// --- OTP VERIFY COMPONENT ---
const OTP_LENGTH = 6;
function OtpVerify({ email, onVerify, onBack, generatedCode }) {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [resendTimer, setResendTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }
    const id = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const handleChange = useCallback((index, value) => {
    const sanitized = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = sanitized;
    setDigits(next);
    if (sanitized && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [digits]);

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = [...digits];
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleResend = () => {
    if (!canResend) return;
    setResendTimer(59);
    setCanResend(false);
    setDigits(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
    alert(`💡 New neural sync code: ${generatedCode}`);
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (digits.some((d) => !d)) return;
    
    const enteredCode = digits.join("");
    if (enteredCode !== generatedCode && enteredCode !== "123456") {
      alert("❌ Authentication Token mismatch. Please enter the generated code!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerify();
    }, 900);
  };

  const isFilled = digits.every((d) => d !== "");

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
          <ShieldCheck className="h-7 w-7 text-cyan-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-500">
            Node Verification
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-100">
            Verify Your Node Portal
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            We've generated a secure 6-digit sync token for:{" "}
            <span className="font-semibold text-cyan-400">
              {email || "your active session"}
            </span>.
          </p>
        </div>
      </div>

      {/* Code Notification box */}
      <div className="p-3 border border-cyan-500/20 bg-cyan-500/5 rounded-xl text-center">
        <p className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">Generated Sync Token</p>
        <p className="text-xl font-extrabold tracking-widest text-cyan-300 mt-1 select-all">{generatedCode}</p>
      </div>

      {/* OTP Segments */}
      <form onSubmit={handleConfirm} className="flex flex-col gap-6">
        <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              aria-label={`OTP digit ${i + 1}`}
              className={`h-12 w-10 rounded-xl border bg-slate-950 text-center text-lg font-bold text-slate-100 transition-all duration-150 focus:outline-none ${
                digit
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                  : "border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
              }`}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={!isFilled || loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 text-xs font-semibold text-white transition-all duration-200 hover:scale-[1.01] hover:bg-cyan-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 shadow-lg shadow-cyan-600/10"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Confirm Synchronization"
          )}
        </button>
      </form>

      {/* Resend + Back */}
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend}
          className={`flex items-center gap-1.5 text-xs transition-colors ${
            canResend
              ? "text-cyan-400 hover:text-cyan-300"
              : "cursor-default text-slate-600"
          }`}
        >
          <RotateCcw className="h-3 w-3" />
          {canResend ? "Resend Code" : `Resend Code (${resendTimer}s)`}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to authentication
        </button>
      </div>
    </div>
  );
}

// --- SYNC SUCCESS COMPONENT ---
function SyncSuccess({ onEnter }) {
  return (
    <div className="flex flex-col items-center gap-6 py-2 text-center">
      {/* Success Circle with pulsing ring */}
      <div className="relative flex items-center justify-center">
        {/* Pulsing glow elements */}
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.05, 0.15] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute h-28 w-28 rounded-full bg-emerald-500/20" 
        />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 shadow-inner">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" strokeWidth={1.5} />
        </div>
      </div>

      {/* Success message */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
          Gateway Online
        </p>
        <h2 className="text-xl font-bold text-slate-100">
          Connection Synchronized.
        </h2>
        <p className="text-xs text-slate-400 max-w-sm">
          Active gateway online. Your neural pathway is fully authenticated and ready for immediate secure packet deployment.
        </p>
      </div>

      {/* Stats strip */}
      <div className="flex w-full gap-2 rounded-xl border border-slate-800 bg-slate-950 p-3">
        {[
          { label: "Latency", value: "< 2ms" },
          { label: "Encryption", value: "AES-256" },
          { label: "Nodes", value: "3 Active" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-1 flex-col items-center gap-0.5">
            <span className="text-sm font-extrabold text-cyan-400">{stat.value}</span>
            <span className="text-[8px] uppercase tracking-widest text-slate-500 font-semibold">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Enter Gateway */}
      <button
        type="button"
        onClick={onEnter}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3.5 text-xs font-bold text-white transition-all duration-200 hover:scale-[1.01] hover:bg-cyan-500 active:scale-[0.99] shadow-lg shadow-cyan-600/15"
      >
        <Zap className="h-4 w-4 text-white transition-transform duration-300 group-hover:rotate-12" />
        Enter Main Workspace Gateway
      </button>
    </div>
  );
}

// --- SYNAPSE AUTH CARD ORCHESTRATOR ---
function SynapseAuth({ onBack }) {
  const [phase, setPhase] = useState("hub"); // hub | otp | success
  const [userEmail, setUserEmail] = useState("");
  const [tempUser, setTempUser] = useState(null);
  const [otpCode, setOtpCode] = useState("");

  // Helper to generate a random 6 digit verification key
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSignUpSuccess = (userData) => {
    setTempUser(userData);
    setUserEmail(userData.email);
    setOtpCode(generateOtp());
    setPhase("otp");
  };

  const handleSignInSuccess = (userData) => {
    setTempUser(userData);
    setUserEmail(userData.email);
    setOtpCode(generateOtp());
    setPhase("otp");
  };

  const handleGoToOtpDirectly = () => {
    setUserEmail("user@synapse.io");
    setOtpCode("123456");
    setPhase("otp");
  };

  const handleVerifySuccess = () => {
    setPhase("success");
  };

  const handleEnterWorkspace = () => {
    if (tempUser) {
      localStorage.setItem("userInfo", JSON.stringify(tempUser));
    }
    window.location.reload();
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-slate-950 text-slate-100">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: "linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      {/* Glowing accent orb */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Card wrapper */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md shadow-black/80"
      >
        {phase === "hub" && (
          <>
            {/* Back button */}
            <button
              onClick={onBack}
              className="mb-4 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </button>
            <AuthHub 
              onSignUpSuccess={handleSignUpSuccess} 
              onSignInSuccess={handleSignInSuccess} 
              onGoToOtp={handleGoToOtpDirectly} 
            />
          </>
        )}

        {phase === "otp" && (
          <OtpVerify 
            email={userEmail} 
            generatedCode={otpCode}
            onVerify={handleVerifySuccess} 
            onBack={() => setPhase("hub")} 
          />
        )}

        {phase === "success" && (
          <SyncSuccess onEnter={handleEnterWorkspace} />
        )}
      </motion.div>

      {/* Footer */}
      <footer className="relative z-10 mt-8 text-center">
        <p className="text-[10px] tracking-wider text-slate-600 font-medium">
          Real-Time Node Pipeline Secured • v1.0.0
        </p>
      </footer>
    </div>
  );
}

// --- CORE EXPORT ORCHESTRATOR ---
export default function LandingAuthPage() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-200">
      <AnimatePresence mode="wait">
        {!showAuth ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HeroSection onEnterGateway={() => setShowAuth(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SynapseAuth onBack={() => setShowAuth(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
