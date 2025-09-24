import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Users, 
  Trophy, 
  Clock, 
  MapPin, 
  Shield, 
  Activity,
  Brain,
  HandHeart,
  GraduationCap,
  Calendar,
  CheckCircle,
  Search,
  User,
  Phone,
  CreditCard,
  ArrowLeft,
  Check
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';

// Create a single Supabase client instance to avoid multiple GoTrueClient instances
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface MemberRecord {
  mem_number: string; // This is now the primary key
  name: string;
  email: string;
  phone: string;
  address: string;
  community: string;
  type: string;
  birthdate: string;
  age: number;
  gender: string;
  district: string;
  club: string;
  provincial_paid_year?: number;
  is_active_member?: boolean;
}

const TrainingSignup = () => {
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [memberRecords, setMemberRecords] = useState<MemberRecord[]>([]);
  const [searchResults, setSearchResults] = useState<MemberRecord[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(null);
  const [step, setStep] = useState<'email' | 'select-member' | 'payment-provincial' | 'payment-training' | 'success'>('email');
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessingSelection, setIsProcessingSelection] = useState(false);

  const currentYear = new Date().getFullYear();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Check URL parameters and localStorage for payment success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');
    const canceled = urlParams.get('canceled');

    // Check for provincial payment success (from localStorage)
    const pendingPayment = localStorage.getItem('pending_provincial_payment');
    if (pendingPayment && success) {
      const paymentData = JSON.parse(pendingPayment);
      // Set the member from stored data
      setSelectedMember({
        mem_number: paymentData.member_id,
        name: paymentData.member_name,
        email: paymentData.member_email,
        provincial_paid_year: paymentData.membership_year,
        is_active_member: true,
        // Add other required fields with defaults
        community: '',
        phone: '',
        address: '',
        type: '',
        birthdate: '',
        age: 0
      });
      setStep('success');
      localStorage.removeItem('pending_provincial_payment');
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (success === 'provincial' && sessionId) {
      // Legacy handling for Edge Function approach
      handlePaymentSuccess(sessionId);
    } else if (canceled === 'true') {
      setErrorMessage('Payment was canceled. Please try again.');
      setStep('payment-provincial');
    }
  }, []);

  const handlePaymentSuccess = async (sessionId: string) => {
    try {
      // Get payment details
      const { data: payment } = await supabase
        .from('provincial_payments')
        .select('*, all_members(*)')
        .eq('stripe_session_id', sessionId)
        .single();

      if (payment && payment.payment_status === 'completed') {
        setSelectedMember(payment.all_members);
        setStep('success');
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setErrorMessage('Payment verification failed. Please contact support.');
        setStep('payment-provincial');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setErrorMessage('Payment verification failed. Please contact support.');
      setStep('payment-provincial');
    }
  };

  // Live search function
  const performLiveSearch = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      // Search by email, name, or member number
      const { data, error } = await supabase
        .from('all_members')
        .select('*')
        .or(`email.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%,mem_number.ilike.%${searchTerm}%`)
        .limit(10);

      if (error) {
        console.error('Search error:', error);
        return;
      }

      setSearchResults(data || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error during live search:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performLiveSearch(email);
    }, 300); // 300ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [email]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const handleEmailSearch = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsSearching(true);
    setErrorMessage('');

    try {
      const { data, error } = await supabase
        .from('all_members')
        .select('*')
        .eq('email', email.toLowerCase().trim());

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data || data.length === 0) {
        // No records found - new member registration needed
        setStep('payment-provincial');
        setErrorMessage('No existing membership found. Please register as a new member first.');
      } else {
        // Records found - show selection
        setMemberRecords(data);
        setStep('select-member');
      }
    } catch (error) {
      console.error('Error searching for members:', error);
      setErrorMessage('Failed to search for member records. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleMemberSelect = (member: MemberRecord) => {
    setSelectedMember(member);
    setEmail(member.email); // Set the email in the input
    setShowDropdown(false); // Hide dropdown
    
    // Check if provincial membership is paid for current year
    if (member.provincial_paid_year === currentYear && member.is_active_member) {
      setStep('payment-training');
    } else {
      setStep('payment-provincial');
    }
  };

  const handleProvincialPayment = () => {
    if (!selectedMember) return;
    
    // Store member info in localStorage for post-payment processing
    localStorage.setItem('pending_provincial_payment', JSON.stringify({
      member_id: selectedMember.mem_number,
      member_name: selectedMember.name,
      member_email: selectedMember.email,
      membership_year: currentYear,
      timestamp: Date.now()
    }));
    
    // Create payment link with pre-filled customer data and metadata
    const paymentUrl = new URL("https://buy.stripe.com/5kQ9AU2N0eeIcSCfFWf3a04"); // Provincial membership $10 CAD
    
    // Pre-fill customer information
    paymentUrl.searchParams.set('prefilled_email', selectedMember.email);
    paymentUrl.searchParams.set('client_reference_id', selectedMember.mem_number);
    
    // Redirect to Stripe Payment Link with member data
    window.open(paymentUrl.toString(), "_blank");
  };

  const handleTrainingPayment = (option: any, period: 'monthly' | 'annual') => {
    if (!selectedMember) return;
    
    const amount = period === 'monthly' ? option.monthly : option.annual;
    const programName = `${option.title} - ${period === 'monthly' ? 'Monthly' : 'Annual'}`;
    
    // Store training payment info in localStorage
    localStorage.setItem('pending_training_payment', JSON.stringify({
      member_id: selectedMember.mem_number,
      member_name: selectedMember.name,
      member_email: selectedMember.email,
      program_name: programName,
      program_type: option.title,
      payment_period: period,
      amount: amount,
      timestamp: Date.now()
    }));
    
    // Training program payment links
    const paymentLinks = {
      'Group 1': {
        monthly: 'https://buy.stripe.com/9B614ocnA4E87yialCf3a00', // $70 CAD
        annual: 'https://buy.stripe.com/3cI00k0ESfiM3i22Taf3a02'   // $625 CAD
      },
      'Group 2': {
        monthly: 'https://buy.stripe.com/3cI5kE4V8b2w7yigK0f3a01', // $80 CAD
        annual: 'https://buy.stripe.com/eVq8wQgDQ4E88Cm9hyf3a03'   // $750 CAD
      },
      'Para': {
        monthly: 'https://buy.stripe.com/3cI8wQgDQgmQ9GqfFWf3a06', // $70 CAD
        annual: 'https://buy.stripe.com/00wbJ2gDQ3A405QctKf3a05'   // $625 CAD
      }
    };
    
    const paymentUrl = new URL(paymentLinks[option.title as keyof typeof paymentLinks][period]);
    
    // Pre-fill customer information
    paymentUrl.searchParams.set('prefilled_email', selectedMember.email);
    paymentUrl.searchParams.set('client_reference_id', `${selectedMember.mem_number}-${option.title.toLowerCase()}-${period}`);
    
    // Redirect to Stripe Payment Link
    window.open(paymentUrl.toString(), "_blank");
  };

  const handleDropdownMemberSelect = (member: MemberRecord) => {
    if (isProcessingSelection) return; // Prevent multiple clicks
    
    setIsProcessingSelection(true);
    setEmail(member.email);
    setShowDropdown(false);
    setSelectedMember(member);
    
    // Clear any previous error messages
    setErrorMessage('');
    
    // Small delay to show visual feedback
    setTimeout(() => {
      // Check if provincial membership is paid for current year
      if (member.provincial_paid_year === currentYear && member.is_active_member) {
        setStep('payment-training');
      } else {
        setStep('payment-provincial');
      }
      setIsProcessingSelection(false);
    }, 200);
  };

  const trainingOptions = [
    {
      title: "Group 1",
      monthly: 70,
      annual: 625,
      description: "Beginner to intermediate level training",
      features: ["2 sessions per week", "Basic technique development", "Group coaching"]
    },
    {
      title: "Group 2", 
      monthly: 80,
      annual: 750,
      description: "Advanced level training",
      features: ["3 sessions per week", "Advanced techniques", "Competition preparation"]
    },
    {
      title: "Para",
      monthly: 70,
      annual: 625,
      description: "Specialized training for para athletes",
      features: ["Adaptive coaching", "Specialized equipment", "Inclusive environment"]
    }
  ];

  const benefits = [
    {
      icon: Activity,
      title: "Professional Coaching",
      description: "Learn from certified coaches with years of competitive experience."
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Join a supportive community of table tennis enthusiasts."
    },
    {
      icon: Trophy,
      title: "Competition Ready",
      description: "Prepare for tournaments and competitive play at all levels."
    },
    {
      icon: Brain,
      title: "Skill Development",
      description: "Develop technical skills, strategy, and mental toughness."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white font-sora">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge 
              variant="secondary" 
              className="mb-4 md:mb-6 px-3 md:px-4 py-1 md:py-2 bg-green-100 text-green-800 border-green-200 text-xs md:text-sm"
            >
              <GraduationCap className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Training Registration
            </Badge>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              Start Your Training Journey
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-green-100 leading-relaxed px-2">
              Join Table Tennis Saskatchewan's professional training programs. 
              Whether you're a beginner or advanced player, we have the right program for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-900">Why Choose Our Training?</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Experience professional coaching, structured programs, and a supportive community.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Card className="p-4 sm:p-6 md:p-8 h-full hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <benefit.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 md:mb-4 text-gray-900">{benefit.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            
            {/* Step 1: Email Search */}
            {step === 'email' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-2 border-green-200 shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg md:text-xl">
                      <Mail className="h-5 w-5 mr-2 text-green-600" />
                      Find Your Membership
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative search-container">
                      <Label htmlFor="email">Search by email, name, or member number</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="text"
                          placeholder="Type to search... (e.g., john@email.com, John Smith, or 25-013)"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleEmailSearch()}
                          onFocus={() => email.length >= 2 && setShowDropdown(true)}
                        />
                        {isSearching && (
                          <div className="absolute right-3 top-3">
                            <Search className="h-4 w-4 animate-spin text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Live Search Dropdown */}
                      {showDropdown && searchResults.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                        >
                          {searchResults.map((member, index) => (
                            <motion.div
                              key={member.mem_number}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className={`p-3 md:p-4 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 ${
                                isProcessingSelection ? 'opacity-50 pointer-events-none' : ''
                              }`}
                              onClick={() => handleDropdownMemberSelect(member)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 text-sm md:text-base truncate">{member.name}</p>
                                  <p className="text-xs md:text-sm text-gray-600 truncate">{member.email}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Member #{member.mem_number} • {member.community}
                                  </p>
                                </div>
                                <Badge 
                                  variant={member.provincial_paid_year === currentYear ? "default" : "secondary"}
                                  className={`text-xs ml-2 flex-shrink-0 ${
                                    member.provincial_paid_year === currentYear 
                                      ? "bg-green-600 text-white" 
                                      : "bg-gray-200 text-gray-700"
                                  }`}
                                >
                                  {member.provincial_paid_year === currentYear ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                      
                      {/* No results message */}
                      {showDropdown && searchResults.length === 0 && email.length >= 2 && !isSearching && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-3 md:p-4"
                        >
                          <p className="text-gray-500 text-sm">No members found matching "{email}"</p>
                          <p className="text-xs text-gray-400 mt-1">Try searching by email, name, or member number</p>
                        </motion.div>
                      )}
                    </div>
                    
                    {errorMessage && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-700 text-sm">{errorMessage}</p>
                      </div>
                    )}
                    
                    <Button
                      onClick={handleEmailSearch}
                      disabled={isSearching}
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isSearching ? (
                        <>
                          <Search className="h-4 w-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Search Membership
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Member Selection */}
            {step === 'select-member' && memberRecords.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      Select Your Membership
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">
                      We found {memberRecords.length} membership record(s) for {email}:
                    </p>
                    
                    {memberRecords.map((member) => (
                      <div
                        key={member.mem_number}
                        className="border border-gray-200 rounded-lg p-4 hover:border-primary/50 cursor-pointer transition-colors"
                        onClick={() => handleMemberSelect(member)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-gray-600">
                              Member #{member.mem_number} • {member.phone}
                            </p>
                            <p className="text-sm text-gray-500">
                              {member.community} • {member.club}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={member.provincial_paid_year === currentYear ? "default" : "secondary"}
                            >
                              {member.provincial_paid_year === currentYear ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setStep('email')}
                      className="w-full"
                    >
                      Back to Email Search
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Provincial Payment */}
            {step === 'payment-provincial' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-primary" />
                      Provincial Membership Required
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedMember ? (
                      <p className="text-gray-600">
                        Hi {selectedMember.name}! Your provincial membership needs to be renewed for {currentYear}.
                      </p>
                    ) : (
                      <p className="text-gray-600">
                        To access training programs, you need to register as a member and pay the provincial membership fee.
                      </p>
                    )}
                    
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <h3 className="font-semibold text-primary mb-2">Provincial Membership</h3>
                      <p className="text-2xl font-bold mb-2">$10.00 <span className="text-sm font-normal text-gray-600">per year</span></p>
                      <p className="text-sm text-gray-600">Valid from September {currentYear} to August {currentYear + 1}</p>
                    </div>
                    
                    <Button 
                      onClick={handleProvincialPayment}
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Provincial Membership - $10.00 CAD
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => selectedMember ? setStep('select-member') : setStep('email')}
                      className="w-full"
                    >
                      Back
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Training Payment */}
            {step === 'payment-training' && selectedMember && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-primary" />
                      Choose Your Training Program
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-600">
                      Welcome {selectedMember.name}! Select your preferred training program:
                    </p>
                    
                    <div className="grid gap-4">
                      {trainingOptions.map((option) => (
                        <div key={option.title} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{option.title}</h3>
                              <p className="text-gray-600 text-sm">{option.description}</p>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <ul className="text-sm text-gray-600 space-y-1">
                              {option.features.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                  <CheckCircle className="h-3 w-3 text-primary mr-2" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1"
                              onClick={() => handleTrainingPayment(option, 'monthly')}
                            >
                              Monthly - ${option.monthly}
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => handleTrainingPayment(option, 'annual')}
                            >
                              Annual - ${option.annual}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setStep('select-member')}
                      className="w-full"
                    >
                      Back to Member Selection
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Success Step */}
            {step === 'success' && selectedMember && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-2 border-green-200 shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg md:text-xl text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Payment Successful!
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 md:p-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                          Provincial Membership Activated!
                        </h3>
                        <p className="text-green-700 text-sm">
                          Welcome {selectedMember.name}! Your provincial membership is now active 
                          for {currentYear}-{currentYear + 1}.
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li className="flex items-center">
                          <Check className="h-3 w-3 mr-2 text-blue-600" />
                          You can now register for training programs
                        </li>
                        <li className="flex items-center">
                          <Check className="h-3 w-3 mr-2 text-blue-600" />
                          Access to all sanctioned tournaments
                        </li>
                        <li className="flex items-center">
                          <Check className="h-3 w-3 mr-2 text-blue-600" />
                          Member-only events and discounts
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <Button 
                        onClick={() => setStep('payment-training')}
                        size="lg"
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        Continue to Training Registration
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => setStep('email')}
                        className="w-full"
                      >
                        Start Over
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TrainingSignup;
