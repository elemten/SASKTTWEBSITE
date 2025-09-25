import { MemberForm } from "@/components/forms/MemberForm";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminAddMember() {
  return (
    <AdminLayout>
      <MemberForm 
        mode="create" 
        isPublic={false}
        title="Add New Member"
        description="Create a new member account with auto-generated membership number"
      />
    </AdminLayout>
  );
}
