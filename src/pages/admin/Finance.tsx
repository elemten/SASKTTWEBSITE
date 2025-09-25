import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminFinance() {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Finance Management</h1>
          <p className="text-muted-foreground">Track expenses, receivables, and financial health</p>
        </div>
        
        <div className="p-8 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Finance Dashboard</h2>
          <p className="text-gray-600">
            This will contain your finance management system including:
          </p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>• Expense tracking and approval</li>
            <li>• Receivables management</li>
            <li>• Financial reporting</li>
            <li>• Budget oversight</li>
          </ul>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
