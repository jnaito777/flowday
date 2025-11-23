import React, { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Read .env variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  useEffect(() => {
    // Test connection
    async function testSupabase() {
      const { data, error } = await supabase.from("your_table_name").select("*");
      console.log("Supabase data:", data);
      if (error) console.error("Supabase error:", error);
    }
    testSupabase();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Supabase Connection Test</h1>
      <p>Check the console to see if Supabase returned any data.</p>
    </div>
  );
}

export default App;
