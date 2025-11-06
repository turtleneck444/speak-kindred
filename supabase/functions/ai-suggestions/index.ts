import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { currentText, recentWords, userContext } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const authHeader = req.headers.get('Authorization');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: { Authorization: authHeader || '' },
      },
    });

    // Get user's frequently used words
    const { data: { user } } = await supabase.auth.getUser();
    
    let usageHistory = "";
    if (user) {
      const { data: usageEvents } = await supabase
        .from('usage_events')
        .select('tile_id, tiles(label, speech_text)')
        .eq('user_id', user.id)
        .order('occurred_at', { ascending: false })
        .limit(20);
      
      if (usageEvents && usageEvents.length > 0) {
        const recentTiles = usageEvents
          .map((e: any) => e.tiles?.label)
          .filter(Boolean)
          .join(', ');
        usageHistory = `Recent vocabulary: ${recentTiles}`;
      }
    }

    const systemPrompt = `You are an AAC (Augmentative and Alternative Communication) assistant helping non-verbal users communicate effectively. 
Your role is to predict the next words they might want to say based on their current message and communication patterns.

Rules:
- Provide 3-5 relevant word suggestions that naturally continue their message
- Consider common AAC communication patterns (basic needs, feelings, questions, social interactions)
- Prioritize high-frequency words appropriate for AAC devices
- Keep suggestions simple, clear, and contextually relevant
- Return ONLY the word suggestions, one per line, no numbering or punctuation
- Focus on functional communication

Context: ${userContext || 'General communication'}
${usageHistory}
Current message: "${currentText}"
Recent words used: ${recentWords.join(', ')}`;

    console.log('Calling Lovable AI for suggestions...');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Suggest the next words.' }
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          suggestions: [] 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI credits depleted. Please add credits to continue.',
          suggestions: [] 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    // Parse suggestions - split by lines and clean up
    const suggestions = content
      .split('\n')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0 && s.length < 30)
      .slice(0, 5);

    console.log('AI Suggestions:', suggestions);

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-suggestions function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        suggestions: []
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
