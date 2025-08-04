import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MicroSave</h1>
          <p className="text-gray-600">Your community savings & lending platform</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
