import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Brain, BarChart4, FileText, CheckCircle, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function StudyToolsSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  
  const cards = [
    {
      id: 1,
      icon: <Brain className="h-8 w-8" />,
      iconBg: "bg-blue-500",
      title: "AI-Powered Quizzes",
      description: "Convert your study material into interactive quizzes using advanced AI technology that identifies key concepts and creates targeted questions.",
      features: [
        "Customizable difficulty levels",
        "Multiple question formats",
        "Performance analytics"
      ],
      link: "/quiz",
      buttonText: "Try Quiz Generator",
      bgColor: "bg-blue-50 dark:bg-slate-800"
    },
    {
      id: 2,
      icon: <BarChart4 className="h-8 w-8" />,
      iconBg: "bg-purple-500",
      title: "Smart Flashcards",
      description: "Create and study with digital flashcards that adapt to your learning pace and focus on areas where you need improvement.",
      features: [
        "Spaced repetition system",
        "Auto-generated from content",
        "Progress tracking"
      ],
      link: "/flashcards",
      buttonText: "Explore Flashcards",
      bgColor: "bg-purple-50 dark:bg-slate-800"
    },
    {
      id: 3,
      icon: <FileText className="h-8 w-8" />,
      iconBg: "bg-green-500",
      title: "Content Summarizer",
      description: "Transform lengthy study materials into concise, easy-to-understand summaries with our AI-powered summarization tool.",
      features: [
        "Key concept extraction",
        "Customizable summary length",
        "Save and export options"
      ],
      link: "/summarizer",
      buttonText: "Try Summarizer",
      bgColor: "bg-green-50 dark:bg-slate-800"
    }
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            Advanced Study Tools
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-[800px] mx-auto">
            Powerful AI-driven tools to enhance your learning experience
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`${card.bgColor} rounded-xl p-8 shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              <div className={`mb-6 ${card.iconBg} h-16 w-16 rounded-xl flex items-center justify-center text-white`}>
                {card.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                {card.title}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                {card.description}
              </p>
              
              <ul className="space-y-3 mb-8">
                {card.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href={card.link as any}>
                <Button
                  variant="outline"
                  className="w-full group hover:bg-slate-900 hover:text-white dark:hover:bg-slate-700 transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    {card.buttonText}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}