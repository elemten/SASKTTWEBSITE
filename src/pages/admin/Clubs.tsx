import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ClubsManagement } from "@/components/admin/ClubsManagement";

export default function AdminClubs() {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ClubsManagement />
      </motion.div>
    </AdminLayout>
  );
}
