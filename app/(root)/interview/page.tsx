"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const InterviewPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Interview types
  const interviewTypes = [
    {
      id: 'technical',
      title: 'Technical Interview',
      description: 'Practice coding problems and system design questions',
      icon: '/icons/code.svg',
    },
    {
      id: 'behavioral',
      title: 'Behavioral Interview',
      description: 'Prepare for questions about your past experiences',
      icon: '/icons/chat.svg',
    },
    {
      id: 'problem-solving',
      title: 'Problem Solving',
      description: 'Demonstrate your analytical and critical thinking skills',
      icon: '/icons/brain.svg',
    },
  ];

  // Role options
  const roleOptions = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Engineer',
    'DevOps Engineer',
    'Data Scientist',
    'UI/UX Designer',
    'Product Manager',
    'Software Engineer',
  ];

  // Tech stack options
  const techStackOptions = [
    'React',
    'Angular',
    'Vue',
    'Node.js',
    'Python',
    'Java',
    'C#',
    'Ruby',
    'PHP',
    'Go',
    'TypeScript',
    'JavaScript',
  ];

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleTechStackSelect = (tech: string) => {
    if (selectedTechStack.includes(tech)) {
      setSelectedTechStack(selectedTechStack.filter(item => item !== tech));
    } else {
      setSelectedTechStack([...selectedTechStack, tech]);
    }
  };

  const handleNext = () => {
    if (step === 1 && !selectedType) {
      alert('Please select an interview type');
      return;
    }
    if (step === 2 && !selectedRole) {
      alert('Please select a role');
      return;
    }
    if (step === 3 && selectedTechStack.length === 0) {
      alert('Please select at least one technology');
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save interview data to session storage for the confirmation page
      sessionStorage.setItem('interviewData', JSON.stringify({
        type: selectedType,
        role: selectedRole,
        techstack: selectedTechStack,
      }));

      // Navigate to confirmation page
      router.push('/interview/confirmation');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-gradient text-3xl font-bold">New Interview</h1>
          <div className="flex items-center gap-4">
            <Button asChild className="glass-effect text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all">
              <Link href="/">Cancel</Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="relative size-20">
            <div className="absolute inset-0 rounded-full bg-purple-600/20 animate-ping"></div>
            <div className="relative size-full rounded-full border-2 border-t-purple-500 border-r-purple-400 border-b-purple-300 border-l-transparent animate-spin"></div>
          </div>
          <p className="text-gray-300 font-medium">Loading interview options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-gradient text-3xl font-bold">New Interview</h1>
        <div className="flex items-center gap-4">
          <Button onClick={handleBack} className="glass-effect text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all">
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-white/5 shadow-lg mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 opacity-50 rounded-xl"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex flex-col items-center gap-2">
            <div className={`rounded-full size-10 flex items-center justify-center shadow-lg ${
              step >= 1
                ? 'bg-gradient-to-br from-purple-600 to-purple-800 text-white'
                : 'bg-gray-800 text-gray-400 border border-white/5'
            }`}>
              {step > 1 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : '1'}
            </div>
            <span className={`font-medium ${step >= 1 ? 'text-white' : 'text-gray-400'}`}>Type</span>
          </div>

          <div className="relative">
            <div className={`h-1 w-24 flex-shrink-0 rounded-full ${step >= 2 ? 'bg-purple-600' : 'bg-gray-800'}`}></div>
            {step >= 2 && (
              <div className="absolute top-0 left-0 h-1 w-24 rounded-full bg-purple-400 opacity-50 animate-pulse"></div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className={`rounded-full size-10 flex items-center justify-center shadow-lg ${
              step >= 2
                ? 'bg-gradient-to-br from-purple-600 to-purple-800 text-white'
                : 'bg-gray-800 text-gray-400 border border-white/5'
            }`}>
              {step > 2 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : '2'}
            </div>
            <span className={`font-medium ${step >= 2 ? 'text-white' : 'text-gray-400'}`}>Role</span>
          </div>

          <div className="relative">
            <div className={`h-1 w-24 flex-shrink-0 rounded-full ${step >= 3 ? 'bg-purple-600' : 'bg-gray-800'}`}></div>
            {step >= 3 && (
              <div className="absolute top-0 left-0 h-1 w-24 rounded-full bg-purple-400 opacity-50 animate-pulse"></div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className={`rounded-full size-10 flex items-center justify-center shadow-lg ${
              step >= 3
                ? 'bg-gradient-to-br from-purple-600 to-purple-800 text-white'
                : 'bg-gray-800 text-gray-400 border border-white/5'
            }`}>
              3
            </div>
            <span className={`font-medium ${step >= 3 ? 'text-white' : 'text-gray-400'}`}>Tech Stack</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Interview Options */}
        <div className="animate-fadeIn">
          {step === 1 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-600/20 rounded-lg p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white">Select Interview Type</h2>
              </div>
              <p className="text-gray-400 mb-6">Choose the type of interview you want to practice</p>

              <div className="grid grid-cols-1 gap-5">
                {interviewTypes.map((option) => (
                  <button
                    key={option.id}
                    className={`relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center gap-5 border ${selectedType === option.id ? 'border-purple-500 shadow-[0_0_15px_rgba(124,58,237,0.3)]' : 'border-white/5'}`}
                    onClick={() => handleTypeSelect(option.id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

                    <div className={`rounded-xl bg-gradient-to-br ${
                      option.id === 'technical' ? 'from-purple-600/20 to-purple-800/20' :
                      option.id === 'behavioral' ? 'from-blue-600/20 to-blue-800/20' :
                      'from-green-600/20 to-green-800/20'
                    } p-4 text-white relative z-10 shadow-lg`}>
                      <Image src={option.icon} alt={option.title} width={28} height={28} />
                    </div>

                    <div className="flex-1 relative z-10">
                      <h3 className="text-xl font-semibold text-white mb-1">{option.title}</h3>
                      <p className="text-gray-400">{option.description}</p>
                    </div>

                    <div className={`size-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      selectedType === option.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 border border-white/10'
                    }`}>
                      {selectedType === option.id ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-600/20 rounded-lg p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white">Select Role</h2>
              </div>
              <p className="text-gray-400 mb-6">Choose the role you want to practice interviewing for</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roleOptions.map((role) => (
                  <button
                    key={role}
                    className={`relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center gap-4 border ${selectedRole === role ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-white/5'}`}
                    onClick={() => handleRoleSelect(role)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

                    <div className={`rounded-full bg-gradient-to-br from-blue-600/20 to-blue-800/20 p-3 text-white relative z-10 shadow-lg ${selectedRole === role ? 'animate-pulse-slow' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                        <path d="M20 7h-3a2 2 0 0 1-2-2V2"></path>
                        <path d="M16 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7"></path>
                      </svg>
                    </div>

                    <div className="flex-1 relative z-10 text-center">
                      <h3 className="text-lg font-semibold text-white">{role}</h3>
                    </div>

                    {selectedRole === role && (
                      <div className="absolute bottom-2 right-2 bg-blue-600 rounded-full p-1 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-600/20 rounded-lg p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white">Select Tech Stack</h2>
              </div>
              <p className="text-gray-400 mb-6">Choose the technologies you want to be interviewed on (select multiple)</p>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-white/5 shadow-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white font-medium">Selected: <span className="text-green-400">{selectedTechStack.length}</span> technologies</p>

                  {selectedTechStack.length > 0 && (
                    <button
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                      onClick={() => setSelectedTechStack([])}
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTechStack.length > 0 ? (
                    selectedTechStack.map((tech) => (
                      <div key={tech} className="bg-green-600/20 text-green-400 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                        {tech}
                        <button
                          className="hover:bg-green-600/30 rounded-full p-0.5 transition-colors"
                          onClick={() => handleTechStackSelect(tech)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic text-sm">No technologies selected yet</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {techStackOptions.map((tech) => (
                  <button
                    key={tech}
                    className={`relative overflow-hidden rounded-xl p-4 transition-all duration-200 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center border ${
                      selectedTechStack.includes(tech)
                        ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                        : 'border-white/5 hover:border-white/10'
                    }`}
                    onClick={() => handleTechStackSelect(tech)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-blue-600/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="flex items-center gap-2 relative z-10">
                      {selectedTechStack.includes(tech) && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                      <span className={`font-medium ${selectedTechStack.includes(tech) ? 'text-green-400' : 'text-white'}`}>{tech}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-end mt-8">
            <Button
              onClick={handleNext}
              className={`purple-gradient text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:opacity-90 hover:shadow-purple-500/20 hover:shadow-lg shadow-md flex items-center gap-2 group ${
                (step === 1 && !selectedType) ||
                (step === 2 && !selectedRole) ||
                (step === 3 && selectedTechStack.length === 0)
                  ? 'opacity-70 cursor-not-allowed'
                  : ''
              }`}
              disabled={(step === 1 && !selectedType) || (step === 2 && !selectedRole) || (step === 3 && selectedTechStack.length === 0)}
            >
              {step === 3 ? 'Continue to Interview' : 'Next Step'}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Button>
          </div>
        </div>

        {/* Right Column - AI Assistant */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-white/5 shadow-lg flex flex-col h-full">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center h-full">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-md"></div>
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-2 rounded-full border border-white/10 shadow-xl">
                <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-300">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3">AI Interview Assistant</h3>
            <div className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium mb-6">
              Step {step} of 3
            </div>

            {step === 1 && (
              <p className="text-gray-300 mb-6">Select an interview type to begin your practice session</p>
            )}
            {step === 2 && (
              <p className="text-gray-300 mb-6">Choose the role you want to practice interviewing for</p>
            )}
            {step === 3 && (
              <p className="text-gray-300 mb-6">Select the technologies you're familiar with for your interview</p>
            )}

            {/* Show selected options */}
            {(selectedType || selectedRole || selectedTechStack.length > 0) && (
              <div className="mt-4 w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-left border border-white/5 shadow-lg">
                <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Your Interview Setup
                </h4>
                <ul className="space-y-4">
                  {selectedType && (
                    <li className="flex items-start gap-3">
                      <div className={`rounded-lg p-2 ${
                        selectedType === 'technical' ? 'bg-purple-600/20' :
                        selectedType === 'behavioral' ? 'bg-blue-600/20' :
                        'bg-green-600/20'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={
                          selectedType === 'technical' ? 'text-purple-400' :
                          selectedType === 'behavioral' ? 'text-blue-400' :
                          'text-green-400'
                        }>
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Interview Type</span>
                        <p className="text-white font-medium">{interviewTypes.find(t => t.id === selectedType)?.title}</p>
                      </div>
                    </li>
                  )}
                  {selectedRole && (
                    <li className="flex items-start gap-3">
                      <div className="bg-blue-600/20 rounded-lg p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Role</span>
                        <p className="text-white font-medium">{selectedRole}</p>
                      </div>
                    </li>
                  )}
                  {selectedTechStack.length > 0 && (
                    <li className="flex items-start gap-3">
                      <div className="bg-green-600/20 rounded-lg p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                        </svg>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Tech Stack</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedTechStack.map(tech => (
                            <span key={tech} className="bg-green-600/10 text-green-400 px-2 py-0.5 rounded-full text-xs font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </li>
                  )}
                </ul>

                {step === 3 && selectedType && selectedRole && selectedTechStack.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <p className="text-gray-300 text-sm">Your interview is ready! Click "Continue to Interview" to start your practice session.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
