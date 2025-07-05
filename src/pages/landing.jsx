import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  Award, 
  ArrowRight, 
  Briefcase, 
  Building2,
  ChevronRight, 
  Code, 
  Heart, 
  Globe, 
  LineChart, 
  MapPin, 
  PaintBucket, 
  Search, 
  Star, 
  TrendingUp, 
  Users,
  CheckCircle,
  Play,
  Clock,
  DollarSign,
  Sparkles,
  Target,
  Zap,
  Quote,
  ExternalLink,
  MessageSquare,
  Calendar,
  Shield,
  Rocket,
  Trophy,
  Camera,
  BookOpen,
  Filter,
  BarChart3,
  Layers,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SignIn, useUser } from "@clerk/clerk-react";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const LandingPage = () => {
  // Auth-related hooks and state
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  
  // Statistics animation state
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [stats, setStats] = useState({
    jobs: 0,
    companies: 0,
    placements: 0,
    countries: 0
  });

  // Interactive features state
  const [activeFeature, setActiveFeature] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [realTimeApplications, setRealTimeApplications] = useState([]);
  
  // Animate statistics when section comes into view
  useEffect(() => {
    if (statsAnimated) {
      const targetStats = { jobs: 2400, companies: 600, placements: 1250, countries: 15 };
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 fps
      const stepTime = duration / steps;
      
      Object.keys(targetStats).forEach(key => {
        const target = targetStats[key];
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
        }, stepTime);
      });
    }
  }, [statsAnimated]);

  // Simulate real-time applications
  useEffect(() => {
    const applications = [
      { name: "Yassin Chanua", role: "Frontend Engineer", company: "Stripe", country: "Ireland ", time: "2m ago" },
      { name: "Maria Nanteza", role: "Product Designer", company: "Notion", country: "🇬🇧 UK", time: "5m ago" },
      { name: "Raj Patel", role: "Data Scientist", company: "Figma", country: "🇨🇦 CA", time: "8m ago" },
      { name: "Sophie Muledhu", role: "Full Stack Developer", company: "Vercel", country: "🇩🇪 DE", time: "12m ago" },
      { name: "Yuki Tanaka", role: "ML Engineer", company: "OpenAI", country: "🇺🇸 US", time: "15m ago" }
    ];
    
    let index = 0;
    setRealTimeApplications([applications[0]]);
    
    const interval = setInterval(() => {
      index = (index + 1) % applications.length;
      setRealTimeApplications(prev => [applications[index], ...prev.slice(0, 2)]);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle job button click
  const handleFindJobsClick = () => {
    if (isSignedIn) {
      // User is already signed in, navigate to jobs page
      navigate("/jobs");
    } else {
      // User is not signed in, show sign-in modal
      setShowSignIn(true);
    }
  };

  // Handle modal overlay click (close when clicking outside)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
    }
  };

  // Toggle saving a job
  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  // Sample categories
  const categories = [
    {
      name: "Software Engineering",
      count: 842,
      icon: <Code className="text-[#ec2e3a]" />
    },
    {
      name: "Design",
      count: 324,
      icon: <PaintBucket className="text-[#e9357b]" />
    },
    {
      name: "Product Management",
      count: 253,
      icon: <Briefcase className="text-[#5b3353]" />
    },
    {
      name: "Data Science",
      count: 198,
      icon: <LineChart className="text-[#f4b640]" />
    },
    {
      name: "Marketing",
      count: 167,
      icon: <TrendingUp className="text-[#0ba5ec]" />
    },
    {
      name: "Customer Success",
      count: 145,
      icon: <Users className="text-[#0bc99e]" />
    }
  ];

  // Featured companies
  const featuredCompanies = [
    {
      id: 1,
      name: "Stripe",
      logo: "https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/erkxwhl1gd48xfhe2yld",
      size: "1,000+ employees",
      industry: "Fintech",
      locations: ["San Francisco", "Dublin", "Singapore"],
      jobs: 24,
      featured: true
    },
    {
      id: 2,
      name: "Notion",
      logo: "https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/ntd2sljkjzg9rb4qr6sb",
      size: "500+ employees",
      industry: "Productivity Software",
      locations: ["New York", "London", "Tokyo"],
      jobs: 18
    },
    {
      id: 3,
      name: "Coinbase",
      logo: "https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/gyio12df6wilcygrqw6i",
      size: "2,000+ employees",
      industry: "Cryptocurrency",
      locations: ["San Francisco", "Amsterdam", "Remote"],
      jobs: 32
    },
    {
      id: 4,
      name: "Figma",
      logo: "https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/azunamqokw6y6gqoaysl",
      size: "750+ employees",
      industry: "Design Software",
      locations: ["San Francisco", "London", "New York"],
      jobs: 15,
      featured: true
    }
  ];

  // Featured jobs
  const featuredJobs = [
    {
      id: 1,
      title: "Senior Frontend Engineer",
      company: "Stripe",
      logo: "https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/erkxwhl1gd48xfhe2yld",
      location: "San Francisco, US",
      salary: "$180K – $250K",
      equity: "0.1% – 0.5%",
      tags: ["React", "TypeScript", "Remote OK"],
      type: "Full-time",
      posted: "2 days ago",
      visaSponsor: true
    },
    {
      id: 2,
      title: "Product Designer",
      company: "Notion",
      logo: "https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/ntd2sljkjzg9rb4qr6sb",
      location: "New York, US",
      salary: "$140K – $180K",
      equity: "0.05% – 0.2%",
      tags: ["Figma", "User Research", "B2B"],
      type: "Full-time",
      posted: "1 day ago",
      visaSponsor: true
    },
    {
      id: 3,
      title: "Full Stack Engineer",
      company: "Vercel",
      logo: "https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/x3q3gkjmz5jvyhswslqx",
      location: "Berlin, DE",
      salary: "€90K – €130K",
      equity: "0.05% – 0.3%",
      tags: ["Next.js", "Node.js", "Remote OK"],
      type: "Full-time",
      posted: "3 days ago",
      visaSponsor: true
    }
  ];

  // Success stories
  const successStories = [
    {
      name: "David Kim",
      fromCountry: "South Korea",
      toCountry: "United States",
      role: "Software Engineer",
      company: "Coinbase",
      story: "relocated from Seoul to San Francisco",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      image: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Elena Petrova",
      fromCountry: "Russia",
      toCountry: "United Kingdom",
      role: "UX Designer",
      company: "Monzo",
      story: "moved from Moscow to London",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    }
  ];

  // FAQ data
  const faqData = [
    {
      question: "How do I know if a company really sponsors visas?",
      answer: "Every job posting on our platform is verified to confirm visa sponsorship availability. We work directly with companies to ensure they're committed to the visa process before listing positions."
    },
    {
      question: "What types of visas do companies typically sponsor?",
      answer: "Companies on our platform commonly sponsor H-1B, O-1, L-1, TN, and other work visas. The specific visa type depends on your background, the role, and the company's policies."
    },
    {
      question: "How long does the visa process typically take?",
      answer: "The timeline varies by visa type and country. H-1B applications typically take 3-6 months, while other visas may be faster. We provide guidance throughout the entire process."
    },
    {
      question: "Do I need to pay for the visa application?",
      answer: "Most companies cover the legal fees and government filing costs for visa applications. Some premium companies also provide relocation assistance and temporary housing."
    },
    {
      question: "Can I apply if I'm currently on a student visa?",
      answer: "Absolutely! Many of our success stories involve candidates transitioning from F-1 student visas to work visas. We help you navigate the transition smoothly."
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Software Engineer",
      company: "Google",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      quote: "VizzarJobs connected me directly with my hiring manager at Google. The visa process was seamless and I got my H-1B approved in just 4 months!",
      flag: "🇰🇷",
      rating: 5
    },
    {
      name: "Maria Rodriguez",
      role: "Product Designer",
      company: "Stripe",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      quote: "I was skeptical about finding visa sponsorship, but VizzarJobs proved me wrong. Got 3 offers within 2 weeks, all with visa support!",
      flag: "🇲🇽",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "Data Scientist",
      company: "Netflix",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      quote: "The platform's AI matching is incredible. They matched me with Netflix based on my skills, and I'm now working my dream job in LA!",
      flag: "🇮🇳",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "DevOps Engineer",
      company: "Uber",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      quote: "The visa guidance was invaluable. Their team helped me understand the entire O-1 process and I got approved on my first attempt.",
      flag: "🇬🇧",
      rating: 5
    }
  ];

  return (
    <div className="bg-white text-[#051316]">

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[#f5f4f5]/60"></div>
        
        <div className="absolute top-40 left-5 w-64 h-64 rounded-full bg-[#faccde]/20 filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#ffdfda]/30 filter blur-3xl"></div>
          
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-left flex-1 z-10 mt-8"
            >
              <motion.div variants={fadeIn} className="mb-6">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight p.8">
                  Your gateway to<br />
                  <span className="text-[#ec2e3a]">global career</span> opportunities
                </h1>
              </motion.div>
              
              <motion.p 
                variants={fadeIn}
                className="text-xl text-[#535353] mb-10 max-w-2xl leading-relaxed"
              >
                Find jobs with visa sponsorship at the world's most innovative companies.
                Connect directly with hiring managers ready to sponsor international talent.
              </motion.p>
              
              <motion.div variants={fadeIn} className="mb-10">
                <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white rounded-[16px] border border-[#e7e4e7] shadow-lg">
                  <div className="flex-1 flex items-center">
                    <Search className="w-5 h-5 text-[#535353] ml-3 mr-2" />
                    <Input 
                      placeholder="Job title, skills or company"
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#535353] text-[16px]"
                    />
                  </div>
                  <div className="flex items-center min-w-0 sm:min-w-[180px] border-l border-[#e7e4e7]">
                    <MapPin className="w-4 h-4 text-[#535353] mr-2 ml-3 sm:ml-4" />
                    <select className="bg-transparent border-0 text-[#535353] text-[16px] focus:outline-none flex-1 py-2">
                      <option>Any location</option>
                      <option>United States</option>
                      <option>European Union</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                    </select>
                  </div>
                  <Button 
                    className="bg-[#ec2e3a] hover:bg-[#ce0026] text-white px-8 py-6 rounded-[12px] font-medium"
                    onClick={handleFindJobsClick}
                  >
                    Search
                  </Button>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="flex flex-wrap gap-3">
                <span className="text-sm text-[#535353]">Popular searches:</span>
                {["Software Engineer", "Product Manager", "Data Scientist", "UX Designer"].map((item, i) => (
                  <Badge 
                    key={i} 
                    variant="outline" 
                    className="text-[#e9357b] border-[#fce7f3] hover:bg-[#fff4f6] bg-white"
                  >
                    {item}
                  </Badge>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                {/* Floating decorative elements */}
                <motion.div 
                  className="absolute -left-10 -top-10 w-28 h-28 bg-[#faccde] rounded-full opacity-70"
                  animate={{
                    y: [0, -10, 0],
                    x: [0, 5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                ></motion.div>
                
                <motion.div 
                  className="absolute -right-4 -bottom-8 w-32 h-32 bg-[#ffdfda] rounded-full opacity-80"
                  animate={{
                    y: [0, 10, 0],
                    x: [0, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                ></motion.div>

                {/* Main Interactive Dashboard */}
                <div className="relative bg-white rounded-[24px] shadow-2xl p-6 border border-gray-100">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-500">VizzarJobs Dashboard</div>
                  </div>

                  {/* Animated Job Cards */}
                  <div className="space-y-4">
                    {[
                      { 
                        company: "Google", 
                        role: "Software Engineer", 
                        location: "🇺🇸 New York", 
                        salary: "$180K", 
                        color: "bg-blue-50 border-blue-200",
                        logo: "🔍"
                      },
                      { 
                        company: "Meta", 
                        role: "Product Manager", 
                        location: "🇨🇦 Toronto", 
                        salary: "$160K", 
                        color: "bg-purple-50 border-purple-200",
                        logo: "📘"
                      },
                      { 
                        company: "Spotify", 
                        role: "UX Designer", 
                        location: "🇸🇪 Stockholm", 
                        salary: "$120K", 
                        color: "bg-green-50 border-green-200",
                        logo: "🎵"
                      },
                    ].map((job, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.2, duration: 0.6 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className={`${job.color} rounded-xl p-4 cursor-pointer transition-all duration-300`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{job.logo}</div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{job.role}</h4>
                              <p className="text-sm text-gray-600">{job.company}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{job.salary}</p>
                            <p className="text-xs text-gray-500">{job.location}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex gap-2">
                            <span className="bg-white px-2 py-1 rounded-full text-xs text-gray-600">Visa Sponsor</span>
                            <span className="bg-white px-2 py-1 rounded-full text-xs text-gray-600">Remote OK</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#ec2e3a] text-white px-4 py-2 rounded-lg text-sm font-medium"
                          >
                            Apply
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Bottom Stats Bar */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="mt-6 bg-gradient-to-r from-[#ec2e3a] to-[#e9357b] rounded-xl p-4 text-white"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <motion.div 
                          className="text-2xl font-bold"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {statsAnimated ? Math.floor(stats.jobs).toLocaleString() : '2,400+'}
                        </motion.div>
                        <div className="text-sm opacity-90">Active Jobs</div>
                      </div>
                      <div className="text-center">
                        <motion.div 
                          className="text-2xl font-bold"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        >
                          {statsAnimated ? Math.floor(stats.companies).toLocaleString() : '600+'}
                        </motion.div>
                        <div className="text-sm opacity-90">Companies</div>
                      </div>
                      <div className="text-center">
                        <motion.div 
                          className="text-2xl font-bold"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        >
                          {statsAnimated ? Math.floor(stats.placements).toLocaleString() : '1,250+'}
                        </motion.div>
                        <div className="text-sm opacity-90">Placements</div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Floating Success Notification */}
                <motion.div 
                  initial={{ opacity: 0, y: 20, x: 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ delay: 1.5, duration: 0.7 }}
                  className="absolute -top-4 -right-6 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3 border border-green-200"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Alex got hired!</p>
                    <p className="text-xs text-gray-600">🇩🇪 Berlin • Software Dev</p>
                  </div>
                </motion.div>

                {/* Floating Skill Tags */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.7 }}
                  className="absolute -bottom-6 -left-8 bg-white rounded-xl shadow-lg p-3 border border-purple-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-800">In-demand skills</span>
                  </div>
                  <div className="flex gap-1">
                    {['React', 'Python', 'AWS'].map((skill, i) => (
                      <motion.span
                        key={skill}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2 + i * 0.1 }}
                        className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Animated Globe Indicator */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.2, duration: 0.7 }}
                  className="absolute top-1/2 -right-8 transform -translate-y-1/2"
                >
                  <div className="bg-white rounded-full p-3 shadow-lg border border-blue-200">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Globe className="w-6 h-6 text-blue-600" />
                    </motion.div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
                </motion.div>

                {/* Mini Video Preview */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 2.5, duration: 0.8 }}
                  className="absolute -bottom-12 left-1/2 transform -translate-x-1/2"
                >
                  <div className="bg-black rounded-xl p-2 shadow-2xl border-4 border-white">
                    <div className="bg-gradient-to-br from-[#ec2e3a] to-[#e9357b] rounded-lg w-32 h-20 flex items-center justify-center relative overflow-hidden">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-white"
                      >
                        <Play className="w-6 h-6" />
                      </motion.div>
                      
                      {/* Simulated video content */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                      
                      {/* Video play indicator */}
                      <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-xs text-gray-600 font-medium">See it in action</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Trend Indicator */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.8, duration: 0.7 }}
                  className="absolute top-4 left-4"
                >
                  <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full p-2 shadow-lg">
                    <motion.div
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <TrendingUp className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                  <div className="absolute -right-1 -top-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                </motion.div>
              </div>
              
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Video Demo Section */}
      <section className="py-20 bg-gradient-to-br from-[#051316] to-[#1a1a1a] text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#ec2e3a]/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#e9357b]/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center bg-[#ec2e3a]/20 rounded-full px-4 py-2 mb-6">
                <Play className="w-4 h-4 mr-2 text-[#ec2e3a]" />
                <span className="text-sm font-medium text-[#ec2e3a]">How it works</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                From application to
                <span className="text-[#ec2e3a]"> visa approval</span>
                <br />in 3 minutes
              </h2>
              
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Watch how Sarah landed her dream job in Australia with visa sponsorship through our platform. 
                See the complete journey from profile creation to offer acceptance.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { icon: CheckCircle, text: "Complete profile in under 5 minutes" },
                  { icon: Target, text: "AI-powered job matching" },
                  { icon: Rocket, text: "Direct connection with hiring managers" },
                  { icon: Trophy, text: "Visa sponsorship guaranteed" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 bg-[#ec2e3a]/20 rounded-full flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-[#ec2e3a]" />
                    </div>
                    <span className="text-white/90">{item.text}</span>
                  </motion.div>
                ))}
              </div>
              
              <Button 
                className="bg-[#ec2e3a] hover:bg-[#ce0026] text-white px-8 py-6 text-lg rounded-[12px]"
                onClick={handleFindJobsClick}
              >
                Start your journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
            
            {/* Right: Video Player */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-[24px] p-8 backdrop-blur-sm border border-white/10">
                <div className="aspect-video bg-gradient-to-br from-[#ec2e3a]/20 to-[#e9357b]/20 rounded-[16px] relative overflow-hidden group cursor-pointer"
                     onClick={() => setShowVideoModal(true)}>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl"
                    >
                      <Play className="w-8 h-8 text-[#ec2e3a] ml-1" fill="currentColor" />
                    </motion.div>
                  </div>
                  
                  {/* Video stats overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/60 backdrop-blur-sm rounded-[8px] p-3">
                      <div className="flex items-center justify-between text-white text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span>3:24</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span>2.1M views</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                            <span>4.9</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Real-time application tracker */}
                <div className="mt-6 bg-black/20 rounded-[12px] p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white/90">Live Applications</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400">Live</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {realTimeApplications.slice(0, 3).map((app, appIndex) => (
                        <motion.div
                          key={`${app.name}-${app.time}`}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#ec2e3a]/20 to-[#e9357b]/20 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-white">
                                {app.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="text-white/90 font-medium">{app.name}</p>
                              <p className="text-white/60 text-xs">{app.role} at {app.company}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white/90">{app.country}</p>
                            <p className="text-white/60 text-xs">{app.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Video Modal */}
        <AnimatePresence>
          {showVideoModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setShowVideoModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="max-w-4xl w-full aspect-video bg-black rounded-[16px] overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
              >
                <iframe
                  src="https://youtu.be/Vg7HLm6ePXw"
                  title="How to land a visa-sponsored job"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 text-white hover:bg-white/20"
                  onClick={() => setShowVideoModal(false)}
                >
                  ✕
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Companies Section */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xl font-medium text-[#535353]">Trusted by global employers</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[
              "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
              "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Coinbase.svg/2560px-Coinbase.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1024px-OpenAI_Logo.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Vercel_logo_black.svg/1024px-Vercel_logo_black.svg.png"
            ].map((logo, index) => (
              <div key={index} className="w-24 h-12 md:w-32 md:h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                <img src={logo} alt="Company logo" className="max-h-full max-w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Statistics Section */}
      <section className="py-16 bg-gradient-to-br from-[#ec2e3a] to-[#e9357b] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            onViewportEnter={() => setStatsAnimated(true)}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our impact in numbers</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Real results from our global community of professionals and employers
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-white/20 rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4">
                {stats.jobs.toLocaleString()}+
              </div>
              <h3 className="text-lg font-semibold mb-1">Active Jobs</h3>
              <p className="text-white/70 text-sm">With visa sponsorship</p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-white/20 rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4">
                {stats.companies}+
              </div>
              <h3 className="text-lg font-semibold mb-1">Companies</h3>
              <p className="text-white/70 text-sm">Ready to hire globally</p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-white/20 rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4">
                {stats.placements.toLocaleString()}+
              </div>
              <h3 className="text-lg font-semibold mb-1">Successful Placements</h3>
              <p className="text-white/70 text-sm">With visa sponsorship</p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-white/20 rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4">
                {stats.countries}+
              </div>
              <h3 className="text-lg font-semibold mb-1">Countries</h3>
              <p className="text-white/70 text-sm">Where we&apos;ve placed talent</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Salary Calculator */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#051316] mb-4">Salary insights by location</h2>
            <p className="text-[#535353] max-w-2xl mx-auto">
              Compare salaries across different countries and see your earning potential with visa sponsorship
            </p>
          </motion.div>

          <div className="bg-gradient-to-br from-[#f5f4f5] to-white rounded-[24px] p-8 border border-[#e7e4e7]">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-[#051316] mb-6">Calculate your potential salary</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#051316] mb-2">Job Role</label>
                    <select className="w-full p-3 border border-[#e7e4e7] rounded-[12px] bg-white focus:ring-2 focus:ring-[#ec2e3a]/20 focus:border-[#ec2e3a] transition-colors">
                      <option>Software Engineer</option>
                      <option>Product Manager</option>
                      <option>Data Scientist</option>
                      <option>UX Designer</option>
                      <option>DevOps Engineer</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#051316] mb-2">Experience Level</label>
                    <select className="w-full p-3 border border-[#e7e4e7] rounded-[12px] bg-white focus:ring-2 focus:ring-[#ec2e3a]/20 focus:border-[#ec2e3a] transition-colors">
                      <option>Junior (0-2 years)</option>
                      <option>Mid-level (3-5 years)</option>
                      <option>Senior (6-8 years)</option>
                      <option>Lead (9+ years)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#051316] mb-2">Target Location</label>
                    <select className="w-full p-3 border border-[#e7e4e7] rounded-[12px] bg-white focus:ring-2 focus:ring-[#ec2e3a]/20 focus:border-[#ec2e3a] transition-colors">
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Germany</option>
                      <option>Netherlands</option>
                      <option>Australia</option>
                    </select>
                  </div>
                  
                  <Button 
                    className="w-full bg-[#ec2e3a] hover:bg-[#ce0026] text-white py-6 text-lg rounded-[12px] mt-6"
                    onClick={handleFindJobsClick}
                  >
                    Get Salary Estimate
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-[16px] p-6 border border-[#e7e4e7] shadow-sm">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-[#051316] mb-2">Estimated Salary Range</h4>
                  <p className="text-[#535353] text-sm">Software Engineer • Mid-level • United States</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-[#f5f4f5] rounded-[12px]">
                    <span className="text-[#535353]">Base Salary</span>
                    <span className="font-bold text-[#051316]">$140K - $180K</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-[#fff4f6] rounded-[12px]">
                    <span className="text-[#535353]">Total Compensation</span>
                    <span className="font-bold text-[#ec2e3a]">$180K - $240K</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-[#f6e2ed] rounded-[12px]">
                    <span className="text-[#535353]">Equity Range</span>
                    <span className="font-bold text-[#5b3353]">0.1% - 0.5%</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-[#ffdfda]/50 rounded-[12px] border border-[#ffdfda]">
                  <p className="text-sm text-[#051316]">
                    <strong>💡 Pro tip:</strong> Companies offering visa sponsorship often provide additional relocation packages worth $10K-$25K
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#f5f4f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#051316] mb-4">Why use VizzarJobs?</h2>
            <p className="text-[#535353] max-w-2xl mx-auto">
              We've simplified the process of finding international opportunities with visa sponsorship
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[16px] shadow-sm border border-[#e7e4e7]">
              <div className="bg-[#fff4f6] w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <Briefcase className="w-6 h-6 text-[#e9357b]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#051316]">Curated Jobs</h3>
              <p className="text-[#535353]">
                Every job on our platform comes with confirmed visa sponsorship, saving you time and uncertainty.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-[16px] shadow-sm border border-[#e7e4e7]">
              <div className="bg-[#ffdfda] w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-[#ec2e3a]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#051316]">Global Network</h3>
              <p className="text-[#535353]">
                Connect with companies in 15+ countries ready to sponsor talented professionals worldwide.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-[16px] shadow-sm border border-[#e7e4e7]">
              <div className="bg-[#f6e2ed] w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-[#5b3353]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#051316]">Visa Expertise</h3>
              <p className="text-[#535353]">
                Get guidance throughout the visa application process from initial offer to relocation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="py-20 bg-gradient-to-br from-[#f5f4f5] to-white relative overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#faccde]/20 rounded-full filter blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center bg-white rounded-full px-4 py-2 mb-6 shadow-sm">
              <Quote className="w-4 h-4 mr-2 text-[#ec2e3a]" />
              <span className="text-sm font-medium text-[#535353]">What our users say</span>
            </div>
            <h2 className="text-3xl font-bold text-[#051316] mb-4">Trusted by professionals worldwide</h2>
            <p className="text-[#535353] max-w-2xl mx-auto">
              See what our community has to say about landing their dream jobs with visa sponsorship
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[20px] p-8 shadow-lg border border-[#e7e4e7] relative group"
              >
                {/* Quote decoration */}
                <div className="absolute top-6 right-6 w-8 h-8 bg-[#ec2e3a]/10 rounded-full flex items-center justify-center">
                  <Quote className="w-4 h-4 text-[#ec2e3a]" />
                </div>
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-[#535353] leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                
                {/* Profile */}
                <div className="flex items-center">
                  <div className="relative">
                    <img 
                      src={testimonial.photo} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 text-lg">
                      {testimonial.flag}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-[#051316]">{testimonial.name}</h4>
                    <p className="text-sm text-[#535353]">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#ec2e3a]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[20px]"></div>
              </motion.div>
            ))}
          </div>
          
          {/* See more testimonials */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center mt-12"
          >
            <Button 
              variant="outline"
              className="border-[#ec2e3a] text-[#ec2e3a] hover:bg-[#ffdfda]/20"
              onClick={handleFindJobsClick}
            >
              <Users className="w-4 h-4 mr-2" />
              See more success stories
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#051316] mb-4">Browse by category</h2>
            <p className="text-[#535353] max-w-2xl mx-auto">
              Discover visa-sponsored opportunities across all major disciplines
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[16px] p-6 border border-[#e7e4e7] shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                onClick={handleFindJobsClick} // Add this to make each category clickable
              >
                <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-[#f5f4f5] group-hover:bg-[#ffdfda]/30 transition-colors"></div>
                
                <div className="relative">
                  <div className="text-2xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-[#051316] mb-1 group-hover:text-[#ec2e3a] transition-colors">{category.name}</h3>
                  <p className="text-sm text-[#737373]">{category.count} jobs</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <Button 
              variant="outline" 
              className="border-[#ec2e3a] text-[#ec2e3a] hover:bg-[#ffdfda]/20"
              onClick={handleFindJobsClick}
            >
              View all categories
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-[#f5f4f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#051316] mb-2">Featured jobs</h2>
              <p className="text-[#535353]">Handpicked opportunities with visa sponsorship</p>
            </div>
            <Button 
              variant="outline" 
              className="hidden sm:flex border-[#ec2e3a] text-[#ec2e3a] hover:bg-[#ffdfda]/20"
              onClick={handleFindJobsClick}
            >
              View all jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {featuredJobs.map((job) => (
              <motion.div
                key={job.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-[16px] p-6 border border-[#e7e4e7] shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={handleFindJobsClick} // Make jobs clickable
              >
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 rounded-[8px] overflow-hidden border border-[#e7e4e7] shadow-sm flex-shrink-0">
                    <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-[#051316] hover:text-[#ec2e3a] transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-[#ffdfda] text-[#ec2e3a] border-[#ffdfda]">
                          Visa Sponsor
                        </Badge>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent job click
                            toggleSaveJob(job.id);
                          }} 
                          className="text-[#737373] hover:text-[#ec2e3a]"
                        >
                          <Heart className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-[#ec2e3a] text-[#ec2e3a]' : ''}`} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-[#535353] text-sm mb-4">
                      <span className="font-medium">{job.company}</span>
                      <span className="mx-2 text-[#b1aeb1]">•</span>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{job.location}</span>
                      </div>
                      <span className="mx-2 text-[#b1aeb1]">•</span>
                      <span>{job.type}</span>
                      <span className="mx-2 text-[#b1aeb1]">•</span>
                      <span className="text-[#737373]">{job.posted}</span>
                    </div>
                    
                    <div className="flex items-center justify-between flex-wrap gap-y-2">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="font-medium text-[#051316] bg-[#f5f4f5] py-1 px-3 rounded-full">
                          {job.salary}
                        </span>
                        <span className="text-[#535353]">• {job.equity} equity</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {job.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="outline" className="bg-white text-[#535353] border-[#e7e4e7]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              className="bg-[#ec2e3a] hover:bg-[#ce0026] text-white px-8"
              onClick={handleFindJobsClick}
            >
              View all jobs
            </Button>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#051316] mb-4">Companies hiring with visa sponsorship</h2>
            <p className="text-[#535353] max-w-2xl mx-auto">
              From startups to enterprise, discover companies ready to sponsor your work visa
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {featuredCompanies.map((company) => (
              <motion.div
                key={company.id}
                variants={fadeIn}
                whileHover={{ y: -6 }}
                className="bg-white rounded-[16px] border border-[#e7e4e7] p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                onClick={handleFindJobsClick} // Make companies clickable
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-[8px] overflow-hidden border border-[#e7e4e7] shadow-sm">
                      <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#051316] group-hover:text-[#ec2e3a] transition-colors">
                        {company.name}
                      </h3>
                      <p className="text-sm text-[#737373]">{company.size}</p>
                    </div>
                  </div>
                  {company.featured && (
                    <Badge className="bg-[#fff4f6] text-[#e9357b] border-[#fce7f3]">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-3 mb-5">
                  <div className="flex items-center text-sm text-[#535353]">
                    <Building2 className="w-4 h-4 mr-2 text-[#737373]" />
                    <span>{company.industry}</span>
                  </div>
                  <div className="flex items-center text-sm text-[#535353]">
                    <Globe className="w-4 h-4 mr-2 text-[#737373]" />
                    <span>{company.locations.join(", ")}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-[#e7e4e7]">
                  <span className="text-sm font-medium text-[#ec2e3a]">{company.jobs} open roles</span>
                  <div className="bg-[#f5f4f5] group-hover:bg-[#ffdfda] rounded-full p-1 transition-colors">
                    <ChevronRight className="w-4 h-4 text-[#535353] group-hover:text-[#ec2e3a]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="border-[#ec2e3a] text-[#ec2e3a] hover:bg-[#ffdfda]/20"
              onClick={handleFindJobsClick}
            >
              View all companies
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-[#f5f4f5] relative overflow-hidden">
        <motion.div 
          className="absolute top-40 left-[15%] w-64 h-64 bg-[#faccde]/20 rounded-full filter blur-3xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#051316] mb-4">Success stories</h2>
            <p className="text-[#535353] max-w-2xl mx-auto">
              Real people who found international opportunities through our platform
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[16px] overflow-hidden shadow-md relative"
              >
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-2/5 relative overflow-hidden">
                    <img 
                      src={story.image} 
                      alt={`${story.name}'s journey`}
                      className="w-full h-64 md:h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#051316]/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <div className="flex items-center mb-2">
                        <img 
                          src={story.photo} 
                          alt={story.name} 
                          className="w-10 h-10 rounded-full border-2 border-white mr-3"
                        />
                        <div>
                          <p className="font-bold">{story.name}</p>
                          <p className="text-sm text-white/80">{story.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 md:w-3/5 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-[#051316] mb-1">
                      {story.company}
                    </h3>
                    <div className="flex items-center text-sm text-[#ec2e3a] mb-4">
                      <span className="font-medium">{story.fromCountry}</span>
                      <ArrowRight className="w-3 h-3 mx-2" />
                      <span className="font-medium">{story.toCountry}</span>
                    </div>
                    <p className="text-[#535353] mb-4">
                      "{story.name} was able to find a {story.role} position at {story.company} through VizzarJobs and successfully {story.story}. The visa process was streamlined thanks to our dedicated support team."
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-auto border-[#ec2e3a] text-[#ec2e3a] hover:bg-[#ffdfda]/20"
                      onClick={handleFindJobsClick}
                    >
                      Read full story
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#051316] mb-4">How it works</h2>
            <p className="text-[#535353] max-w-2xl mx-auto">
              Get your dream job with visa sponsorship in four simple steps
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-6">
            {[
              {
                step: "1",
                title: "Create profile",
                description: "Sign up and build your professional profile highlighting your skills and experience.",
                icon: <Users className="w-6 h-6 text-white" />,
                color: "bg-[#ec2e3a]"
              },
              {
                step: "2", 
                title: "Explore opportunities",
                description: "Browse jobs with confirmed visa sponsorship filtered by role, location and more.",
                icon: <Briefcase className="w-6 h-6 text-white" />,
                color: "bg-[#e9357b]"
              },
              {
                step: "3",
                title: "Apply & interview",
                description: "Apply directly to positions and receive support through the interview process.",
                icon: <Award className="w-6 h-6 text-white" />,
                color: "bg-[#5b3353]"
              },
              {
                step: "4",
                title: "Get hired & relocate",
                description: "Receive visa sponsorship guidance and support for your international move.",
                icon: <TrendingUp className="w-6 h-6 text-white" />,
                color: "bg-[#f4b640]"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex-1 bg-white rounded-[16px] border border-[#e7e4e7] p-6 relative"
              >
                <div className={`absolute top-0 left-8 w-10 h-10 -mt-5 ${item.color} rounded-full flex items-center justify-center text-white font-bold`}>
                  {item.step}
                </div>
                <div className="pt-6">
                  <div className={`w-14 h-14 ${item.color} rounded-[8px] flex items-center justify-center mb-5`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[#051316] mb-3">{item.title}</h3>
                  <p className="text-[#535353]">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#ec2e3a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to start your global career?</h2>
            <p className="text-xl text-[#ffdfda] mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who found their dream jobs with visa sponsorship through our platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white hover:bg-neutral-50 text-[#ec2e3a] px-8 py-6 text-lg rounded-[12px]"
                onClick={handleFindJobsClick}
              >
                Find visa-sponsored jobs
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-[12px]"
              >
                For employers
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center bg-[#f5f4f5] rounded-full px-4 py-2 mb-6">
              <MessageSquare className="w-4 h-4 mr-2 text-[#ec2e3a]" />
              <span className="text-sm font-medium text-[#535353]">Frequently Asked Questions</span>
            </div>
            <h2 className="text-3xl font-bold text-[#051316] mb-4">Got questions? We have answers</h2>
            <p className="text-[#535353] max-w-2xl mx-auto">
              Everything you need to know about finding visa-sponsored jobs and our platform
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-[#f5f4f5] rounded-[16px] overflow-hidden"
              >
                <button
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-[#eeeded] transition-colors"
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                >
                  <span className="font-semibold text-[#051316] pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFAQ === index ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[#ec2e3a] flex-shrink-0"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-[#535353] leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-[#535353] mb-6">Still have questions?</p>
            <Button 
              variant="outline"
              className="border-[#ec2e3a] text-[#ec2e3a] hover:bg-[#ffdfda]/20"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact our support team
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-[#051316] text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ec2e3a]/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#e9357b]/20 rounded-full filter blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Stay ahead of the curve</h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Get weekly insights on visa sponsorship trends, new job opportunities, and success stories delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email address"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-[#ec2e3a] text-[16px] py-6"
              />
              <Button 
                className="bg-[#ec2e3a] hover:bg-[#ce0026] text-white px-8 py-6 whitespace-nowrap"
                onClick={() => setEmailSubscribed(true)}
              >
                {emailSubscribed ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Subscribe
                  </>
                )}
              </Button>
            </div>
            
            {emailSubscribed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-500/20 rounded-[12px] border border-green-400/30"
              >
                <p className="text-green-300 text-sm font-medium">
                  🎉 Welcome aboard! Check your email for a welcome message with exclusive job opportunities.
                </p>
              </motion.div>
            )}
            
            <p className="text-white/60 text-sm mt-4">
              Join 50,000+ professionals. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white border-t border-[#e7e4e7] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <h3 className="font-bold text-[#ec2e3a] text-xl mb-6">VizzarJobs</h3>
              <p className="text-[#535353] text-sm leading-relaxed">
                The leading platform connecting international talent with visa-sponsoring companies worldwide.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-[#aaa1a9] hover:text-[#ec2e3a] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-[#aaa1a9] hover:text-[#ec2e3a] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-[#aaa1a9] hover:text-[#ec2e3a] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#051316] mb-6">For Job Seekers</h4>
              <ul className="space-y-3 text-sm text-[#535353]">
                <li><a href="#" className="hover:text-[#ec2e3a] transition-colors" onClick={handleFindJobsClick}>Browse Jobs</a></li>
                <li><a href="#" className="hover:text-[#ec2e3a] transition-colors">Salary Data</a></li>
                <li><a href="#" className="hover:text-[#ec2e3a] transition-colors">Visa Guide</a></li>
                <li><a href="#" className="hover:text-[#ec2e3a] transition-colors">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#051316] mb-6">For Companies</h4>
              <ul className="space-y-3 text-sm text-[#535353]">
                <li><a href="#" className="hover:text-[#ec2e3a] transition-colors">Post Jobs</a></li>
                <li><a href="#" className="hover:text-[#ec2e3a] transition-colors">Recruit</a></li>
                <li><a href="#" className="hover:text-[#ec2e3a] transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#051316] mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-[#535353]">
                <li><a href="#" className="hover:text-[#ec2e3a] transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[#ec2e3a] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#ec2e3a] transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-[#ec2e3a] transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#e7e4e7] mt-10 pt-8 text-center text-sm text-[#737373]">
            <p>&copy; 2025 VizzarJobs. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Sign In Modal */}
      {showSignIn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleOverlayClick}
        >
          <div className="relative">
            <SignIn
              signUpForceRedirectUrl="/jobs"
              fallbackRedirectUrl="/jobs"
              appearance={{
                elements: {
                  rootBox: "shadow-xl",
                  card: "shadow-xl rounded-[16px]",
                  headerTitle: "text-[#051316]",
                  headerSubtitle: "text-[#535353]",
                  formButtonPrimary: "bg-[#ec2e3a] hover:bg-[#ce0026]",
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, duration: 0.3 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Button
            className="w-16 h-16 rounded-full bg-[#ec2e3a] hover:bg-[#ce0026] text-white shadow-2xl border-4 border-white"
            onClick={handleFindJobsClick}
          >
            <div className="flex flex-col items-center">
              <Rocket className="w-6 h-6 mb-1" />
              <span className="text-xs font-bold">JOBS</span>
            </div>
          </Button>
          
          {/* Pulsing ring animation */}
          <div className="absolute inset-0 rounded-full bg-[#ec2e3a]/20 animate-ping"></div>
        </motion.div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-[#051316] text-white text-sm px-3 py-2 rounded-[8px] whitespace-nowrap">
            Find visa-sponsored jobs
            <div className="absolute top-full right-4 w-2 h-2 bg-[#051316] rotate-45 -mt-1"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;