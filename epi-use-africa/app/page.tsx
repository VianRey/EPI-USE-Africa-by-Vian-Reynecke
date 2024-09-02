"use client";

import Image from "next/image";
import { Button } from "@nextui-org/react";
import { FaUserTie, FaTree, FaSearchPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const navigateToEmployeePage = () => {
    router.push("/employee"); // Replace with the correct path to your employee page
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="w-full py-6 px-4 bg-white dark:bg-gray-800 shadow-md rounded-lg mb-8">
        <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent  bg-gray-800 dark:bg-white">
          Employee Hierarchy Management System
        </h1>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mt-12 w-full max-w-4xl">
        <div className="relative flex place-items-center mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-75 blur-3xl"></div>
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] z-10"
            src="/logo.png"
            alt="Project Logo"
            width={220}
            height={45}
            layout="responsive"
            priority
          />
        </div>
        <p className="mt-6 max-w-2xl text-lg opacity-80 leading-relaxed">
          A cloud-hosted application built with Next.js and Supabase to
          efficiently manage your organization's employee hierarchy. Visualize,
          search, and manage your workforce with ease.
        </p>
        <Button
          className="font-bold p-8 text-2xl mt-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white "
          onClick={navigateToEmployeePage} // Attach the navigation function to the button's onClick
        >
          Explore System
        </Button>
      </section>

      {/* Features Section */}
      <section className="grid text-center lg:grid-cols-3 gap-8 mt-12 w-full max-w-6xl">
        {[
          {
            icon: FaUserTie,
            title: "Employee Management",
            description:
              "Create, read, update, and delete employee data with ease. Manage reporting structures and employee details efficiently.",
            color: "text-blue-500",
          },
          {
            icon: FaTree,
            title: "Hierarchy Visualization",
            description:
              "View your organization's structure in an intuitive tree or graph format. Understand reporting lines at a glance.",
            color: "text-green-500",
          },
          {
            icon: FaSearchPlus,
            title: "Advanced Search & Reporting",
            description:
              "Powerful search functionality and customizable reports. Sort and filter employee data based on various fields.",
            color: "text-purple-500",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-lg border border-transparent transition-all duration-300 hover:border-gray-300 hover:bg-white hover:shadow-xl dark:hover:bg-gray-800 hover:cursor-pointer"
          >
            <feature.icon
              className={`mx-auto mb-4 text-5xl ${feature.color}`}
            />
            <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
            <p className="text-sm opacity-70">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Additional Features */}
      <section className="mt-16 text-center w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Additional Features
        </h2>
        <ul className="grid grid-cols-2 gap-4 text-left mx-auto">
          {[
            "Gravatar integration for employee profile pictures",
            "Cloud-hosted for easy access and scalability",
            "Responsive design for desktop and mobile use",
          ].map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <footer className="mt-32 w-full text-center py-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-sm opacity-50">
          © {new Date().getFullYear()} Vian Reynecke. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
