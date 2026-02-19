import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

interface ResetPasswordPageProps {
  params: Promise<{ uid: string; token: string }>;
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { uid, token } = await params;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-sm border p-8">
        <ResetPasswordForm uid={uid} token={token} />
      </div>
    </div>
  );
}
