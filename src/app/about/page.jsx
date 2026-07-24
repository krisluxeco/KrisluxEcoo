"use client";

import React from "react";
import TeamSection from "@/components/TeamSection";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <NavBar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6">
              About <span className="text-blue-600 dark:text-blue-400">Krisluxeco</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              We are a team of dedicated professionals from top institutions like DU, IIT Patna, and IIM Lucknow. 
              Our mission is to bring innovation and excellence to everything we do.
            </p>
          </motion.div>
        </section>

        {/* Team Section */}
        <TeamSection />
      </main>

      <Footer />
    </div>
  );
}
