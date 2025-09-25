import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { MembersManagement } from "@/components/admin/MembersManagement";

export default function AdminMembers() {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <MembersManagement />
      </motion.div>
    </AdminLayout>
  );
}
