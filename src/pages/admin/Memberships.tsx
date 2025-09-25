import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminMemberships() {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Membership Analytics</h1>
          <p className="text-muted-foreground">Track membership trends and analytics</p>
        </div>
        
        <div className="p-8 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Membership Dashboard</h2>
          <p className="text-gray-600">
            This will contain your membership analytics including:
          </p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>• Membership growth trends</li>
            <li>• Renewal rates and patterns</li>
            <li>• Member demographics</li>
            <li>• Retention analysis</li>
          </ul>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
