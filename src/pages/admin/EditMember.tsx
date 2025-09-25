import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MemberForm } from "@/components/forms/MemberForm";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { membersService } from "@/lib/services/members";
import { PageLoadingFallback } from "@/components/ui/loading-spinner";
import type { Member } from "@/lib/types/members";

export default function AdminEditMember() {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMember = async () => {
      if (!id) {
        setError("No member ID provided");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await membersService.getMemberById(id);
        
        if (error) {
          setError(error.message || "Failed to load member");
        } else if (data) {
          setMember(data);
        } else {
          setError("Member not found");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Error loading member:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <PageLoadingFallback />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.history.back()}
              className="text-green-600 hover:text-green-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!member) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Member Not Found</h1>
            <p className="text-gray-600 mb-4">The requested member could not be found.</p>
            <button 
              onClick={() => window.history.back()}
              className="text-green-600 hover:text-green-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <MemberForm 
        mode="edit" 
        member={member}
        isPublic={false}
      />
    </AdminLayout>
  );
}
