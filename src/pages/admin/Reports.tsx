import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Reports } from "@/components/admin/Reports";

export default function AdminReports() {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Reports />
      </motion.div>
    </AdminLayout>
  );
}
