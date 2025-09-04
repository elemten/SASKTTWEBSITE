import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { SupportedBySection } from "@/components/supported-by-section";
import SmartBookingForm from "@/components/booking/SmartBookingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SPED = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 text-green-700 border-green-300">
              Special Education Program
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              SPED Table Tennis Program
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Inclusive table tennis training designed specifically for students with special needs. 
              Building confidence, coordination, and community through sport.
            </p>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  What is the SPED Program?
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our Special Education Table Tennis Program is designed to provide inclusive, 
                  adaptive table tennis training for students with diverse learning needs. 
                  We focus on building fundamental skills while fostering social interaction 
                  and physical development.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-gray-600">Adaptive equipment and teaching methods</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-gray-600">Small group sessions for personalized attention</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-gray-600">Certified instructors with special education experience</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-gray-600">Focus on fun, confidence, and skill development</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-8">
                <img 
                  src="/sped.png" 
                  alt="SPED Program" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Program Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700">Physical Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Improves hand-eye coordination, balance, and motor skills through 
                    structured table tennis activities.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700">Social Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Encourages teamwork, communication, and positive social interaction 
                    in a supportive environment.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700">Confidence Building</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Builds self-esteem and confidence through achievable goals and 
                    positive reinforcement.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Register for SPED Program
              </h2>
              <p className="text-lg text-gray-600">
                Complete the form below to register your students for our Special Education Table Tennis Program.
              </p>
            </div>
            <SmartBookingForm />
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Program Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Session Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Duration</h4>
                    <p className="text-gray-600">1.5 hours per session</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Group Size</h4>
                    <p className="text-gray-600">Maximum 8 students per group</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Equipment</h4>
                    <p className="text-gray-600">All equipment provided</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Age Range</h4>
                    <p className="text-gray-600">Ages 6-18</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Medical Clearance</h4>
                    <p className="text-gray-600">Required for participation</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Parent/Guardian</h4>
                    <p className="text-gray-600">Must be present during sessions</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <SupportedBySection />
      <Footer />
    </div>
  );
};

export default SPED;
