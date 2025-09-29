import { openai } from '@ai-sdk/openai';
import {
  convertToModelMessages,
  streamText,
  tool,
  UIMessage,
  stepCountIs,
} from 'ai';
import { z } from 'zod';
import { findRelevantContent } from '@/lib/ai/embedding';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-5'),
    //model: openai('gpt-4o-mini'),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    system: `You are an expert assistant specializing in cooking and recipes. 
    Your goal is to provide clear, accurate, and practical answers to any cooking or 
    recipe-related questions. Speak in polite and friendly tone.
    Check your knowledge base before answering any questions. The knowledge base content is in english. 
    If the user asks on different language, translate the question to english before 
    checking the knowledge base, but use the original language for answering.
    Only respond to questions using information from tool calls.
    If no relevant information is found in the tool calls, respond, "Sorry, I don't know."
    But follow the conversation, so use information from both the tool calls and the conversation.`,
    tools: {      
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        //If question language is not english, translate it before calling the tool.`,
        inputSchema: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => {
          console.log(`Tool call (getInformation): '${question}'`)
          return findRelevantContent(question)},
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}