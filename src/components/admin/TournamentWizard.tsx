import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Trophy, Calendar, MapPin, Users, DollarSign, Settings, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface TournamentData {
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  address: string;
  maxParticipants: number;
  registrationFee: number;
  prizePool: number;
  format: string;
  categories: string[];
  eligibleClubs: string[];
  registrationDeadline: string;
  contactEmail: string;
  contactPhone: string;
  rules: string;
  equipment: string;
  medical: boolean;
  insurance: boolean;
  catering: boolean;
  parking: boolean;
}

const initialData: TournamentData = {
  name: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  venue: "",
  address: "",
  maxParticipants: 64,
  registrationFee: 0,
  prizePool: 0,
  format: "",
  categories: [],
  eligibleClubs: [],
  registrationDeadline: "",
  contactEmail: "",
  contactPhone: "",
  rules: "",
  equipment: "",
  medical: false,
  insurance: false,
  catering: false,
  parking: false
};

const categories = [
  "Open Singles",
  "Open Doubles",
  "Ladies Singles",
  "Ladies Doubles",
  "Mens Singles",
  "Mens Doubles",
  "Mixed Doubles",
  "U18 Boys",
  "U18 Girls",
  "U15 Boys",
  "U15 Girls",
  "U12 Boys",
  "U12 Girls",
  "Veterans (40+)",
  "Veterans (50+)",
  "Club Teams"
];

const venues = [
  "Saskatoon Sports Centre",
  "Regina Table Tennis Club",
  "Moose Jaw Community Centre",
  "Prince Albert Civic Centre",
  "Yorkton Sports Complex",
  "Swift Current Recreation Centre",
  "North Battleford Arena"
];

const formats = [
  "Single Elimination",
  "Double Elimination",
  "Round Robin",
  "Swiss System",
  "Pool Play + Elimination"
];

export function TournamentWizard({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [tournamentData, setTournamentData] = useState<TournamentData>(initialData);
  const { toast } = useToast();

  const totalSteps = 5;

  const updateData = (field: keyof TournamentData, value: any) => {
    setTournamentData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (category: string) => {
    setTournamentData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Here you would typically submit to your backend
    console.log("Tournament Data:", tournamentData);

    toast({
      title: "Tournament Created!",
      description: `${tournamentData.name} has been successfully created.`,
    });

    onComplete?.();
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              index + 1 <= currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {index + 1 <= currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`w-12 h-1 mx-2 rounded ${
                index + 1 < currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Basic Information</h2>
              <p className="text-muted-foreground">Tell us about your tournament</p>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Tournament Name *</Label>
                <Input
                  id="name"
                  value={tournamentData.name}
                  onChange={(e) => updateData("name", e.target.value)}
                  placeholder="e.g., Saskatchewan Open Championship 2024"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={tournamentData.description}
                  onChange={(e) => updateData("description", e.target.value)}
                  placeholder="Describe your tournament..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={tournamentData.date}
                    onChange={(e) => updateData("date", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                  <Input
                    id="registrationDeadline"
                    type="date"
                    value={tournamentData.registrationDeadline}
                    onChange={(e) => updateData("registrationDeadline", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={tournamentData.startTime}
                    onChange={(e) => updateData("startTime", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={tournamentData.endTime}
                    onChange={(e) => updateData("endTime", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Venue & Location</h2>
              <p className="text-muted-foreground">Where will the tournament take place?</p>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="venue">Venue Name *</Label>
                <Select value={tournamentData.venue} onValueChange={(value) => updateData("venue", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((venue) => (
                      <SelectItem key={venue} value={venue}>{venue}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  value={tournamentData.address}
                  onChange={(e) => updateData("address", e.target.value)}
                  placeholder="Street address, city, province, postal code"
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Participants & Categories</h2>
              <p className="text-muted-foreground">Configure participation details</p>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="maxParticipants">Maximum Participants *</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={tournamentData.maxParticipants}
                  onChange={(e) => updateData("maxParticipants", parseInt(e.target.value))}
                  min="1"
                  max="1000"
                />
              </div>

              <div>
                <Label>Tournament Categories *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto border rounded-lg p-4">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={tournamentData.categories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label htmlFor={category} className="text-sm">{category}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="format">Tournament Format *</Label>
                <Select value={tournamentData.format} onValueChange={(value) => updateData("format", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tournament format" />
                  </SelectTrigger>
                  <SelectContent>
                    {formats.map((format) => (
                      <SelectItem key={format} value={format}>{format}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Fees & Prizes</h2>
              <p className="text-muted-foreground">Set up financial details</p>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="registrationFee">Registration Fee ($)</Label>
                <Input
                  id="registrationFee"
                  type="number"
                  value={tournamentData.registrationFee}
                  onChange={(e) => updateData("registrationFee", parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="prizePool">Prize Pool ($)</Label>
                <Input
                  id="prizePool"
                  type="number"
                  value={tournamentData.prizePool}
                  onChange={(e) => updateData("prizePool", parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Estimated Revenue:</strong> ${(tournamentData.registrationFee * tournamentData.maxParticipants).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Profit/Loss:</strong> ${((tournamentData.registrationFee * tournamentData.maxParticipants) - tournamentData.prizePool).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <Settings className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Additional Details</h2>
              <p className="text-muted-foreground">Finalize tournament settings</p>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={tournamentData.contactEmail}
                    onChange={(e) => updateData("contactEmail", e.target.value)}
                    placeholder="tournament@ttsask.ca"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={tournamentData.contactPhone}
                    onChange={(e) => updateData("contactPhone", e.target.value)}
                    placeholder="(306) 123-4567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="rules">Special Rules or Requirements</Label>
                <Textarea
                  id="rules"
                  value={tournamentData.rules}
                  onChange={(e) => updateData("rules", e.target.value)}
                  placeholder="Any special rules, dress code, or requirements..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="equipment">Equipment Requirements</Label>
                <Textarea
                  id="equipment"
                  value={tournamentData.equipment}
                  onChange={(e) => updateData("equipment", e.target.value)}
                  placeholder="What equipment will be provided? What should players bring?"
                  rows={2}
                />
              </div>

              <div className="space-y-3">
                <Label>Amenities & Services</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="medical"
                      checked={tournamentData.medical}
                      onCheckedChange={(checked) => updateData("medical", checked)}
                    />
                    <Label htmlFor="medical">Medical services available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="insurance"
                      checked={tournamentData.insurance}
                      onCheckedChange={(checked) => updateData("insurance", checked)}
                    />
                    <Label htmlFor="insurance">Insurance coverage required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="catering"
                      checked={tournamentData.catering}
                      onCheckedChange={(checked) => updateData("catering", checked)}
                    />
                    <Label htmlFor="catering">Catering available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="parking"
                      checked={tournamentData.parking}
                      onCheckedChange={(checked) => updateData("parking", checked)}
                    />
                    <Label htmlFor="parking">Parking available</Label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderStepIndicator()}

      <Card className="glass border-border/50">
        <CardContent className="p-8">
          {renderStepContent()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2"
                disabled={
                  (currentStep === 1 && !tournamentData.name.trim()) ||
                  (currentStep === 2 && !tournamentData.venue.trim()) ||
                  (currentStep === 3 && (tournamentData.categories.length === 0 || !tournamentData.format)) ||
                  (currentStep === 5 && !tournamentData.contactEmail.trim())
                }
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex items-center gap-2"
                disabled={!tournamentData.name.trim() || !tournamentData.contactEmail.trim()}
              >
                <CheckCircle className="w-4 h-4" />
                Create Tournament
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
