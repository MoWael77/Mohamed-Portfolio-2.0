"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import type { JSX } from "react/jsx-runtime"

// Error Boundary Component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  return hasError ? <div className="text-red-500 p-4">Component Error</div> : children;
}

// Utility function to detect and format URLs as clickable links
const formatOutputWithLinks = (text: string): string | JSX.Element => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-300"
        >
          {part}
        </a>
      )
    }
    return part
  })
}

interface Command {
  command: string
  output: string | JSX.Element
  isTyping?: boolean
  typedOutput?: string | JSX.Element
}

export default function TerminalPortfolio() {
  const [commands, setCommands] = useState<Command[]>([
    {
      command: "welcome",
      output: `Hi, I'm Mohamed Wael, a Software, & Cybersecurity Engineer.

Welcome to my interactive portfolio terminal!
Type 'help' to see available commands.`,
      typedOutput: "",
      isTyping: true,
    },
  ])

  const [currentInput, setCurrentInput] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const [userHasScrolledUp, setUserHasScrolledUp] = useState(false)
  const lastScrollPosition = useRef(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Track scroll position
  useEffect(() => {
    const terminal = terminalRef.current
    if (!terminal) return

    const handleScroll = () => {
      if (terminal.scrollTop < lastScrollPosition.current) {
        setUserHasScrolledUp(true)
      }
      lastScrollPosition.current = terminal.scrollTop
    }

    terminal.addEventListener('scroll', handleScroll)
    return () => {
      terminal.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Add this useEffect to trigger typing on mount
  useEffect(() => {
    const typeWelcomeMessage = async () => {
      try {
        await typeText(commands[0].output as string, 0)
      } catch (error) {
        console.error('Error typing welcome message:', error)
      }
    }
    typeWelcomeMessage()
  }, []) 

  const [rotateX, setRotateX] = useState(10)
  const [rotateY, setRotateY] = useState(-15)
  const [translateY, setTranslateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [lanyardRotation, setLanyardRotation] = useState(0)
  const [cardSwing, setCardSwing] = useState(0)
  const [isSwaying, setIsSwaying] = useState(true)

  // Natural swaying animation
  useEffect(() => {
    let animationFrame: number
    let startTime = Date.now()
    
    const animate = () => {
      if (isSwaying && !isHovered) {
        const elapsed = (Date.now() - startTime) / 1000
        const swayAmount = Math.sin(elapsed * 0.8) * 2 // Gentle sway
        const lanyardSway = Math.sin(elapsed * 0.8) * 1.5
        
        setCardSwing(swayAmount)
        setLanyardRotation(lanyardSway)
        setRotateY(-15 + swayAmount)
      }
      animationFrame = requestAnimationFrame(animate)
    }
    
    animate()
    return () => cancelAnimationFrame(animationFrame)
  }, [isSwaying, isHovered])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsSwaying(false)
    if (!cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX
    const mouseY = e.clientY

    const rotateYValue = ((mouseX - centerX) / rect.width) * 30
    const rotateXValue = ((centerY - mouseY) / rect.height) * 30

    // More realistic movement with momentum
    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
    setTranslateY(-8)
    setLanyardRotation(rotateYValue * 0.3)
    setCardSwing(rotateYValue * 0.5)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    
    // Realistic bounce back animation
    setRotateX(20)
    setRotateY(-8)
    setTranslateY(15)
    setLanyardRotation(3)

    setTimeout(() => {
      setRotateX(5)
      setRotateY(-18)
      setTranslateY(-3)
      setLanyardRotation(-1)
    }, 150)

    setTimeout(() => {
      setRotateX(10)
      setRotateY(-15)
      setTranslateY(0)
      setLanyardRotation(0)
      setIsSwaying(true)
    }, 300)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    setIsSwaying(false)
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
LinkedIn: https://www.linkedin.com/in/mohamedwael7/
GitHub: https://github.com/MoWael77

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
• Instructing new learning subjects and methods for the next generation `,

    sudo: "Permission denied. Nice try though! 😄",
  }

  const typeText = async (text: string, commandIndex: number) => {
    try {
      const chars = text.split("")
      let typedText = ""

      // Faster typing parameters
      const baseDelay = 10 // Reduced from 30
      const newlineDelay = 20 // Reduced from 50

      for (let i = 0; i < chars.length; i++) {
        typedText += chars[i]

        setCommands((prev) =>
          prev.map((cmd, idx) => (idx === commandIndex ? { ...cmd, typedOutput: typedText, isTyping: true } : cmd)),
        )

        // Only auto-scroll if user hasn't scrolled up and we're near the bottom
        if (terminalRef.current && !userHasScrolledUp) {
          const { scrollTop, scrollHeight, clientHeight } = terminalRef.current
          const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 50
          if (isNearBottom) {
            setTimeout(() => {
              if (terminalRef.current) {
                terminalRef.current.scrollTop = terminalRef.current.scrollHeight
                lastScrollPosition.current = terminalRef.current.scrollTop
              }
            }, 0)
          }
        }

        const delay = chars[i] === "\n" ? newlineDelay : Math.random() * baseDelay + 5
        await new Promise((resolve) => setTimeout(resolve, delay))
      }

      const formattedOutput = formatOutputWithLinks(text)
      setCommands((prev) =>
        prev.map((cmd, idx) =>
          idx === commandIndex ? { ...cmd, output: formattedOutput, isTyping: false } : cmd
        ),
      )
      
      // Reset scroll tracking after command finishes
      setUserHasScrolledUp(false)
    } catch (error) {
      console.error('Error in typeText:', error)
    }
  }

  const handleCommand = async (cmd: string) => {
    try {
      const trimmedCmd = cmd.trim().toLowerCase()

      if (trimmedCmd === "clear") {
        setCommands([])
        setUserHasScrolledUp(false)
        return
      }

      setIsProcessing(true)

      const output = commandResponses[trimmedCmd] || `Command not found: ${cmd}. Type 'help' for available commands.`
      const newCommand: Command = {
        command: cmd,
        output,
        isTyping: true,
        typedOutput: "",
      }

      setCommands((prev) => [...prev, newCommand])

      // Reduced initial delay before typing starts
      await new Promise((resolve) => setTimeout(resolve, 150))

      const commandIndex = commands.length
      await typeText(output, commandIndex)

      setIsProcessing(false)
    } catch (error) {
      console.error('Error handling command:', error)
      setIsProcessing(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault()
      if (currentInput.trim() && !isProcessing) {
        handleCommand(currentInput)
        setCurrentInput("")
      }
    } catch (error) {
      console.error('Error in form submission:', error)
    }
  }

  const handleNavClick = (command: string) => {
    try {
      if (isProcessing) return

      if (command === "clear") {
        setCommands([])
        setUserHasScrolledUp(false)
      } else {
        setCurrentInput(command)
        handleCommand(command)
      }
    } catch (error) {
      console.error('Error in navigation click:', error)
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-green-400 font-mono" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
        {/* Centered Title Section */}
        <div className="flex flex-col items-center justify-center pt-8 pb-4">
          <h1 className="text-4xl font-bold text-green-400">Mohamed Wael</h1>
          <p className="text-green-600 text-xl mt-2">DevSecOps Engineer</p>
        </div>

        {/* Enhanced Navigation Bar */}
        <div className="border-y border-green-800 py-4 bg-black">
          <div className="max-w-5xl mx-auto px-2">
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center text-base sm:text-lg">
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
                  className={`
                    text-green-400 hover:text-green-300 
                    transition-colors duration-150 px-1 sm:px-2
                    ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  disabled={isProcessing}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(100vh-180px)]">
          <div className="lg:w-1/3 p-4 sm:p-8 flex items-center justify-center border-r border-green-800 relative pt-16 lg:pt-8">
            <div className="relative">
              {/* Realistic Lanyard System */}
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16 lg:-translate-y-22 transition-transform duration-200 ease-out"
                style={{
                  transform: `translateX(-50%) translateY(${typeof window !== 'undefined' && window.innerWidth < 1024 ? '-64px' : '-96px'}) rotate(${lanyardRotation}deg)`,
                  transformOrigin: 'center top',
                  WebkitTransform: `translateX(-50%) translateY(${typeof window !== 'undefined' && window.innerWidth < 1024 ? '-64px' : '-96px'}) rotate(${lanyardRotation}deg)`,
                  WebkitTransformOrigin: 'center top'
                }}
              >
                {/* Main lanyard strap */}
                <div className="w-5 h-24 bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800 rounded-sm shadow-xl relative overflow-hidden">
                  {/* Fabric texture */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="w-full h-px bg-gray-500 mt-2"></div>
                    <div className="w-full h-px bg-gray-500 mt-4"></div>
                    <div className="w-full h-px bg-gray-500 mt-4"></div>
                    <div className="w-full h-px bg-gray-500 mt-4"></div>
                    <div className="w-full h-px bg-gray-500 mt-4"></div>
                  </div>
                  {/* Stitching detail */}
                  <div className="absolute left-1 top-0 bottom-0 w-px bg-gray-500 opacity-40"></div>
                  <div className="absolute right-1 top-0 bottom-0 w-px bg-gray-500 opacity-40"></div>
                </div>
                
                {/* Metal clip connector */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-gradient-to-b from-gray-400 to-gray-600 rounded-sm shadow-lg border border-gray-500">
                  {/* Clip mechanism */}
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-gray-800 rounded-sm"></div>
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-gray-300 rounded-full"></div>
                  {/* Metal shine */}
                  <div className="absolute top-0 left-0 w-2 h-2 bg-white opacity-30 rounded-full blur-sm"></div>
                </div>
                
                {/* Connection point to card */}
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gray-600"></div>
              </div>

              {/* Card holder/badge reel simulation */}
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16 lg:-translate-y-24 transition-transform duration-200 ease-out"
                style={{
                  transform: `translateX(-50%) translateY(${typeof window !== 'undefined' && window.innerWidth < 1024 ? '-64px' : '-96px'}) rotate(${lanyardRotation}deg)`,
                  transformOrigin: 'center top',
                  WebkitTransform: `translateX(-50%) translateY(${typeof window !== 'undefined' && window.innerWidth < 1024 ? '-64px' : '-96px'}) rotate(${lanyardRotation}deg)`,
                  WebkitTransformOrigin: 'center top'
                }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full shadow-lg border-2 border-gray-400">
                  <div className="absolute inset-1 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full">
                    <div className="absolute top-1 left-1 w-2 h-2 bg-white opacity-50 rounded-full blur-sm"></div>
                  </div>
                </div>
              </div>

              <div
                className="card-container relative cursor-pointer"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
              >
                <div
                  ref={cardRef}
                  className="card bg-white rounded-lg border border-gray-400 shadow-2xl w-56 sm:w-64 h-72 sm:h-80 overflow-hidden relative"
                  style={{
                    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY + cardSwing}deg) translateY(${translateY}px)`,
                    WebkitTransform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY + cardSwing}deg) translateY(${translateY}px)`,
                    transformOrigin: "center top",
                    WebkitTransformOrigin: "center top",
                    transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {/* Card hole for lanyard */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-400 rounded-full shadow-inner"></div>
                  
                  <div className="relative h-full w-full">
                    {/* Full card photo */}
                    <div className="absolute inset-0 w-full h-full">
                      <Image
                        src="/profile.jpg"
                        alt="Mohamed Wael"
                        width={256}
                        height={360}
                        className={`w-full h-full object-cover object-center transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => console.error('Failed to load profile image')}
                        priority
                      />
                      {!imageLoaded && (
                        <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                      )}
                    </div>

                    {/* Card overlay for text */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4">
                      <div className="text-center text-white">
                        <p className="font-bold text-lg drop-shadow-lg">Mohamed Wael</p>
                        <p className="text-sm opacity-90 drop-shadow-md">DevSecOps Engineer</p>
                        <p className="text-xs opacity-80 mt-1 drop-shadow-md">Cairo, Egypt</p>
                      </div>
                    </div>

                    {/* Card shine effect */}
                    <div
                      className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                        isHovered ? "opacity-20" : "opacity-0"
                      } bg-gradient-to-br from-white via-transparent to-blue-200 pointer-events-none`}
                    ></div>

                    {/* Holographic security strip */}
                    <div className="absolute top-16 right-2 w-1 h-32 bg-gradient-to-b from-purple-400 via-pink-400 to-blue-400 opacity-60 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8 sm:mt-10">
                <span className="text-green-600 text-sm animate-pulse">[Interactive ID Card]</span>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 flex flex-col">
            <div 
              ref={terminalRef} 
              className="flex-1 p-4 overflow-y-auto"
              style={{ scrollBehavior: 'smooth' }}
            >
              {commands.map((cmd, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-center mb-2">
                    <span className="text-blue-400">mo_77@portfolio:</span>
                    <span className="text-white">~</span>
                    <span className="text-green-400">$ {cmd.command}</span>
                  </div>
                  <div className="text-green-300 ml-4 whitespace-pre-wrap">
                    {cmd.isTyping ? cmd.typedOutput : cmd.output}
                    {cmd.isTyping && <span className="animate-pulse bg-green-400 text-green-400">█</span>}
                  </div>
                </div>
              ))}

              <form onSubmit={handleSubmit} className="flex items-center">
                <span className="text-blue-400">mo_77@portfolio:</span>
                <span className="text-white">~</span>
                <span className="text-green-400">$ </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  className="bg-transparent border-none outline-none text-green-400 flex-1 ml-1 font-mono"
                  autoFocus
                  disabled={isProcessing}
                  style={{ fontFamily: "'Courier New', Courier, monospace" }}
                />
                {isProcessing && <span className="animate-pulse text-green-400 ml-2">Processing...</span>}
              </form>
            </div>

            <div className="p-4 border-t border-green-800 flex justify-between items-center">
              <span className="text-green-600 text-sm">mo_77@portfolio:~$</span>
              <span className="text-green-600 text-sm">{currentTime}</span>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
