# AI Tool-Calling Template

A minimal but complete AI chatbot starter built with **Vercel AI SDK v5**, **Next.js 15**, and **Google Gemini**. This template demonstrates tool calling (function calling) in a clean, educational way—perfect for Design Engineers learning about LLM integrations.

## 🎯 What This Template Teaches

This template demonstrates:

1. **How tool calling works** - The LLM can call functions to get external data
2. **Multi-step reasoning** - The LLM can chain multiple tools together
3. **Streaming responses** - Real-time updates as the LLM generates text
4. **Type safety** - Full TypeScript types for messages and tool results
5. **Frontend integration** - How to render tool results in the UI

## Why Vercel AI SDK?

The Vercel AI SDK v5 makes it easy to build AI applications with:

- First-class support for tool calling with simple APIs
- Built-in streaming support for real-time experiences
- Type-safe definitions with Zod integration
- Seamless integration with Next.js and React
- Support for multiple AI providers including Google Gemini, OpenAI, Anthropic, and more

### Tool Calling Example

In this template, we implement an "intergalactic weather assistant" with two tools:

1. **`weather`** - Gets weather data for any location (returns mock data)
2. **`whatToWear`** - Suggests futuristic equipment based on weather

When you ask "What's the weather on Mars?", the LLM:

1. Calls the `weather` tool with `{ location: "Mars" }`
2. Receives the weather data
3. Calls the `whatToWear` tool to generate suggestions
4. Synthesizes everything into a conversational response

## 🚀 Features

### Chat Interface

- Real-time chat interface with user and AI messages
- Support for streaming responses
- Auto-scroll to latest message
- Clean, minimal UI using shadcn/ui

### AI Integration

- **Vercel AI SDK v5** with latest patterns
- Integration with Google's Gemini 2.0 Flash model
- Multi-step tool calling with `stopWhen`
- Type-safe tool definitions with Zod

### Custom Tools

The template includes two example tools that demonstrate the full tool-calling flow. The code is heavily documented to help you understand how it works and create your own tools.

## 🛠️ Technical Stack

- **Framework**: Next.js 15
- **AI SDK**: ai@5.0.86, @ai-sdk/react, @ai-sdk/google
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript
- **Schema Validation**: Zod
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)

### Important Resources

- **[Vercel AI SDK v5 Tool Calling Documentation](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling)** - Complete guide to tools
- **[streamText API Reference](https://sdk.vercel.ai/docs/ai-sdk-core/generating-text#streamtext)** - Backend streaming API
- **[useChat Hook Reference](https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot)** - Frontend React hook
- **[Google AI Studio](https://aistudio.google.com/)** - Get your free API key
- **[shadcn/ui Documentation](https://ui.shadcn.com/)** - UI component customization
- **[AI Elements](https://ai-sdk.dev/elements/)** - Free shadcn-compatible AI components by Vercel
- **[21st.dev](https://21st.dev/)** - Library of shadcn-compatible components

### Model Support

While this template uses Google's Gemini model by default, you can easily switch to other providers. The Vercel AI SDK v5 supports:

- **OpenAI** (GPT-5 etc.)
- **Anthropic** (Claude 4.5 Sonnet, etc.)
- **Hugging Face**
- **Azure OpenAI**
- **Cohere**
- And many others

## Project Structure

```plaintext
├── components/
│   └── ui/          # Reusable UI components
├── app/
│   ├── page.tsx     # Main chat interface
│   └── api/
│       └── chat/
│           └── route.ts  # API route for chat functionality
```

## Getting Started

1. Set up your environment:

   - Copy `.env.example` to `.env.local`
   - Get your free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)
   - Add your API key to `.env.local`

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customizing the Template

### Adding New Tools

To add a new tool, extend the `tools` object in [app/api/chat/route.ts](app/api/chat/route.ts:53):

```typescript
tools: {
  yourNewTool: tool({
    description: "Description of your tool",
    inputSchema: z.object({
      // Define your input parameters using Zod
      param1: z.string().describe("Description of param1"),
      param2: z.number().optional(),
    }),
    execute: async ({ param1, param2 }) => {
      // Implement your tool logic
      return { result: "..." };
    },
  }),
}
```

**Tool Result:**
To create a component to render the tool result in [app/page.tsx](app/page.tsx:56):

```typescript
// Add this in the MessagePart component
if (
  toolInvocation.toolName === "yourNewTool" &&
  toolInvocation.state === "result"
) {
  return <YourToolResult result={toolInvocation.result} />;
}
```

### Switching AI Providers

This template uses Google Gemini by default, but you can easily switch to other providers.
See the [AI SDK Providers documentation](https://sdk.vercel.ai/docs/foundations/providers-and-models) for all supported providers and what parameters to use with each model.

## 📖 How It Works

### Backend Flow ([app/api/chat/route.ts](app/api/chat/route.ts))

1. Receive messages from the frontend via POST request
2. Call `streamText()` with model, messages, system prompt, and tools
3. LLM generates response, potentially calling tools
4. Tools execute and return results
5. LLM uses tool results to continue generation (up to 5 steps with `stopWhen: stepCountIs(5)`)
6. Stream response back to client

### Frontend Flow ([app/page.tsx](app/page.tsx))

1. `useChat()` hook manages chat state and API communication
2. User types message and submits form
3. `sendMessage()` sends message to `/api/chat` endpoint
4. Streaming response updates `messages` array in real-time
5. Messages are rendered, including text and tool invocations
6. Custom components render tool results (WeatherResult, WeatherWear)

### Message Structure

Messages have a `parts` array that can contain:

```typescript
{
  type: "text",
  text: "The weather on Mars..."
}

{
  type: "tool-invocation",
  toolInvocation: {
    toolName: "weather",
    toolCallId: "call_123",
    state: "result", // or "pending"
    input: { location: "Mars" },
    result: { location: "Mars", temperature: 72 }
  }
}
```

## 🧪 Testing the Template

Try these prompts to see tool calling in action:

- "What's the weather on Mars?"
- "Tell me about the weather on Jupiter and what I should wear"
- "I'm going to Saturn's rings, what's the weather like and what equipment do I need?"
- "Compare the weather on Venus and Neptune"

## 💡 Development Notes

- The template uses TypeScript for type safety throughout
- Tool parameters are validated using Zod schemas
- Messages stream in real-time for better UX
- UI components use Tailwind CSS for styling
- The chat interface automatically scrolls to the latest message
- Code is heavily documented to help Design Engineers learn
- Implementation is kept minimal to make it easy to understand and extend

## UX Things to Consider

- Making it your own with custom tools, creative idea and visual design
- Better typography
- Improving chat UX and ergonomics, key shortcuts, adding loading state to components etc.
- Adding micro-interactions, animations, and transitions
- Implementing a more advanced tool-calling system
- Overall making the interface more engaging and interactive

## License

This project is MIT licensed.
