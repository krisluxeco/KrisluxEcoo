"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', sans-serif";

const teamMembers = [
  {
    name: "Krishna Singh",
    role: "Founder & CEO",
    university: "IIT Patna",
    badge: "Bihar State Government Recognised Entrepreneur",
    image: "/our_team/Krishna.jpeg",
    socials: {
      linkedin: "https://www.linkedin.com/in/krishna-kumar-singh-682010361?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      instagram: "https://www.instagram.com/realkrishnasingh05?igsh=MW9yaHpoZjdsbTZ4Nw==",
      mail: "#"
    }
  },
  {
    name: "Alok Ranjan",
    role: "CTO",
    university: "IIT Patna",
    image: "/our_team/AlokRanjan.jpg",
    socials: {
      linkedin: "https://www.linkedin.com/in/alok-ranjan-193a84298",
      instagram: "https://www.instagram.com/alokranjan5859/",
      mail: "mailto:iitpatnaalokranjan@gmail.com"
    }
  },
  {
    name: "Deepali Kumari",
    role: "Head Manager",
    university: "IIT Patna",
    image: "/our_team/Deepali.jpeg",
    socials: {
      linkedin: "https://www.linkedin.com/in/deepali-kumari-545a23314/",
      instagram: "https://www.instagram.com/attitude_deepsr/",
      mail: "deepalixyz01@gmail.com"
    }
  },
  {
    name: "Shreyash Patil",
    role: "Marketing Head",
    university: "IIM Lucknow",
    image: "/our_team/Patil.png",
    socials: {
      linkedin: "https://www.linkedin.com/in/shreyash-patiliimlucknow?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      instagram: "https://www.instagram.com/shreyash_patil28",
      mail: "mailto:shreyashnpatil@gmail.com"
    }
  },
];

function Eyebrow({ children }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      <span className="h-px w-12 bg-[#C8A97A]/60" />
      <p
        className="text-xs tracking-[0.25em] uppercase text-[#C8A97A]"
        style={{ fontFamily: sans }}
      >
        {children}
      </p>
      <span className="h-px w-12 bg-[#C8A97A]/60" />
    </div>
  );
}

function TeamCard({ member, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
      className="group relative flex flex-col items-center text-center w-full max-w-[17rem] lg:max-w-[19rem]"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[3/4] mb-8 overflow-hidden rounded-tl-[3rem] rounded-br-[3rem] shadow-sm">
        <div className="absolute inset-0 bg-[#1C1C1A]/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
        <motion.img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
        />

        {/* Social Links on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[#1C1C1A]/90 via-[#1C1C1A]/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20 flex justify-center gap-5">
          <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#C8A97A] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#C8A97A] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href={member.socials.mail} className="text-white/70 hover:text-[#C8A97A] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>
        </div>
      </div>

      {/* Text Content */}
      <h3
        className="text-2xl lg:text-3xl font-bold text-[#1C1C1A] mb-2 group-hover:text-[#4A6741] transition-colors duration-500"
        style={{ fontFamily: serif }}
      >
        {member.name}
      </h3>

      <p
        className="text-[#C8A97A] text-sm tracking-[0.1em] uppercase font-extrabold mb-4"
        style={{ fontFamily: sans }}
      >
        {member.role}
      </p>

      <div className="flex items-center gap-2">
        <span className="h-[1.5px] w-4 bg-[#1C1C1A]/30" />
        <span
          className="text-[#1C1C1A]/70 text-xs tracking-wider uppercase font-bold"
          style={{ fontFamily: sans }}
        >
          {member.university}
        </span>
        <span className="h-[1.5px] w-4 bg-[#1C1C1A]/30" />
      </div>

      {member.badge && (
        <div className="mt-5 px-3 py-1.5 bg-[#C8A97A]/10 text-[#C8A97A] text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-[#C8A97A]/30">
          {member.badge}
        </div>
      )}
    </motion.div>
  );
}

export default function TeamSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section
      ref={containerRef}
      className="py-32 bg-[#FAF7F2] overflow-hidden border-t border-[#1C1C1A]/10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-24"
        >
          <Eyebrow>The Visionaries</Eyebrow>
          <h2
            className="text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-tight text-[#1C1C1A]"
            style={{ fontFamily: serif }}
          >
            Guided by <span className="text-[#4A6741] italic">Excellence</span>
          </h2>
          <p
            className="text-[#1C1C1A]/70 text-lg md:text-xl max-w-2xl mx-auto mt-6 font-light leading-relaxed"
            style={{ fontFamily: sans }}
          >
            A diverse leadership team bringing together strategic insight and deep technical expertise from India's premier institutions.
          </p>
        </motion.div>

        <div className="flex flex-col items-center">
          {/* Top Row - Founder (Krishna Singh - Index 0) */}
          <div className="flex justify-center w-full mb-10">
            <TeamCard member={teamMembers[0]} index={0} />
          </div>

          {/* Bottom Row - Patil (Index 3), Deepali Kumari (Index 2) and CTO (Alok Ranjan - Index 1) */}
          <div className="flex flex-col md:flex-row justify-center gap-8 lg:gap-12 w-full">
            <TeamCard member={teamMembers[3]} index={1} />
            <TeamCard member={teamMembers[2]} index={2} />
            <TeamCard member={teamMembers[1]} index={3} />
          </div>
        </div>
      </div>
    </section>
  );
}
