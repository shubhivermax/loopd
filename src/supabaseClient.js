import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔧 Supabase Config:', {
  url: supabaseUrl ? '✅ URL loaded' : '❌ URL missing',
  key: supabaseKey ? '✅ Key loaded' : '❌ Key missing',
  urlValue: supabaseUrl?.substring(0, 20) + '...',
  keyValue: supabaseKey?.substring(0, 20) + '...'
})

export const supabase = createClient(supabaseUrl, supabaseKey)

console.log("✅ Supabase client created")
