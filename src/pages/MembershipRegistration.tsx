import { MemberForm } from "@/components/forms/MemberForm";

export default function MembershipRegistration() {
  return (
    <MemberForm 
      mode="create" 
      isPublic={true}
      showBackButton={true}
      title="Join Table Tennis Saskatchewan"
      description="Complete your membership registration to join our community of table tennis enthusiasts"
    />
  );
}
