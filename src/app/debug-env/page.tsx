'use client'

export default function DebugEnvPage() {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_TABLE: process.env.SUPABASE_TABLE,
    CHECKS_CONTRACT: process.env.CHECKS_CONTRACT
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Environment Variables Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current Environment Variables</h2>
          <div className="space-y-4">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="border-b border-gray-200 pb-2">
                <div className="font-medium text-gray-700">{key}:</div>
                <div className="text-sm text-gray-600 font-mono break-all">
                  {value ? (
                    key.includes('KEY') ? 
                      `${value.substring(0, 20)}...${value.substring(value.length - 10)}` : 
                      value
                  ) : (
                    <span className="text-red-500">undefined</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}