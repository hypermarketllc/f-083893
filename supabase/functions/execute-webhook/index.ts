import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookRequestPayload {
  webhookId: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  test: boolean;
}

export const handler = async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }
    
    // Get the webhook data from the request
    const payload: WebhookRequestPayload = await req.json();
    const { webhookId, url, method, headers, body, test } = payload;
    
    // Validate input
    if (!webhookId || !url || !method) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }), 
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }
    
    // Execute the webhook
    const startTime = Date.now();
    let response;
    
    try {
      console.log(`Executing webhook ${webhookId} to ${url} with method ${method}`);
      
      const requestOptions: RequestInit = {
        method,
        headers,
      };
      
      if (method !== 'GET' && body) {
        requestOptions.body = body;
      }
      
      response = await fetch(url, requestOptions);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Get response data
      let responseText = await response.text();
      
      // Get response headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      
      // If this is a test, just return the response
      if (test) {
        return new Response(
          JSON.stringify({
            status: response.status,
            headers: responseHeaders,
            body: responseText,
            duration
          }),
          { 
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            } 
          }
        );
      }
      
      // Otherwise, log the execution
      const { error } = await supabase
        .from('webhook_logs')
        .insert({
          webhook_id: webhookId,
          request_url: url,
          request_method: method,
          request_headers: headers,
          request_body: body,
          response_status: response.status,
          response_headers: responseHeaders,
          response_body: responseText,
          duration,
          success: response.ok
        });
      
      if (error) {
        console.error('Error logging webhook execution:', error);
      }
      
      // Update webhook's last execution status
      const { error: updateError } = await supabase
        .from('webhooks')
        .update({
          last_executed_at: new Date().toISOString(),
          last_execution_status: response.ok ? 'success' : 'error'
        })
        .eq('id', webhookId);
      
      if (updateError) {
        console.error('Error updating webhook status:', updateError);
      }
      
      return new Response(
        JSON.stringify({
          status: response.status,
          headers: responseHeaders,
          body: responseText,
          duration
        }),
        { 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    } catch (error) {
      console.error('Error executing webhook:', error);
      
      // If this is a test, just return the error
      if (test) {
        return new Response(
          JSON.stringify({
            status: 0,
            headers: {},
            error: error.message,
            duration: Date.now() - startTime
          }),
          { 
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            } 
          }
        );
      }
      
      // Otherwise, log the error
      const { error: logError } = await supabase
        .from('webhook_logs')
        .insert({
          webhook_id: webhookId,
          request_url: url,
          request_method: method,
          request_headers: headers,
          request_body: body,
          response_status: 0,
          duration: Date.now() - startTime,
          success: false,
          error: error.message
        });
      
      if (logError) {
        console.error('Error logging webhook execution error:', logError);
      }
      
      // Update webhook's last execution status
      const { error: updateError } = await supabase
        .from('webhooks')
        .update({
          last_executed_at: new Date().toISOString(),
          last_execution_status: 'error'
        })
        .eq('id', webhookId);
      
      if (updateError) {
        console.error('Error updating webhook status:', updateError);
      }
      
      return new Response(
        JSON.stringify({
          status: 0,
          error: error.message,
          duration: Date.now() - startTime
        }),
        { 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }
  } catch (error) {
    console.error('Function error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  }
};

Deno.serve(handler);
