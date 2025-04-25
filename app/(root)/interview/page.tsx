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
          <h1 className="text-3xl font-bold text-white">New Interview</h1>
          <div className="flex items-center gap-4">
            <Button asChild className="btn-secondary">
              <Link href="/">Cancel</Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">New Interview</h1>
        <div className="flex items-center gap-4">
          <Button onClick={handleBack} className="btn-secondary">
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className={`rounded-full size-8 flex items-center justify-center ${step >= 1 ? 'bg-primary-200 text-dark-100' : 'bg-dark-200 text-light-400'}`}>
            {step > 1 ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : '1'}
          </div>
          <span className={step >= 1 ? 'text-white' : 'text-light-400'}>Type</span>
        </div>
        <div className={`h-0.5 w-16 flex-shrink-0 ${step >= 2 ? 'bg-primary-200' : 'bg-dark-200'}`}></div>
        <div className="flex items-center gap-2">
          <div className={`rounded-full size-8 flex items-center justify-center ${step >= 2 ? 'bg-primary-200 text-dark-100' : 'bg-dark-200 text-light-400'}`}>
            {step > 2 ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : '2'}
          </div>
          <span className={step >= 2 ? 'text-white' : 'text-light-400'}>Role</span>
        </div>
        <div className={`h-0.5 w-16 flex-shrink-0 ${step >= 3 ? 'bg-primary-200' : 'bg-dark-200'}`}></div>
        <div className="flex items-center gap-2">
          <div className={`rounded-full size-8 flex items-center justify-center ${step >= 3 ? 'bg-primary-200 text-dark-100' : 'bg-dark-200 text-light-400'}`}>
            3
          </div>
          <span className={step >= 3 ? 'text-white' : 'text-light-400'}>Tech Stack</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Interview Options */}
        <div className="animate-fadeIn">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold text-white mb-6">Select Interview Type</h2>
              <div className="grid grid-cols-1 gap-4">
                {interviewTypes.map((option) => (
                  <button
                    key={option.id}
                    className={`relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(202,197,254,0.15)] hover:translate-y-[-5px] bg-dark-200 flex items-center gap-4 ${selectedType === option.id ? 'border border-primary-200' : 'border border-transparent'}`}
                    onClick={() => handleTypeSelect(option.id)}
                  >
                    <div className="rounded-full bg-primary-200/20 p-3 text-primary-200">
                      <Image src={option.icon} alt={option.title} width={24} height={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">{option.title}</h3>
                      <p className="text-sm text-light-400">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold text-white mb-6">Select Role</h2>
              <div className="grid grid-cols-1 gap-4">
                {roleOptions.map((role) => (
                  <button
                    key={role}
                    className={`relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(202,197,254,0.15)] hover:translate-y-[-5px] bg-dark-200 flex items-center gap-4 ${selectedRole === role ? 'border border-primary-200' : 'border border-transparent'}`}
                    onClick={() => handleRoleSelect(role)}
                  >
                    <div className="rounded-full bg-primary-200/20 p-3 text-primary-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200">
                        <path d="M20 7h-3a2 2 0 0 1-2-2V2"></path>
                        <path d="M16 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">{role}</h3>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-semibold text-white mb-6">Select Tech Stack</h2>
              <p className="text-light-400 mb-4">Choose the technologies you want to be interviewed on</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {techStackOptions.map((tech) => (
                  <button
                    key={tech}
                    className={`rounded-xl p-4 transition-all duration-300 bg-dark-200 flex items-center justify-center ${selectedTechStack.includes(tech) ? 'border border-primary-200' : 'border border-transparent'}`}
                    onClick={() => handleTechStackSelect(tech)}
                  >
                    <span className="text-white">{tech}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-end mt-8">
            <Button onClick={handleNext} className="btn-primary flex items-center gap-2">
              {step === 3 ? 'Continue' : 'Next'}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Button>
          </div>
        </div>

        {/* Right Column - AI Assistant */}
        <div className="bg-dark-200 rounded-xl p-8 flex flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            <div className="w-[120px] h-[120px] rounded-full bg-primary-200/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">AI Interview Assistant</h3>
          {step === 1 && (
            <p className="text-light-100 mb-6">Select an interview type to begin your practice session</p>
          )}
          {step === 2 && (
            <p className="text-light-100 mb-6">Choose the role you want to practice interviewing for</p>
          )}
          {step === 3 && (
            <p className="text-light-100 mb-6">Select the technologies you're familiar with for your interview</p>
          )}

          {/* Show selected options */}
          {(selectedType || selectedRole || selectedTechStack.length > 0) && (
            <div className="mt-4 w-full bg-dark-300 rounded-lg p-4 text-left">
              <h4 className="text-white font-medium mb-2">Your Selections:</h4>
              <ul className="space-y-2">
                {selectedType && (
                  <li className="text-light-100">
                    <span className="text-primary-200 font-medium">Type:</span> {interviewTypes.find(t => t.id === selectedType)?.title}
                  </li>
                )}
                {selectedRole && (
                  <li className="text-light-100">
                    <span className="text-primary-200 font-medium">Role:</span> {selectedRole}
                  </li>
                )}
                {selectedTechStack.length > 0 && (
                  <li className="text-light-100">
                    <span className="text-primary-200 font-medium">Tech Stack:</span> {selectedTechStack.join(', ')}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
