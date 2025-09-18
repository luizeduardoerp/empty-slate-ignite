
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpmwfdzkbmlhmakncytg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbXdmZHprYm1saG1ha25jeXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxODI1MzIsImV4cCI6MjA2ODc1ODUzMn0.3H_1-MFco8YmwMNMYwc-3F352Z4xO16xPtSf9dnK1PU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
