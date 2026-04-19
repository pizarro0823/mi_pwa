import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zfamyelniyxnvwgtxtzn.supabase.co'
const supabaseKey = 'sb_publishable_z9pQmsUaddNaVzrjiBFvuQ_N4Z5Nrk-'

export const supabase = createClient(supabaseUrl, supabaseKey)