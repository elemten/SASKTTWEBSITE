import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { FloatingCTA } from "@/components/floating-cta";
import ExpenseClaimDynamicForm from "@/components/forms/ExpenseClaimDynamicForm";
import { motion } from "framer-motion";

const Expenses = () => {
    return (
        <div className="min-h-screen">
            <Navigation />

            <main className="pt-24 pb-16 bg-gradient-to-b from-slate-50 via-white to-slate-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl mx-auto"
                    >
                        <ExpenseClaimDynamicForm />
                    </motion.div>
                </div>
            </main>

            <Footer />
            <FloatingCTA />
        </div>
    );
};

export default Expenses;
