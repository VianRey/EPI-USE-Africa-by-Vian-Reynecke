import Image from "next/image";
import { Button } from "@nextui-org/react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="mt-6 text-4xl font-bold">
        Welcome to the Technical Assessment Project
      </h1>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center">
        <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-white before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] "
            src="/logo.png"
            alt="Project Logo"
            width={180}
            height={37}
            priority
          />
        </div>

        <p className="mt-6 max-w-2xl text-md opacity-80">
          This project is a demonstration of my skills in [Technology/Tools
          Used]. It showcases [brief description of what the project does].
        </p>
        {/* <Button className="mt-8" color="primary" auto>
          Get Started
        </Button> */}
      </section>

      {/* Features Section */}
      <section className="grid text-center lg:grid-cols-3 gap-8 mt-16">
        <div className="p-6 rounded-lg border border-transparent transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h3 className="mb-3 text-xl font-semibold">Feature 1</h3>
          <p className="text-sm opacity-70">
            A brief description of the first feature of your project.
          </p>
        </div>
        <div className="p-6 rounded-lg border border-transparent transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h3 className="mb-3 text-xl font-semibold">Feature 2</h3>
          <p className="text-sm opacity-70">
            A brief description of the second feature of your project.
          </p>
        </div>
        <div className="p-6 rounded-lg border border-transparent transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h3 className="mb-3 text-xl font-semibold">Feature 3</h3>
          <p className="text-sm opacity-70">
            A brief description of the third feature of your project.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-32 w-full text-center">
        <p className="text-sm opacity-50">
          © {new Date().getFullYear()} Vian Reynecke. All rights reserved.
        </p>
      </footer>
    </main>
  );
}


