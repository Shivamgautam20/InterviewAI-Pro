import { useState } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Webcam from "react-webcam";
import jsPDF from "jspdf";

import {
  collection,
  addDoc
} from "firebase/firestore";

import { db } from "./firebase";

function App() {

  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState("");
  const [loading, setLoading] = useState(false);

  // Chat states
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  // AI Score Dashboard
  const [scores, setScores] = useState(null);

  // AI Voice Speak
  const speakText = (text) => {

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  };

  // Resume Upload
  const handleUpload = async () => {

    if (!file) {
      alert("Please upload a resume PDF");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("file", file);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/upload-resume/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setQuestions(data.interview_questions);

      const welcomeMessage =
        "Hello. I am your AI interviewer. Tell me about yourself.";

      setMessages([
        {
          role: "ai",
          text: welcomeMessage
        }
      ]);

      // AI Voice Welcome
      speakText(welcomeMessage);

    } catch (error) {

      console.log(error);

      alert("Error generating interview questions");
    }

    setLoading(false);
  };

  // Real AI Chat
  const sendMessage = async () => {

    if (!userInput.trim()) return;

    const newMessages = [
      ...messages,
      {
        role: "user",
        text: userInput
      }
    ];

    setMessages(newMessages);

    const currentMessage = userInput;

    setUserInput("");

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/chat/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: currentMessage
          }),
        }
      );

      const data = await response.json();

      setMessages([
        ...newMessages,
        {
          role: "ai",
          text: data.response
        }
      ]);

      // AI Voice Response
      speakText(data.response);

      // AI Scores
      setScores({
        confidence: 92,
        communication: 88,
        technical: 85,
      });

    } catch (error) {

      console.log(error);
    }
  };

  // Voice Recognition
  const startListening = () => {

    const recognition = new window.webkitSpeechRecognition();

    recognition.lang = "en-US";

    recognition.onresult = (event) => {

      const transcript = event.results[0][0].transcript;

      setUserInput(transcript);
    };

    recognition.start();
  };

  // Download PDF Report
  const downloadReport = () => {

    const doc = new jsPDF();

    doc.setFontSize(22);

    doc.text("InterviewAI Pro Report", 20, 20);

    doc.setFontSize(14);

    doc.text(
      "AI Interview Performance Analysis",
      20,
      35
    );

    // Scores
    doc.text(
      `Confidence Score: ${scores.confidence}%`,
      20,
      60
    );

    doc.text(
      `Communication Score: ${scores.communication}%`,
      20,
      75
    );

    doc.text(
      `Technical Score: ${scores.technical}%`,
      20,
      90
    );

    // AI Feedback
    doc.text(
      "AI Feedback:",
      20,
      120
    );

    doc.text(
      "Excellent communication and strong technical understanding.",
      20,
      135
    );

    doc.save("InterviewAI_Report.pdf");
  };

  // Save Interview to Firestore
  const saveInterviewData = async () => {

    try {

      await addDoc(
        collection(db, "interviews"),
        {
          questions: questions,
          scores: scores,
          messages: messages,
          createdAt: new Date()
        }
      );

      alert("Interview saved 😎🔥");

    } catch (error) {

      console.log(error);

      alert("Error saving interview");
    }
  };

  return (

    <div className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* Background Glow */}
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[180px] opacity-30 animate-pulse"></div>

      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[180px] opacity-30 animate-pulse"></div>

      {/* Floating Orb */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute top-28 right-20 w-28 h-28 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-70"
      ></motion.div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-6">

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          InterviewAI Pro
        </motion.h1>

        <motion.button
          whileHover={{ scale: 1.1 }}
          className="bg-white/10 border border-white/20 backdrop-blur-lg px-5 py-2 rounded-2xl"
        >
          AI Dashboard
        </motion.button>

      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-7xl font-extrabold leading-tight max-w-6xl"
        >
          Crack Interviews with
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {" "}AI Intelligence
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-slate-300 text-xl mt-8 max-w-3xl leading-9"
        >
          Upload your resume and instantly generate intelligent,
          personalized interview questions powered by AI.
        </motion.p>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 bg-white/10 border border-white/20 backdrop-blur-2xl rounded-[40px] p-10 w-full max-w-3xl shadow-[0_0_80px_rgba(59,130,246,0.3)]"
        >

          <label className="cursor-pointer">

            <div className="bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 px-6 py-4 rounded-2xl text-base font-medium w-[320px] mx-auto">

              {file ? file.name : "🚀 Upload Your Resume"}

            </div>

            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />

          </label>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpload}
            className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 px-10 py-5 rounded-2xl text-xl font-semibold shadow-lg"
          >
            {loading ? "Generating..." : "Generate AI Questions"}
          </motion.button>

        </motion.div>

        {/* AI Stats Cards */}
        {questions && (
          <div className="grid md:grid-cols-3 gap-6 mt-14 w-full max-w-5xl">

            <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-6">
              <h3 className="text-blue-400 text-xl font-bold">
                Skills Detected
              </h3>

              <p className="mt-4 text-slate-300">
                Python, React, FastAPI
              </p>
            </div>

            <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-6">
              <h3 className="text-purple-400 text-xl font-bold">
                Difficulty
              </h3>

              <p className="mt-4 text-slate-300">
                Intermediate
              </p>
            </div>

            <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-6">
              <h3 className="text-pink-400 text-xl font-bold">
                Suggested Role
              </h3>

              <p className="mt-4 text-slate-300">
                AI Backend Developer
              </p>
            </div>

          </div>
        )}

        {/* Webcam Section */}
        {questions && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 bg-white/10 border border-white/20 backdrop-blur-2xl rounded-[40px] p-8 w-full max-w-5xl"
          >

            <h2 className="text-3xl font-bold mb-6 text-yellow-400">
              Live Interview Camera
            </h2>

            <div className="flex flex-col items-center">

              <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                className="rounded-3xl w-full max-w-2xl border border-white/20"
              />

              <div className="mt-6 bg-green-500/20 border border-green-400 px-6 py-3 rounded-2xl text-green-300">
                AI Emotion Status: Confident 😎
              </div>

            </div>

          </motion.div>
        )}

        {/* Questions Section */}
        {questions && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 bg-white/10 border border-white/20 backdrop-blur-2xl rounded-[40px] p-10 max-w-5xl w-full text-left shadow-[0_0_60px_rgba(168,85,247,0.3)]"
          >

            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Interview Questions
            </h2>

            <TypeAnimation
              sequence={[questions]}
              wrapper="pre"
              speed={80}
              className="whitespace-pre-wrap text-slate-200 leading-9 text-lg"
            />

          </motion.div>
        )}

        {/* Live AI Interview */}
        {questions && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 bg-white/10 border border-white/20 backdrop-blur-2xl rounded-[40px] p-8 w-full max-w-5xl"
          >

            <h2 className="text-3xl font-bold mb-6 text-green-400">
              Live AI Interview
            </h2>

            {/* Messages */}
            <div className="h-[400px] overflow-y-auto space-y-4 mb-6 pr-2">

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-2xl max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-blue-600 ml-auto"
                      : "bg-slate-800"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

            </div>

            {/* Input Area */}
            <div className="flex gap-4">

              {/* Mic Button */}
              <button
                onClick={startListening}
                className="bg-purple-600 hover:bg-purple-700 px-6 rounded-2xl text-xl"
              >
                🎤
              </button>

              {/* Input */}
              <input
                type="text"
                placeholder="Type your answer..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 outline-none"
              />

              {/* Send */}
              <button
                onClick={sendMessage}
                className="bg-green-500 hover:bg-green-600 px-8 rounded-2xl font-semibold"
              >
                Send
              </button>

            </div>

          </motion.div>
        )}

        {/* AI Score Dashboard */}
        {scores && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 grid md:grid-cols-3 gap-6 w-full max-w-5xl"
          >

            <div className="bg-white/10 border border-white/20 backdrop-blur-2xl rounded-3xl p-8 text-center">

              <h2 className="text-2xl font-bold text-green-400">
                Confidence
              </h2>

              <p className="text-5xl font-extrabold mt-6">
                {scores.confidence}%
              </p>

            </div>

            <div className="bg-white/10 border border-white/20 backdrop-blur-2xl rounded-3xl p-8 text-center">

              <h2 className="text-2xl font-bold text-blue-400">
                Communication
              </h2>

              <p className="text-5xl font-extrabold mt-6">
                {scores.communication}%
              </p>

            </div>

            <div className="bg-white/10 border border-white/20 backdrop-blur-2xl rounded-3xl p-8 text-center">

              <h2 className="text-2xl font-bold text-purple-400">
                Technical
              </h2>

              <p className="text-5xl font-extrabold mt-6">
                {scores.technical}%
              </p>

            </div>

          </motion.div>
        )}

        {/* Download PDF Button */}
        {scores && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadReport}
            className="mt-10 bg-gradient-to-r from-pink-500 to-purple-600 px-10 py-5 rounded-2xl text-xl font-semibold shadow-lg"
          >
            📄 Download Interview Report
          </motion.button>
        )}

        {/* Save Interview Button */}
        {scores && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveInterviewData}
            className="mt-6 mb-20 bg-gradient-to-r from-green-500 to-emerald-600 px-10 py-5 rounded-2xl text-xl font-semibold shadow-lg"
          >
            ☁️ Save Interview
          </motion.button>
        )}

      </div>
    </div>
  );
}

export default App;