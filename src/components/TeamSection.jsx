"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

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
    name: "Vickey Kumar",
    role: "Admin & PR Head",
    university: "IIT Patna",
    image: "/our_team/AdminPrHead.jpg",
    socials: {
      linkedin: "#",
      instagram: "#",
      mail: "#"
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: "easeOut" }}
      className="group relative flex flex-col items-center text-center w-full max-w-[17rem] lg:max-w-[19rem] bg-white border border-[#EAE3D6] p-5 rounded-[2px] shadow-[0_8px_30px_rgba(13,20,15,0.04)] hover:shadow-[0_16px_40px_rgba(13,20,15,0.08)] transition-all duration-500"
    >
      {/* Image Container with architectural hairline border */}
      <div className="relative w-full aspect-[3/4] mb-6 overflow-hidden rounded-[2px] bg-[#FAF8F5] border border-[#EAE3D6]/80">
        <div className="absolute inset-0 bg-[#0D140F]/15 group-hover:bg-transparent transition-colors duration-700 z-10" />
        <motion.img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
        />

        {/* Social Links on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#0D140F]/95 via-[#0D140F]/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out z-20 flex justify-center gap-4">
          <a
            href={member.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} LinkedIn`}
            className="w-8 h-8 rounded-[2px] border border-white/20 bg-white/10 flex items-center justify-center text-white/80 hover:text-[#C29B5D] hover:border-[#C29B5D] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a
            href={member.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} Instagram`}
            className="w-8 h-8 rounded-[2px] border border-white/20 bg-white/10 flex items-center justify-center text-white/80 hover:text-[#C29B5D] hover:border-[#C29B5D] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a
            href={member.socials.mail}
            aria-label={`${member.name} Email`}
            className="w-8 h-8 rounded-[2px] border border-white/20 bg-white/10 flex items-center justify-center text-white/80 hover:text-[#C29B5D] hover:border-[#C29B5D] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>
        </div>
      </div>

      {/* Text Content */}
      <h3
        className="text-xl lg:text-2xl font-serif text-[#0D140F] mb-1 group-hover:text-[#3E634A] transition-colors duration-300"
        style={{ fontFamily: serif }}
      >
        {member.name}
      </h3>

      <p
        className="text-[#C29B5D] text-xs tracking-[0.16em] uppercase font-semibold mb-2"
        style={{ fontFamily: sans }}
      >
        {member.role}
      </p>

      <div className="flex items-center gap-2 mb-3">
        <span className="h-[1px] w-3 bg-[#EAE3D6]" />
        <span
          className="text-[#0D140F]/65 text-[11px] tracking-wider uppercase font-medium"
          style={{ fontFamily: sans }}
        >
          {member.university}
        </span>
        <span className="h-[1px] w-3 bg-[#EAE3D6]" />
      </div>

      {member.badge && (
        <div className="mt-auto px-2.5 py-1 bg-[#C29B5D]/10 text-[#8C6D38] text-[9px] sm:text-[10px] font-medium tracking-wider uppercase border border-[#C29B5D]/30 rounded-[2px]">
          {member.badge}
        </div>
      )}
    </motion.div>
  );
}

export default function TeamSection() {
  const containerRef = useRef(null);

  return (
    <section
      ref={containerRef}
      className="py-28 bg-[#FAF8F5] overflow-hidden border-t border-[#EAE3D6]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="h-[1px] w-8 bg-[#C29B5D]" />
            <span className="text-[11px] tracking-[0.25em] uppercase text-[#C29B5D] font-mono">
              THE VISIONARIES
            </span>
            <span className="h-[1px] w-8 bg-[#C29B5D]" />
          </div>
          <h2
            className="text-3xl md:text-5xl font-light leading-tight text-[#0D140F]"
            style={{ fontFamily: serif }}
          >
            Guided by <span className="text-[#C29B5D] italic">Excellence</span>
          </h2>
          <p
            className="text-[#0D140F]/65 text-base md:text-lg max-w-2xl mx-auto mt-4 font-light leading-relaxed"
            style={{ fontFamily: sans }}
          >
            A multidisciplinary leadership team bringing together strategic insight, environmental engineering, and institutional rigor from India's premier centers of learning.
          </p>
        </motion.div>

        <div className="flex flex-col items-center">
          {/* Top Row - Founder (Krishna Singh - Index 0) */}
          <div className="flex justify-center w-full mb-8">
            <TeamCard member={teamMembers[0]} index={0} />
          </div>

          {/* Bottom Row - Patil (Index 3), Vickey Kumar (Index 2) and CTO (Alok Ranjan - Index 1) */}
          <div className="flex flex-col md:flex-row justify-center gap-6 lg:gap-8 w-full">
            <TeamCard member={teamMembers[3]} index={1} />
            <TeamCard member={teamMembers[2]} index={2} />
            <TeamCard member={teamMembers[1]} index={3} />
          </div>
        </div>
      </div>
    </section>
  );
}
