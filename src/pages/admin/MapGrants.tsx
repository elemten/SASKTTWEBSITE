import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminMapGrants() {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">MAP Grants</h1>
          <p className="text-muted-foreground">Manage Multi-Sport Assistance Program grant applications</p>
        </div>
        
        <div className="p-8 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">MAP Grants Dashboard</h2>
          <p className="text-gray-600">
            This will contain your MAP grant management including:
          </p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>• Grant application tracking</li>
            <li>• Document management</li>
            <li>• Reporting requirements</li>
            <li>• Funding status monitoring</li>
          </ul>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
