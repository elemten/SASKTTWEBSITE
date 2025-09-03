import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserCheck, 
  Mail, 
  FileText, 
  Download,
  Crown,
  Briefcase,
  Target,
  DollarSign,
  TrendingUp,
  Calendar
} from "lucide-react";

const staffMembers = [
  {
    name: "Huan Ye",
    title: "Provincial Technical Coach",
    email: "coach@ttsask.ca",
    icon: Target,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    name: "Huzaifa Ishaq",
    title: "Office Administrator", 
    email: "info@ttsask.ca",
    icon: Briefcase,
    color: "text-green-700",
    bgColor: "bg-green-50"
  }
];

const boardMembers = [
  {
    name: "Robby Chan",
    title: "President",
    icon: Crown,
    color: "text-green-700",
    bgColor: "bg-green-50"
  },
  {
    name: "Murray Sproule",
    title: "VP Finance",
    icon: DollarSign,
    color: "text-green-700",
    bgColor: "bg-green-50"
  },
  {
    name: "Arun Kumar Sekaran",
    title: "VP Technical",
    icon: Target,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    name: "Attila Anyos",
    title: "VP Marketing",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50"
        
  },
  {
    name: "Phil Duke",
    title: "Board Member",
    icon: UserCheck,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    name: "Edward Hung",
    title: "Board Member",
    icon: UserCheck,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    name: "Bob Lucky",
    title: "Board Member",
    icon: UserCheck,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    name: "Mark Wang",
    title: "Board Member",
    icon: UserCheck,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    name: "Charles Woo",
    title: "Board Member",
    icon: UserCheck,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    name: "Chuling Ye",
    title: "Board Member",
    icon: UserCheck,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    name: "Yichao Wu",
    title: "Board Member",
    icon: UserCheck,
    color: "text-green-600",
    bgColor: "bg-green-50"
  }
];

const agmDocuments = [
  {
    title: "2023-2024 AGM Minutes",
    year: "2023-2024",
    url: "/documents/agm/2023-2024-agm-minutes.pdf",
    color: "text-green-600"
  },
  {
    title: "2022-2023 AGM Minutes",
    year: "2022-2023", 
    url: "/documents/agm/2022-2023-agm-minutes.pdf",
    color: "text-green-700"
  },
  {
    title: "2021-2022 AGM Minutes",
    year: "2021-2022",
    url: "/documents/agm/2021-2022-agm-minutes.pdf",
    color: "text-green-600"
  }
];

const StaffBoard = () => {
  const handleDocumentClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="min-h-screen">
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              Staff & Board
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-green-100 leading-relaxed px-2">
              Meet the dedicated team behind Table Tennis Saskatchewan. 
              Our staff and board members work tirelessly to promote and develop 
              table tennis across the province.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Staff Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-green-100 rounded-2xl text-green-700 mr-4 shadow-md">
                <Briefcase className="h-8 w-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Staff</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Our professional staff members who manage daily operations and programs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {staffMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                  <CardHeader className="text-center pb-6">
                    <div className={`mx-auto w-20 h-20 rounded-2xl ${member.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <member.icon className={`h-10 w-10 ${member.color}`} />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-3 text-center">
                      {member.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-sm px-4 py-2 bg-green-100 text-green-800 border-green-200 text-center">
                      {member.title}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-0 text-center">
                    <div 
                      onClick={() => handleEmailClick(member.email)}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer relative"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Mail className="h-5 w-5 mr-2" />
                        <span>{member.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Board Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-green-100 rounded-2xl text-green-700 mr-4 shadow-md">
                <Users className="h-8 w-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Board of Directors</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Our volunteer board members who provide strategic leadership and governance
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boardMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group border-0 bg-white/80 backdrop-blur-sm shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className={`mx-auto w-16 h-16 rounded-2xl ${member.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <member.icon className={`h-8 w-8 ${member.color}`} />
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-gray-900">{member.name}</h3>
                    <Badge variant="outline" className="text-sm bg-green-50 text-green-700 border-green-200 px-3 py-1">
                      {member.title}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AGM Documents */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-green-100 rounded-2xl text-green-700 mr-4 shadow-md">
                <Calendar className="h-8 w-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Activities</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Annual General Meeting minutes and organizational activities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {agmDocuments.map((doc, index) => (
              <motion.div
                key={doc.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                  <CardHeader className="text-center pb-6">
                    <div className="mx-auto w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <FileText className="h-10 w-10 text-green-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-3">
                      AGM Minutes
                    </CardTitle>
                    <Badge variant="secondary" className="text-sm px-4 py-2 bg-green-100 text-green-800 border-green-200">
                      {doc.year}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      onClick={() => handleDocumentClick(doc.url)}
                      variant="outline"
                      size="lg"
                      className="w-full group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      View Minutes
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StaffBoard;