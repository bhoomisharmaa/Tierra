import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://tzvuzbvmplsmsjfunyiu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dnV6YnZtcGxzbXNqZnVueWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0NTU5NDIsImV4cCI6MjAzMTAzMTk0Mn0.Pz21HnrAZh3YMo02mIgxycG3h92oAUX07R03B3EE_4M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
