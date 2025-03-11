import React from 'react';
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Image from "next/image";
import Link from "next/link";
import { routes } from "@/lib/routes";

const EnhancedEvalBuilderSection = () => {
  return (
    <section id="navy-evaluation-builder" className="relative py-16 overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none">
        <Image
          src="/navy-grid-pattern.svg"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
      </div>
      
      <Container>
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Content Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Navy Evaluation Builder
              </h2>
              <p className="max-w-2xl text-xl text-slate-600 dark:text-slate-300">
                Create professional, impactful evaluations with customizable templates and AI-powered enhancements
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-6">
              <div className="flex p-4 transition-all rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md">
                <div className="flex items-center justify-center w-12 h-12 mr-4 text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Customizable Templates</h3>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">
                    Build and save evaluation templates for different ranks and rates with customizable sections.
                  </p>
                </div>
              </div>

              <div className="flex p-4 transition-all rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md">
                <div className="flex items-center justify-center w-12 h-12 mr-4 text-indigo-600 bg-indigo-100 rounded-full dark:bg-indigo-900/30 dark:text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Metrics Library</h3>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">
                    Access a comprehensive library of pre-built metrics for different evaluation sections.
                  </p>
                </div>
              </div>

              <div className="flex p-4 transition-all rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md">
                <div className="flex items-center justify-center w-12 h-12 mr-4 text-purple-600 bg-purple-100 rounded-full dark:bg-purple-900/30 dark:text-purple-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI Enhancement</h3>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">
                    Improve your evaluation bullets with AI-powered suggestions and professional formatting.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Link href={routes.evalTemplateBuilder}>
                <Button
                  size="lg"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-12 px-8 py-6 bg-blue-600 text-white shadow hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 cursor-pointer transition-all"
                >
                  Build Evaluations
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-lg overflow-hidden rounded-xl shadow-2xl aspect-[4/3] group transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              <Image
                src="/evalbuilder.jpg"
                alt="Navy Evaluation Builder interface showing a template being edited"
                fill
                className="object-cover transition-all duration-500 group-hover:scale-105"
                priority
              />
              
              {/* Floating card */}
              <div className="absolute p-6 -bottom-2 -right-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-xs transform rotate-2 border border-slate-200 dark:border-slate-700 transition-all duration-500 group-hover:rotate-0 group-hover:shadow-xl group-hover:border-blue-200 dark:group-hover:border-blue-800">
                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Professional Evaluations</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Create impactful Navy evaluations with our specialized builder tool designed for career advancement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default EnhancedEvalBuilderSection;
