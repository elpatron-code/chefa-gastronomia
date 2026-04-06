import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://moukmhugmryetsotcdlr.supabase.co'
const supabaseKey = 'sb_publishable_QH9Q7mjstOhZzvIt7phWBg_be5rd4AB'

export const supabase = createClient(supabaseUrl, supabaseKey)
