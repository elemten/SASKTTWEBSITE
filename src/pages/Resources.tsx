import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";

const Resources = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">Resources</h1>
        <p className="text-muted-foreground mb-6">Links and documents for players, coaches, and clubs.</p>
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">Content placeholder</div>
      </div>
      <Footer />
    </div>
  );
};

export default Resources;


