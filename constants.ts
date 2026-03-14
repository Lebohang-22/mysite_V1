
import { PortfolioData } from './types';

export const INITIAL_DATA: PortfolioData = {
  name: "Lebohang Tsolo",
  title: "Computer Networking & IT Graduate",
  profileImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800",
  backgroundImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1600",
  cvUrl: "",
  about: "I am a dedicated IT Professional and recent Computer Networking graduate. My expertise lies at the intersection of robust backend development with Django and secure enterprise network architecture. With a deep passion for cybersecurity and automated systems, I build digital environments that are not only functional but resilient against modern threats.",
  email: "lebohang.tsolo@email.com",
  github: "https://github.com/lebohangtsolo",
  linkedin: "https://linkedin.com/in/lebohang-tsolo",
  facebook: "",
  whatsapp: "",
  messages: [], // Inbox initialized as empty

  projects: [
    {
      id: "1",
      title: "Django To-Do Web Application",
      description: "A full-featured Django To-Do application with user authentication, task categories, search, pagination, and dashboard statistics.",
      tags: ["Django", "Python", "HTML", "CSS", "Bootstrap"],
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800",
      link: "#",
      github: "#"
    },
    {
      id: "2",
      title: "Invoice Generator System",
      description: "A Django-based invoice generator allowing users to create, manage, and export invoices with calculated tax and totals.",
      tags: ["Django", "Python", "PostgreSQL", "PDF"],
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
      link: "#",
      github: "#"
    },
    {
      id: "3",
      title: "Network Security Labs (Packet Tracer)",
      description: "Hands-on networking labs covering ACLs, NAT, VPNs, ASA firewalls, and routing protocols using Cisco Packet Tracer.",
      tags: ["Networking", "Security", "Cisco", "Packet Tracer"],
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
      link: "#",
      github: "#"
    }
  ],

  skillCategories: ['Frontend', 'Backend', 'Networking', 'Security', 'Tools'],

  skills: [
    { name: "Python", category: "Backend", level: 85 },
    { name: "Django", category: "Backend", level: 90 },
    { name: "React / TS", category: "Frontend", level: 70 },
    { name: "Computer Networking", category: "Networking", level: 95 },
    { name: "Routing & Switching", category: "Networking", level: 90 },
    { name: "Network Security", category: "Security", level: 85 },
    { name: "Cisco Packet Tracer", category: "Networking", level: 95 },
    { name: "PostgreSQL", category: "Backend", level: 80 }
  ],

  experience: [
    {
      id: "exp1",
      company: "Academic & Practical Projects",
      role: "IT & Networking Student",
      period: "2023 - Present",
      description: [
        "Developed multiple Django web applications including CRUD systems and authentication features.",
        "Configured and tested complex network topologies using Cisco Packet Tracer.",
        "Implemented advanced security concepts such as ACLs, VPNs, NAT, and firewall rules."
      ]
    },
    {
      id: "exp2",
      company: "Self-Directed Learning",
      role: "Aspiring Network & Software Engineer",
      period: "2022 - Present",
      description: [
        "Completed 50+ practical labs in networking, cybersecurity, and enterprise-grade web development.",
        "Built professional portfolio projects using Django, Python, and React.",
        "Continuously exploring emerging cloud technologies and automation scripts."
      ]
    }
  ]
};
