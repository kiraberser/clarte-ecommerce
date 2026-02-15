import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-sm border p-8">
        <RegisterForm />
      </div>
    </div>
  );
}
