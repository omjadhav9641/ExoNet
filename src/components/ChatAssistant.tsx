"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Sparkles, User, HelpCircle } from "lucide-react";
import { TargetStar } from "@/data/stars";

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface ChatAssistantProps {
  activeStar: TargetStar;
}

export default function ChatAssistant({ activeStar }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I am the ExoNet AI Assistant. I can help you vet and analyze the current exoplanet target. Feel free to click any suggestion below or type your query."
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const faqList = [
    "What is an exoplanet?",
    "Why is this a planet?",
    "What is transit depth?",
    "What is confidence score?",
    "Why is this not an eclipsing binary?"
  ];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Answer matching routine
  const getContextualAnswer = (question: string): string => {
    const qLower = question.toLowerCase();

    if (qLower.includes("what is an exoplanet")) {
      return "An exoplanet (extra-solar planet) is a planet that orbits a star outside our solar system. We discover them by looking for the periodic dimming of a star's light as the planet passes in front of it.";
    }

    if (qLower.includes("why is this a planet") || qLower.includes("why is this a candidate")) {
      if (activeStar.status === "Planet Candidate") {
        return `Target star ${activeStar.id} (${activeStar.name}) is classified as a Planet Candidate with ${activeStar.confidence.toFixed(1)}% confidence because it shows a clear, symmetric U-shaped transit dip every ${activeStar.period} days, with no centroid shift or secondary eclipse indicators.`;
      } else if (activeStar.status === "Eclipsing Binary") {
        return `Actually, target ${activeStar.id} is NOT classified as a planet. Our AI classified it as an Eclipsing Binary because the transit dip is deep, V-shaped (indicating grazing stars), and shows a secondary stellar occultation dip at phase 0.5.`;
      } else if (activeStar.status === "Blend") {
        return `Target ${activeStar.id} is classified as a Blend. This means the transit-like dip is not from a planet orbiting the main star, but rather light contaminated from a nearby background eclipsing binary star.`;
      } else {
        return `Target ${activeStar.id} is classified as Noise / Starspot. The variations in light are caused by stellar rotation, magnetic active starspots, or spacecraft guide-sensor jitter, rather than any transiting planet.`;
      }
    }

    if (qLower.includes("transit depth")) {
      return "Transit depth is the amount of stellar light blocked by a transiting planet, usually measured in parts-per-million (ppm). It tells us the size of the planet relative to its host star. For example, a depth of 1462 ppm means the star dims by 0.14% during transit.";
    }

    if (qLower.includes("confidence score")) {
      return `The confidence score represents the model's certainty. For ${activeStar.id}, the confidence is ${activeStar.confidence.toFixed(1)}%. We compute this by integrating the neural network probability weights with physical parameters like signal signal-to-noise ratio (SNR) and centring measurements.`;
    }

    if (qLower.includes("not an eclipsing binary") || qLower.includes("not a binary")) {
      if (activeStar.status === "Planet Candidate") {
        return `We know ${activeStar.id} is not an eclipsing binary because: 1) the transit shape is a flat-bottomed U-shape rather than a V-shape, 2) there is no secondary eclipse dip at phase 0.5, and 3) the calculated transit depth is too shallow to be caused by another self-luminous star.`;
      } else if (activeStar.status === "Eclipsing Binary") {
        return `It IS an eclipsing binary. The AI flagged it due to the sharp V-shape and a clear secondary eclipse dip which can only be explained by a binary star system orbiting each other.`;
      } else {
        return `This signal has been flagged as ${activeStar.status}. Our pipeline has checked it for binary eclipses, centroid pixel shifts, and variable spots, concluding that it does not show typical planetary transit features.`;
      }
    }

    return "I am trained to answer TESS vetting questions. Try asking: 'Why is this a planet?', 'What is transit depth?', or 'Why is this not an eclipsing binary?'";
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessages: Message[] = [...messages, { sender: "user", text }];
    setMessages(newMessages);
    setInputVal("");

    // Simulate AI response delay
    setTimeout(() => {
      const reply = getContextualAnswer(text);
      setMessages([...newMessages, { sender: "ai", text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* 1. Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="w-[360px] h-[500px] rounded-2xl border border-primary-blue/30 bg-[#0B1026]/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden mb-4 glow-blue"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary-blue to-cyan-accent flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-white" />
                <div>
                  <h4 className="font-bold text-sm">ExoNet AI Assistant</h4>
                  <span className="text-[10px] text-cyan-100 font-mono">Vetting target: {activeStar.id}</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => {
                const isAI = msg.sender === "ai";
                return (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-2.5 ${!isAI ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`p-1.5 rounded-lg border ${
                      isAI 
                        ? "bg-white/5 border-white/5 text-cyan-accent" 
                        : "bg-primary-blue/20 border-primary-blue/30 text-white"
                    }`}>
                      {isAI ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>
                    <div className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                      isAI 
                        ? "bg-white/5 text-gray-200 rounded-tl-none border border-white/5" 
                        : "bg-primary-blue text-white rounded-tr-none"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions list */}
            <div className="px-4 py-2 border-t border-white/5 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none shrink-0 bg-black/20">
              {faqList.map((faq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(faq)}
                  className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] text-gray-300 hover:text-cyan-accent hover:border-cyan-accent/30 cursor-pointer transition-colors"
                >
                  {faq}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t border-white/5 flex items-center gap-2 bg-black/40">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage(inputVal);
                }}
                placeholder="Ask about TESS transits..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-accent/50"
              />
              <button
                onClick={() => handleSendMessage(inputVal)}
                className="p-2 rounded-xl bg-primary-blue hover:bg-cyan-accent hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] text-white transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Toggle Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 rounded-full bg-gradient-to-r from-primary-blue to-cyan-accent text-white shadow-[0_0_30px_rgba(37,99,235,0.35)] hover:shadow-[0_0_40px_rgba(6,182,212,0.65)] hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer relative group"
      >
        {isOpen ? <X className="w-6 h-6 animate-pulse" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-space-bg animate-ping" />
        )}
        
        {/* Glow halo */}
        <div className="absolute inset-0 rounded-full border border-cyan-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

    </div>
  );
}
