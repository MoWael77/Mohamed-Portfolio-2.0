"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import type { JSX } from "react/jsx-runtime"

interface Command {
  command: string
  output: string | JSX.Element
  isTyping?: boolean
  typedOutput?: string
}

export default function TerminalPortfolio() {
  const [commands, setCommands] = useState<Command[]>([
    {
      command: "welcome",
      output: `Hi, I'm Mohamed Wael, a Software, & Cybersecurity Engineer.

Welcome to my interactive portfolio terminal!
Type 'help' to see available commands.`,
      typedOutput: `Hi, I'm Mohamed Wael, a Software, & Cybersecurity Engineer.

Welcome to my interactive portfolio terminal!
Type 'help' to see available commands.`,
    },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const [rotateX, setRotateX] = useState(10)
  const [rotateY, setRotateY] = useState(-15)
  const [translateY, setTranslateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX
    const mouseY = e.clientY

    // Calculate rotation based on mouse position
    const rotateYValue = ((mouseX - centerX) / rect.width) * 30
    const rotateXValue = ((centerY - mouseY) / rect.height) * 30

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
    setTranslateY(-5) // Slight lift on hover
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    // Hanging/dropping animation
    setRotateX(15)
    setRotateY(-10)
    setTranslateY(10) // Drop down effect

    // Subtle swing animation
    setTimeout(() => {
      setRotateX(8)
      setRotateY(-12)
      setTranslateY(5)
    }, 200)

    setTimeout(() => {
      setRotateX(10)
      setRotateY(-15)
      setTranslateY(0)
    }, 400)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleString())
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [commands])

  const commandResponses: { [key: string]: string } = {
    help: `Available commands:

help - Show available commands
about - Learn more about me
projects - View my projects
skills - See my technical skills
experience - View work experience
contact - Get my contact information
education - View educational background
certifications - See my certifications
leadership - Leadership experience
clear - Clear terminal
sudo - Access admin commands`,

    about: `Mohamed Wael - Software & Cybersecurity Engineer

I'm a passionate cybersecurity engineer specializng in penetration testing, software development and AI technologies,
full-stack development, and creating innovative digital solutions.

I love building products that make a difference and solving complex
problems with elegant, scalable solutions, discovering bugs and forensics.

Location: Cairo, Egypt
Focus: Full-Stack Development, Cloud Architecture, Pentesting & Bug-Bounty, SOC-Analyst, `,

    projects: `Featured Projects:

1. Vaultique Website
   - Website for a watch store that has 3D models, Wrist detection, Seeing product in AR, fully dynamic web app and manage user data
   - Tech: Javascript, node.js, mongoDB, css, html, tensorflow, GLB, 
   - Link: https://www.vaultique.live/

2. Media Player
   - The project utilizes Doubly Circular Linked List, WinForms, and Windows Media Player (WMP) for managing the playlist functionality.
   - A user-friendly interface for managing and playing video files, custom playback controls, including play, pause, shuffle, and volume control.
   - Tech: C++, Winforms
   - Link: https://github.com/MoWael77/MediaPlayer-MIU

3. Campus Area Network System & Implementation	 
   - Designed and implemented a Campus Area Network with full end-to-end connectivity across wired and wireless segments
   - Applied VLSM to optimize IP address allocation and reduce waste and set up DHCP for dynamic IP assignment, NAT for external access, and IPsec VPN for secure remote communication.
   - Tech: Packet Tracer
   - Link: https://github.com/MoWael77/Campus-Area-Network-System-Implementation

Visit my GitHub for more projects and code samples.`,

    skills: `Technical Skills:

Programming Languages:
JavaScript, Python, C, Java, C++, 

AI/ML:
TensorFlow, PyTorch, Scikit-learn, OpenAI API, Hugging Face

Frontend:
React, Vue.js, Tailwind CSS, Three.js

Backend:
Node.js, Express, RESTAPI,

Cloud & DevOps:
AWS, Docker, Kubernetes, CI/CD

Databases:
SQL, MongoDB`,

    experience: `Work Experience:

Full-Stack Developer | Adwia Pharmaceuticals (Aug 2024 - Sept 2024)
• Developed scalable web application from concept to production using .Net framework.
• Implemented OKR system reducing latency by 40%
• Collaborated with teams on product development

Network Engineer | AAIB (Sept 2024 - Oct 2024)
• Ensured Compilance with industry regulations and standards
• Optimized  network application performance and user experience
• Maintained and enhanced existing databases`,

    contact: `Contact Information:

Email: mw056164@gmail.com
LinkedIn: linkedin.com/in/mohamedwael7
GitHub: @MoWael77

Feel free to reach out for collaborations, opportunities,
or just to connect and chat about technology!`,

    education: `Educational Background:



Bachelor of Computer Science specilizing in CyberSecurity
Misr International University | 2023 - 2027


Relevant Coursework:
• CCNA & Malware analysis
• Data Structures & Algorithms
• Software Architecture & Design Patterns
• Operating Systems & OOP`,

    certifications: `Professional Certifications:

EC-council Malware analysis (2024)
EC-council Digital Forensics (2024)


Continuous learning is key in our rapidly evolving field!`,

    leadership: `Leadership & Community:

Technical Lead | at MSP MIU
• Leading a team of 5 engineers
• Instructing new learning subjects and methods for the next generation `
,

    sudo: "Permission denied. Nice try though! 😄",
  }

  const typeText = async (text: string, commandIndex: number) => {
    const chars = text.split("")
    let typedText = ""

    for (let i = 0; i < chars.length; i++) {
      typedText += chars[i]

      setCommands((prev) =>
        prev.map((cmd, idx) => (idx === commandIndex ? { ...cmd, typedOutput: typedText, isTyping: true } : cmd)),
      )

      // Variable typing speed for more realistic effect
      const delay = chars[i] === "\n" ? 50 : Math.random() * 30 + 10
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    // Mark typing as complete
    setCommands((prev) => prev.map((cmd, idx) => (idx === commandIndex ? { ...cmd, isTyping: false } : cmd)))
  }

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()

    if (trimmedCmd === "clear") {
      setCommands([])
      return
    }

    setIsProcessing(true)

    // Add command to history immediately
    const output = commandResponses[trimmedCmd] || `Command not found: ${cmd}. Type 'help' for available commands.`
    const newCommand: Command = {
      command: cmd,
      output,
      isTyping: true,
      typedOutput: "",
    }

    setCommands((prev) => [...prev, newCommand])

    // Small delay before starting to type
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Start typing animation
    const commandIndex = commands.length
    await typeText(output, commandIndex)

    setIsProcessing(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentInput.trim() && !isProcessing) {
      handleCommand(currentInput)
      setCurrentInput("")
    }
  }

  const handleNavClick = (command: string) => {
    if (isProcessing) return

    if (command === "clear") {
      setCommands([])
    } else {
      setCurrentInput(command)
      handleCommand(command)
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Header */}
      <div className="p-4 border-b border-green-800">
        <h1 className="text-2xl font-bold text-green-400">Mohamed Wael</h1>
        <p className="text-green-600">DevSecOps Engineer</p>
      </div>

      {/* Navigation */}
      <div className="border-b border-green-800 p-2">
        <div className="flex flex-wrap gap-4 text-sm">
          {[
            "help",
            "about",
            "projects",
            "skills",
            "experience",
            "contact",
            "education",
            "certifications",
            "leadership",
            "sudo",
            "clear",
          ].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleNavClick(cmd)}
              className={`text-green-400 hover:text-green-300 transition-colors ${
                isProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isProcessing}
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)]">
        {/* 3D Card Section */}
        <div className="lg:w-1/3 p-8 flex items-center justify-center border-r border-green-800 relative">
          <div className="relative">
            {/* Hanging Chain/String */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16">
              <div className="w-1 h-16 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full shadow-lg"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-3 h-3 bg-gray-700 rounded-full shadow-lg"></div>
            </div>

            {/* Interactive 3D Card */}
            <div
              className="card-container relative cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseEnter}
            >
              <div
                ref={cardRef}
                className="card bg-gray-900 rounded-2xl p-6 border border-green-800 shadow-2xl w-64 h-80 transition-all duration-300 ease-out"
                style={{
                  transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${translateY}px)`,
                  transformOrigin: "center top",
                }}
              >
                <div className="flex flex-col items-center h-full relative">
                  {/* Logo/Brand */}
                  <div className="w-16 h-16 bg-green-400 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-black font-bold text-xl">MW</span>
                  </div>

                  {/* Profile Image */}
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-green-400 shadow-lg">
                    <Image
                      src="/profile.jpg"
                      alt="Mohamed Wael"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <p className="text-green-400 font-bold text-lg">Mohamed Wael</p>
                    <p className="text-green-600 text-sm">DevSecOps Engineer</p>
                    <p className="text-green-500 text-xs mt-1">Cairo, Egypt</p>
                  </div>

                  {/* Glowing effect on hover */}
                  <div
                    className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                      isHovered ? "opacity-20" : "opacity-0"
                    } bg-gradient-to-br from-green-400 via-transparent to-blue-400 pointer-events-none`}
                  ></div>
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <span className="text-green-600 text-sm animate-pulse">[Interactive 3D Card]</span>
            </div>
          </div>
        </div>

        {/* Terminal Section */}
        <div className="lg:w-2/3 flex flex-col">
          <div ref={terminalRef} className="flex-1 p-4 overflow-y-auto">
            {commands.map((cmd, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center mb-2">
                  <span className="text-blue-400">mo_77@portfolio:</span>
                  <span className="text-white">~</span>
                  <span className="text-green-400">$ {cmd.command}</span>
                </div>
                <div className="text-green-300 ml-4 whitespace-pre-wrap">
                  {cmd.typedOutput || cmd.output}
                  {cmd.isTyping && <span className="animate-pulse bg-green-400 text-green-400">█</span>}
                </div>
              </div>
            ))}

            {/* Current Input Line */}
            <form onSubmit={handleSubmit} className="flex items-center">
              <span className="text-blue-400">mo_77@portfolio:</span>
              <span className="text-white">~</span>
              <span className="text-green-400">$ </span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="bg-transparent border-none outline-none text-green-400 flex-1 ml-1"
                autoFocus
                disabled={isProcessing}
              />
              {isProcessing && <span className="animate-pulse text-green-400 ml-2">Processing...</span>}
            </form>
          </div>

          {/* Footer with timestamp */}
          <div className="p-4 border-t border-green-800 flex justify-between items-center">
            <span className="text-green-600 text-sm">mo_77@portfolio:~$</span>
            <span className="text-green-600 text-sm">{currentTime}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
