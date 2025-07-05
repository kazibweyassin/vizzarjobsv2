import { useEffect, useState } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
  useClerk, // Added import for sign out functionality
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { 
  BriefcaseBusiness, 
  Heart, 
  PenBox, 
  Search, 
  Menu, 
  X,
  ChevronDown,
  Building2,
  Users,
  Briefcase,
  Bell,
  Settings,
  LogOut,
  User,
  Sparkles,
  TrendingUp,
  Zap,
  Globe,
  BookOpen
} from "lucide-react";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();
  const { signOut } = useClerk(); // Get the signOut function
  const location = useLocation();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  const isActive = (path) => location.pathname === path;

  const navigationLinks = [
    { href: "/jobs", label: "Browse Jobs", icon: Search, description: "Browse thousands of opportunities" },
    { href: "/companies", label: "Companies", icon: Building2, description: "Discover top employers" },
    { href: "/visa-guide", label: "Visa Guide", icon: Globe, description: "Learn about visa options" },
    { href: "/for-employers", label: "For Employers", icon: Briefcase, description: "Recruit global talent" },
  ];

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#e7e4e7] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#ec2e3a] shadow-sm">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                </div>
                <span className="text-xl font-bold text-[#ec2e3a]">VizzarJobs</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <div key={link.href} className="relative group">
                    <Link
                      to={link.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-[8px] text-sm font-medium transition-all duration-300 ${
                        isActive(link.href)
                          ? "bg-[#ec2e3a]/10 text-[#ec2e3a]"
                          : "text-[#535353] hover:text-[#ec2e3a]"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive(link.href) ? 'text-[#ec2e3a]' : 'text-[#535353]'}`} />
                      <span>{link.label}</span>
                    </Link>
                    
                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-[#051316] text-white text-xs rounded-[8px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      {link.description}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#051316] rotate-45"></div>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <SignedOut>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowSignIn(true)}
                  className="text-[#535353] hover:text-[#051316] hover:bg-[#f5f4f5] font-medium"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => setShowSignIn(true)}
                  className="bg-[#ec2e3a] hover:bg-[#ce0026] text-white font-medium shadow-sm"
                >
                  Get Started
                </Button>
              </SignedOut>
              
              <SignedIn>
                {/* Quick Action for Recruiters */}
                {user?.unsafeMetadata?.role === "recruiter" && (
                  <Link to="/post-job">
                    <Button className="bg-[#5b3353] hover:bg-[#502c4a] text-white font-medium shadow-sm">
                      <PenBox size={16} className="mr-2" />
                      Post Job
                    </Button>
                  </Link>
                )}
                
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative text-[#535353] hover:bg-[#f5f4f5] hover:text-[#ec2e3a]">
                  <Bell className="h-5 w-5" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#ec2e3a] rounded-full"></div>
                </Button>
                
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-3 p-2 hover:bg-[#f5f4f5] rounded-[12px]">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback className="bg-[#ec2e3a] text-white text-sm font-medium">
                          {user?.firstName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:block text-left">
                        <div className="text-sm font-medium text-[#051316]">{user?.firstName}</div>
                        <div className="text-xs text-[#535353]">{user?.unsafeMetadata?.role || "Member"}</div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-[#535353]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2">
                    <DropdownMenuLabel className="px-3 py-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.imageUrl} />
                          <AvatarFallback className="bg-[#ec2e3a] text-white">
                            {user?.firstName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-[#051316]">{user?.fullName}</p>
                          <p className="text-xs text-[#535353]">{user?.primaryEmailAddress?.emailAddress}</p>
                          {user?.unsafeMetadata?.role && (
                            <Badge variant="secondary" className="mt-1 text-xs bg-[#f5f4f5] text-[#535353]">
                              <Zap className="w-3 h-3 mr-1" />
                              {user.unsafeMetadata.role}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center px-3 py-2 text-[#535353] hover:text-[#ec2e3a]">
                        <User className="mr-3 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link to="/my-jobs" className="flex items-center px-3 py-2 text-[#535353] hover:text-[#ec2e3a]">
                        <BriefcaseBusiness className="mr-3 h-4 w-4" />
                        My Jobs
                        <Badge variant="outline" className="ml-auto text-xs border-[#e7e4e7]">3</Badge>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link to="/saved-jobs" className="flex items-center px-3 py-2 text-[#535353] hover:text-[#ec2e3a]">
                        <Heart className="mr-3 h-4 w-4" />
                        Saved Jobs
                        <Badge variant="outline" className="ml-auto text-xs border-[#e7e4e7]">12</Badge>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link to="/analytics" className="flex items-center px-3 py-2 text-[#535353] hover:text-[#ec2e3a]">
                        <TrendingUp className="mr-3 h-4 w-4" />
                        Analytics
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center px-3 py-2 text-[#535353] hover:text-[#ec2e3a]">
                        <Settings className="mr-3 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Fixed Sign Out Button */}
                    <DropdownMenuItem 
                      onClick={() => signOut()}
                      className="flex items-center px-3 py-2 text-[#535353] hover:text-[#ec2e3a] cursor-pointer"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SignedIn>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[#535353] hover:bg-[#f5f4f5] rounded-[12px]"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-[#e7e4e7] bg-white">
              <nav className="py-4 space-y-1">
                {navigationLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "bg-[#ec2e3a]/10 text-[#ec2e3a] mx-4 rounded-[12px]"
                          : "text-[#535353] hover:text-[#ec2e3a] hover:bg-[#f5f4f5] mx-4 rounded-[12px]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <div>
                        <span>{link.label}</span>
                        <div className="text-xs text-[#737373]">{link.description}</div>
                      </div>
                    </Link>
                  );
                })}
                
                <div className="px-6 py-4 border-t border-[#e7e4e7] mt-4">
                  <SignedOut>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full border-[#e7e4e7] text-[#535353] hover:bg-[#f5f4f5]"
                        onClick={() => {
                          setShowSignIn(true);
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                      <Button 
                        className="w-full bg-[#ec2e3a] hover:bg-[#ce0026] text-white"
                        onClick={() => {
                          setShowSignIn(true);
                          setMobileMenuOpen(false);
                        }}
                      >
                        Get Started
                      </Button>
                    </div>
                  </SignedOut>
                  
                  <SignedIn>
                    <div className="space-y-3">
                      {user?.unsafeMetadata?.role === "recruiter" && (
                        <Link to="/post-job" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full bg-[#5b3353] hover:bg-[#502c4a] text-white">
                            <PenBox size={16} className="mr-2" />
                            Post Job
                          </Button>
                        </Link>
                      )}
                      
                      <div className="flex items-center space-x-3 py-3 px-3 bg-[#f5f4f5] rounded-[12px]">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user?.imageUrl} />
                          <AvatarFallback className="bg-[#ec2e3a] text-white">
                            {user?.firstName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-[#051316]">{user?.fullName}</p>
                          <p className="text-xs text-[#535353]">{user?.primaryEmailAddress?.emailAddress}</p>
                          {user?.unsafeMetadata?.role && (
                            <Badge variant="secondary" className="mt-1 text-xs bg-white text-[#535353]">
                              {user.unsafeMetadata.role}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Link to="/my-jobs" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-[#535353] hover:text-[#ec2e3a] hover:bg-[#f5f4f5]">
                          <BriefcaseBusiness className="mr-2 h-4 w-4" />
                          My Jobs
                        </Button>
                      </Link>
                      
                      <Link to="/saved-jobs" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-[#535353] hover:text-[#ec2e3a] hover:bg-[#f5f4f5]">
                          <Heart className="mr-2 h-4 w-4" />
                          Saved Jobs
                        </Button>
                      </Link>
                      
                      <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-[#535353] hover:text-[#ec2e3a] hover:bg-[#f5f4f5]">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                      </Link>
                      
                      {/* Add mobile sign out button */}
                      <Button 
                        variant="ghost" 
                        onClick={() => signOut()}
                        className="w-full justify-start text-[#535353] hover:text-[#ec2e3a] hover:bg-[#f5f4f5]"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </SignedIn>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Sign In Modal */}
      {showSignIn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleOverlayClick}
        >
          <div className="relative">
            <SignIn
              signUpForceRedirectUrl="/onboarding"
              fallbackRedirectUrl="/onboarding"
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
    </>
  );
};

export default Header;