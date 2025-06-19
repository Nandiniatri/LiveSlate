// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hqahxokfttodzvomjcvk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxYWh4b2tmdHRvZHp2b21qY3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNTIzODcsImV4cCI6MjA2NTkyODM4N30.bWYQWYUyKexlQJNNvyXkcqYPK6wzFRVwMyFTXwBoL3k'

export const supabase = createClient(supabaseUrl, supabaseKey)

