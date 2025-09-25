import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminSPED() {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">SPED Programs</h1>
          <p className="text-muted-foreground">Sport for Persons with a Disability training and certification</p>
        </div>
        
        <div className="p-8 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">SPED Dashboard</h2>
          <p className="text-gray-600">
            This will contain your SPED program management including:
          </p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>• SPED Level 1 & 2 certifications</li>
            <li>• Participant registration and tracking</li>
            <li>• Accommodation management</li>
            <li>• Instructor assignments</li>
          </ul>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
