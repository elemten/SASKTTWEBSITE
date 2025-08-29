import { Navigation } from "@/components/ui/navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Table Tennis Saskatchewan
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome to the official Table Tennis Saskatchewan website.
        </p>
        <div className="mt-8 p-6 bg-card rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Test Page</h2>
          <p className="text-muted-foreground">
            This is a simplified test page to debug the white screen issue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
