import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rsuhahxgmgzvdyhxwsjy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdWhhaHhnbWd6dmR5aHh3c2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1Mjc0NjksImV4cCI6MjA5MDEwMzQ2OX0.TNt7ewTGzllL1_-0FA7s0BGQzVev6tCSB1aaNOWhoIE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
