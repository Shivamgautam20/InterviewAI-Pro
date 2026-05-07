// frontend/src/Login.jsx

import { useState } from "react";

import { motion } from "framer-motion";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

import { auth } from "./firebase";

import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [isSignup, setIsSignup] = useState(false);

  const navigate = useNavigate();

  // Login / Signup
  const handleAuth = async () => {

    try {

      if (isSignup) {

        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        alert("Signup successful 😎");

        navigate("/app");

      } else {

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        alert("Login successful 🚀");

        navigate("/app");
      }

    } catch (error) {

      alert(error.message);
    }
  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative text-white">

      {/* Glow */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-blue-600 rounded-full blur-[180px] opacity-30"></div>

      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-purple-600 rounded-full blur-[180px] opacity-30"></div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white/10 border border-white/20 backdrop-blur-2xl rounded-[40px] p-10 w-full max-w-md shadow-[0_0_60px_rgba(59,130,246,0.3)]"
      >

        <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">

          InterviewAI

        </h1>

        <p className="text-center text-slate-300 mt-4">

          {isSignup
            ? "Create your AI account"
            : "Login to continue"}

        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-10 w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 outline-none"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-5 w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 outline-none"
        />

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAuth}
          className="mt-8 w-full bg-gradient-to-r from-blue-500 to-purple-600 py-4 rounded-2xl text-xl font-semibold"
        >

          {isSignup ? "Create Account" : "Login"}

        </motion.button>

        {/* Toggle */}
        <p className="mt-6 text-center text-slate-300">

          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            onClick={() => setIsSignup(!isSignup)}
            className="ml-2 text-blue-400"
          >

            {isSignup ? "Login" : "Signup"}

          </button>

        </p>

      </motion.div>

    </div>
  );
}

export default Login;