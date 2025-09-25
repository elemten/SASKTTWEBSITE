import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminTournaments() {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tournament Management</h1>
          <p className="text-muted-foreground">Organize and manage competitive tournaments</p>
        </div>
        
        <div className="p-8 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Tournament Dashboard</h2>
          <p className="text-gray-600">
            This will contain your tournament management system including:
          </p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>• Create and schedule tournaments</li>
            <li>• Manage participant registrations</li>
            <li>• Track results and standings</li>
            <li>• Generate tournament reports</li>
          </ul>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
