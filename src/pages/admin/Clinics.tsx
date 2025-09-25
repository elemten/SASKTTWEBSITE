import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminClinics() {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clinics Management</h1>
          <p className="text-muted-foreground">Manage training clinics and workshops</p>
        </div>
        
        <div className="p-8 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Clinics Dashboard</h2>
          <p className="text-gray-600">
            This will contain your clinic management system including:
          </p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>• Schedule and manage clinics</li>
            <li>• Track registrations and capacity</li>
            <li>• Assign instructors</li>
            <li>• Monitor attendance and feedback</li>
          </ul>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
