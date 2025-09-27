/*************************************************************************************************/
/*                                                                                               */
/*                       Document upload endpoint for recipes                                    */
/*                                                                                               */
/*************************************************************************************************/

import { z } from 'zod';
import { createResource } from '@/lib/actions/resources';

export async function GET(request: Request) {  
  return new Response("<!DOCTYPE html><html><body><h2>Use POST</h2></body></html>", {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  });
}

const Document = z.object({
  id: z.number(),
  category: z.string().optional(),
  recipe_name: z.string(),
  section_type: z.enum(['info', 'ingredients', 'steps', 'notes', 'based on', 'full']).optional(),
  ingredients_count: z.number().optional(),
  steps_count: z.number().optional(),
  prep_time: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  source_file: z.string(),
  text: z.string(),
  chunking_method: z.string().optional()
});

export async function POST(request: Request) {  
  try {      
      const req = await request.json();      
      const document = Document.parse(req)

      console.log("Document received: ", document.recipe_name);
          
      try {
        createResource({ content: document.text }) 
      } catch (error) {
        console.error("Error creating resource: ", error);
        let errmsg = {error: "Error creating resource"}
        if (error instanceof Error && error.message.length > 0) {
          Object.assign(errmsg, { details: error.message });
        }
        return new Response(JSON.stringify(errmsg), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({message: "document received"}), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });

  } catch (error) {
      console.error("Error parsing JSON:", error);
      if(error instanceof z.ZodError) {
        return new Response(JSON.stringify({ error: "Invalid parameters", details: error.issues }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}