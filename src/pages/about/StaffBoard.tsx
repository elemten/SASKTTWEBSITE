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
    name: "Huaifa Ishaq",
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
    name: "Attila Anyos",
    title: "VP Marketing",
    icon: TrendingUp,
    color: "text-green-600",
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
    name: "Murray Sproule",
    title: "VP Finance",
    icon: DollarSign,
    color: "text-green-700",
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
    url: "#", // Replace with actual PDF URL
    color: "text-green-600"
  },
  {
    title: "2022-2023 AGM Minutes",
    year: "2022-2023", 
    url: "#", // Replace with actual PDF URL
    color: "text-green-700"
  },
  {
    title: "2021-2022 AGM Minutes",
    year: "2021-2022",
    url: "#", // Replace with actual PDF URL
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
      <section className="bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Staff & Board
            </h1>
            <p className="text-xl text-green-100 leading-relaxed">
              Meet the dedicated team behind Table Tennis Saskatchewan. 
              Our staff and board members work tirelessly to promote and develop 
              table tennis across the province.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Staff Section */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Briefcase className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-3xl font-bold">Staff</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our professional staff members who manage daily operations and programs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {staffMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto w-16 h-16 rounded-full ${member.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <member.icon className={`h-8 w-8 ${member.color}`} />
                    </div>
                    <CardTitle className="text-lg font-semibold">
                      {member.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-sm">
                      {member.title}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-0 text-center">
                    <Button 
                      onClick={() => handleEmailClick(member.email)}
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {member.email}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Board Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-3xl font-bold">Board of Directors</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our volunteer board members who provide strategic leadership and governance
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {boardMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-md transition-all duration-300 group">
                  <CardContent className="p-4 text-center">
                    <div className={`mx-auto w-12 h-12 rounded-full ${member.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <member.icon className={`h-6 w-6 ${member.color}`} />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{member.name}</h3>
                    <Badge variant="outline" className="text-xs">
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
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-3xl font-bold">Activities</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Annual General Meeting minutes and organizational activities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {agmDocuments.map((doc, index) => (
              <motion.div
                key={doc.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <FileText className={`h-8 w-8 ${doc.color}`} />
                    </div>
                    <CardTitle className="text-lg font-semibold text-center">
                      AGM Minutes
                    </CardTitle>
                    <Badge variant="secondary">
                      {doc.year}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      onClick={() => handleDocumentClick(doc.url)}
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                    >
                      <Download className="h-4 w-4 mr-2" />
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