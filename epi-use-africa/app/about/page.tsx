"use client";
import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import CustomNavbar from "../components/navbar";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <>
      <CustomNavbar />
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[800px] mb-8"
        >
          <Card className="bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-800 dark:to-gray-600 rounded-xl shadow-lg">
            <CardBody>
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
                About Me
              </h2>
              <div className="text-center">
                <motion.img
                  src="https://1.gravatar.com/avatar/781dd086d20f254c9ad1cf197f8797cdb7e8660f1e9af50133234e664c47dc6d?size=256"
                  alt="Viann Reynecke"
                  className="rounded-full mb-4 mx-auto border-4 border-gradient-to-r from-purple-400 to-gray-500"
                  width={128}
                  height={128}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <p className="text-gray-900 dark:text-gray-100 mb-4 text-lg">
                  Hello! I'm Vian Reynecke, a final-year Computer Science
                  student at the University of Pretoria and a current partner at
                  BlendWeb. With a passion for technology and innovation, I'm
                  excited about advancing my academic journey through the honors
                  program. I'm actively seeking job shadowing or internship
                  opportunities for 2025 to gain hands-on experience and
                  contribute to exciting projects.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  When I'm not coding, you can find me exploring new tech
                  trends, DJing Afro Tech, or designing creative solutions.
                  Let's connect and explore how we can work together to make an
                  impact!
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
