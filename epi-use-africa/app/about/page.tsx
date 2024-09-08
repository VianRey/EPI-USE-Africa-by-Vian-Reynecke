////////////////////////////////////////////////////////////////
// About Page Component
// This page provides a brief introduction of myself, Vian Reynecke.
// It includes my bio and links to my GitHub, LinkedIn, and BlendWeb site.
// The page uses animations for smooth transitions and is fully responsive,
// adapting to different screen sizes.
//
// Key features:
// 1. Responsive design with smooth animations using Framer Motion.
// 2. Dynamic components for performance optimization.
// 3. Links to social profiles (GitHub, LinkedIn, BlendWeb) with external
//    navigation.
// 4. Dark mode support and styled using TailwindCSS for consistency
//    across themes.
////////////////////////////////////////////////////////////////

"use client"; // This marks the component as client-side only

import React from "react"; // Import React for JSX support
import { Card, CardBody, Button } from "@nextui-org/react"; // UI components from NextUI
import CustomNavbar from "../components/navbar"; // Navbar component for page navigation
import { motion } from "framer-motion"; // Import Framer Motion for animation support
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // FontAwesomeIcon for using icons
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons"; // Social icons for GitHub and LinkedIn
import { faGlobe } from "@fortawesome/free-solid-svg-icons"; // Icon for personal website (Globe)

export default function about() {
  return (
    <>
      <CustomNavbar /> {/* Navbar at the top of the page */}
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 p-4">
        {/* Main container for the content, with background gradients for light and dark mode support */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} // Initial animation state (faded and moved up)
          animate={{ opacity: 1, y: 0 }} // Final animation state (fully visible and in position)
          transition={{ duration: 0.6 }} // Animation duration of 0.6 seconds
          className="w-full max-w-[800px] mb-8" // Limit the width of the container to 800px and add bottom margin
        >
          <Card className="dark:bg-gray-700 bg-gray-100 rounded-xl shadow-lg">
            {/* Card for displaying the "About Me" content with dark and light background */}
            <CardBody>
              <h2 className="text-3xl font-bold text-center mb-6">About Me</h2>{" "}
              {/* Heading for the section */}
              <div className="text-center">
                {/* Container for the profile picture and bio */}
                <motion.img
                  src="https://1.gravatar.com/avatar/781dd086d20f254c9ad1cf197f8797cdb7e8660f1e9af50133234e664c47dc6d?size=256"
                  alt="Vian Reynecke"
                  className="rounded-full mb-4 mx-auto border-4 border-gradient-to-r from-purple-400 to-gray-500"
                  width={128}
                  height={128}
                  initial={{ scale: 0.8 }} // Initial state of the image (slightly smaller)
                  animate={{ scale: 1 }} // Final state of the image (full size)
                  transition={{ duration: 0.6 }} // Animation duration of 0.6 seconds
                />
                <p className="text-gray-900 dark:text-gray-100 mb-4 text-lg">
                  Hi, I'm Vian Reynecke, a final-year Computer Science student
                  at the University of Pretoria and a partner at BlendWeb. I'm
                  passionate about technology and eager to pursue an honors
                  program. I'm also looking for job shadowing or internship
                  opportunities in 2025.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Outside of coding, I enjoy exploring tech trends, DJing Afro
                  Tech, and designing creative solutions. Let's connect and make
                  an impact together!
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 w-full max-w-[800px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }} // Initial animation state for the button (faded and moved down)
            animate={{ opacity: 1, y: 0 }} // Final animation state for the button (fully visible and in position)
            transition={{ duration: 0.6, delay: 0.4 }} // Animation with delay for a staggered effect
            className="w-full sm:w-auto"
          >
            <a
              href="https://github.com/VianRey"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button className="bg-red-500 w-full text-white">
                {/* Button linking to GitHub */}
                <FontAwesomeIcon icon={faGithub} size="2x" />
                <span className="text-lg">GitHub</span>
              </Button>
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} // Animation for LinkedIn button
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }} // Slightly delayed for staggered effect
            className="w-full sm:w-auto"
          >
            <a
              href="https://www.linkedin.com/in/vian-reynecke-a80604282/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button className="bg-blue-600 w-full text-white">
                {/* Button linking to LinkedIn */}
                <FontAwesomeIcon icon={faLinkedin} size="2x" />
                <span className="text-lg">LinkedIn</span>
              </Button>
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} // Animation for BlendWeb button
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }} // Longest delay for the last button
            className="w-full sm:w-auto"
          >
            <a
              href="https://blendweb.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button className="dark:bg-white dark:text-gray-800 bg-gray-800 text-white w-full">
                {/* Button linking to personal site, BlendWeb */}
                <FontAwesomeIcon icon={faGlobe} size="2x" />
                <span className="text-lg">BlendWeb</span>
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
}
