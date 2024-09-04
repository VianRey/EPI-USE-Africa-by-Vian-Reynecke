"use client";
import React from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import CustomNavbar from "../components/navbar";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

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
          <Card className="dark:bg-gray-700 bg-gray-100 rounded-xl shadow-lg">
            <CardBody>
              <h2 className="text-3xl font-bold text-center mb-6">About Me</h2>
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
        <div className="flex justify-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button href="https://github.com/VianRey" className="bg-orange-800">
              <FontAwesomeIcon icon={faGithub} size="2x" />
              <span className="text-lg">GitHub</span>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              href="https://www.linkedin.com/in/vian-reynecke-a80604282/"
              className="bg-blue-600"
            >
              <FontAwesomeIcon icon={faLinkedin} size="2x" />
              <span className="text-lg">LinkedIn</span>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Button
              href="https://blendweb.co.za"
              className="dark:bg-white dark:text-gray-800 bg-gray-800 text-white"
            >
              <FontAwesomeIcon icon={faGlobe} size="2x" />
              <span className="text-lg">BlendWeb</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
