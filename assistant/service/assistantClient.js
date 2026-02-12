import { SYSTEM_PROMPT } from '../prompts/systemPrompt';

const DEFAULT_PROXY_URL = 'http://localhost:8787/assistant/respond';

export function getAssistantProxyUrl() {
  return process.env.EXPO_PUBLIC_ASSISTANT_PROXY_URL || DEFAULT_PROXY_URL;
}

export async function respondViaProxy({ input, snapshot }) {
  const endpoint = getAssistantProxyUrl();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemPrompt: SYSTEM_PROMPT,
      input,
      snapshot,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Assistant proxy failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  return {
    message: data?.message || 'I am ready to help with your next action.',
    cards: Array.isArray(data?.cards) ? data.cards : [],
    actions: Array.isArray(data?.actions) ? data.actions : [],
  };
}

export default respondViaProxy;
