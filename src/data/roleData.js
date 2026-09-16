export const roleData = {
  eyebrow: "ROLE 02 · ENGINEERING & PRODUCT",
  title: "AI Full-Stack Developer",
  navigationTabs: [
    { id: "full-stack", label: "Full-Stack", href: "#overview" },
    { id: "ai-native", label: "AI-Native Dev", href: "#technology-stack" },
    { id: "saas-paas", label: "SaaS / PaaS", href: "#project-overview" },
    { id: "cursor-ai", label: "Cursor AI", href: "#technical-scope" }
  ],
  introduction:
    "Build AI-native SaaS/PaaS product features end-to-end, using AI-assisted development tools as a core part of the workflow.",
  keyResponsibilities: [
    "Build full-stack features — frontend, backend, and database layers",
    "Integrate AI/LLM capabilities directly into product features",
    "Use Cursor AI, GitHub Copilot, or Claude daily in development",
    "Design scalable APIs and multi-tenant SaaS/PaaS architecture"
  ],
  requirements: [
    "Strong full-stack experience (HTML, CSS, JavaScript, React.js, Node.js)",
    "Experience with REST/GraphQL APIs and databases",
    "Practical use of AI coding assistants",
    "Understanding of SaaS/PaaS architecture",
    "MongoDB database development",
    "Responsive web development using Bootstrap and Tailwind CSS",
    "JavaScript development using modern frontend technologies",
    "Experience with jQuery where required"
  ],
  technologyStack: {
    frontend: {
      category: "FRONTEND",
      description: "Modern, responsive client interfaces, state management & component design",
      technologies: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "Bootstrap",
        "Tailwind CSS",
        "jQuery",
        "React.js"
      ]
    },
    backend: {
      category: "BACKEND",
      description: "Server runtime, API orchestration & microservice architecture",
      technologies: ["Node.js"]
    },
    database: {
      category: "DATABASE",
      description: "NoSQL document persistence, schema optimization & indexing",
      technologies: ["MongoDB"]
    },
    aiDevelopment: {
      category: "AI / DEVELOPMENT",
      description: "AI-native engineering workflows, agentic coding & developer acceleration",
      technologies: ["Cursor AI", "AI-assisted development"]
    }
  }
};
