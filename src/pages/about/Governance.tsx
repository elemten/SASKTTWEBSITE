import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Shield, 
  Scale, 
  ExternalLink, 
  AlertTriangle,
  Globe,
  Building,
  BookOpen,
  Download
} from "lucide-react";

const governanceDocuments = [
  {
    title: "Bylaws",
    description: "Official bylaws and constitutional documents governing Table Tennis Saskatchewan",
    icon: Scale,
    type: "pdf",
    url: "#", // Replace with actual PDF URL
    color: "text-green-600"
  },
  {
    title: "Policies & Procedures",
    description: "Comprehensive policies and procedures governing our operations and activities",
    icon: FileText,
    type: "pdf",
    url: "#", // Replace with actual PDF URL
    color: "text-green-600"
  },
  {
    title: "Safe Sport Policy Manual",
    description: "Our commitment to creating a safe and inclusive environment for all participants",
    icon: Shield,
    type: "pdf",
    url: "#", // Replace with actual PDF URL
    color: "text-green-700"
  },
  {
    title: "Table Tennis Canada",
    description: "Information about our national governing body and related policies",
    icon: Building,
    type: "external",
    url: "https://www.tabletennis.ca/", // Replace with actual URL
    color: "text-green-600"
  },
  {
    title: "International Table Tennis Federation",
    description: "ITTF rules, regulations, and international standards we follow",
    icon: Globe,
    type: "external",
    url: "https://www.ittf.com/", // Replace with actual URL
    color: "text-green-700"
  },
  {
    title: "ITTF Statutes",
    description: "Official statutes and governing documents from the International Table Tennis Federation",
    icon: BookOpen,
    type: "pdf",
    url: "#", // Replace with actual PDF URL
    color: "text-green-600"
  },
  {
    title: "Report a Complaint",
    description: "Submit complaints, concerns, or incidents through our official reporting process",
    icon: AlertTriangle,
    type: "form",
    url: "/contact", // Internal link to contact form
    color: "text-green-700"
  }
];

const Governance = () => {
  const handleDocumentClick = (doc: typeof governanceDocuments[0]) => {
    if (doc.type === 'external') {
      window.open(doc.url, '_blank', 'noopener,noreferrer');
    } else if (doc.type === 'pdf') {
      window.open(doc.url, '_blank');
    } else if (doc.type === 'form') {
      window.location.href = doc.url;
    }
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
              Governance & Policies
            </h1>
            <p className="text-xl text-green-100 leading-relaxed">
              Access our organizational documents, policies, and governance resources. 
              We maintain transparency and accountability through comprehensive documentation 
              and adherence to national and international standards.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Governance Documents</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Click on any document below to view or download. External links will open in a new tab.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {governanceDocuments.map((doc, index) => (
              <motion.div
                key={doc.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <doc.icon className={`h-8 w-8 ${doc.color}`} />
                    </div>
                    <CardTitle className="text-lg font-semibold text-center">
                      {doc.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-6 text-center leading-relaxed">
                      {doc.description}
                    </p>
                    <Button 
                      onClick={() => handleDocumentClick(doc)}
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                    >
                      {doc.type === 'pdf' && (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          View PDF
                        </>
                      )}
                      {doc.type === 'external' && (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Website
                        </>
                      )}
                      {doc.type === 'form' && (
                        <>
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Submit Report
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-6">Questions About Our Governance?</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                If you have questions about our policies, procedures, or governance structure, 
                please don't hesitate to contact us. We're committed to transparency and 
                accountability in all our operations.
              </p>
              <Button asChild size="lg">
                <a href="/contact">
                  Contact Us
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Governance;