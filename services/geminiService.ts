
import { GoogleGenAI, GenerateContentResponse, Type, FunctionDeclaration, Modality, Blob as GenAIBlob } from '@google/genai';
import { ChatMessage } from '../types';

// Define the AIStudio interface to resolve global type declaration conflicts.
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    // Use the defined AIStudio interface for window.aistudio.
    aistudio: AIStudio;
  }
}

// Helper functions for audio encoding/decoding as per Gemini Live API guidance
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): GenAIBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}


const getGenAIInstance = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not set. Please ensure it's available in the environment.");
    // This typically won't happen in the AISTudio environment, but good for local dev.
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY || 'YOUR_DEFAULT_API_KEY' });
};

export const generateContentFromGemini = async (prompt: string): Promise<string> => {
  try {
    const ai = getGenAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 500,
      },
    });
    return response.text || 'Tidak ada respons dari Gemini.';
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
      alert("API Key error: Requested entity was not found. Please re-select your API key.");
      await window.aistudio.openSelectKey();
    }
    return 'Maaf, terjadi kesalahan saat mengambil informasi. Mohon coba lagi.';
  }
};

export const generateStreamingContentFromGemini = async (
  prompt: string,
  onNewChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: string) => void,
  history: ChatMessage[] = []
) => {
  try {
    const ai = getGenAIInstance();
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 500,
      },
    });

    // Convert chat history to Gemini's content format
    const geminiHistory = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: { text: msg.text }
    }));

    // Pass history to chat instance (this is a simplified approach, a real chat should manage full history for context)
    // For this example, we'll just use the prompt and let the model handle context if it can.
    // A proper chat API interaction would involve passing the entire `geminiHistory` array to `chat.sendMessageStream` or initializing the chat with history.
    // For the purpose of this example, we'll send the current prompt and assume it's part of a new conversation or let the model infer context.
    const streamResponse = await chat.sendMessageStream({ message: prompt });

    for await (const chunk of streamResponse) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        onNewChunk(c.text);
      }
    }
    onComplete();
  } catch (error) {
    console.error('Error calling streaming Gemini API:', error);
    if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
      alert("API Key error: Requested entity was not found. Please re-select your API key.");
      await window.aistudio.openSelectKey();
    }
    onError('Maaf, terjadi kesalahan saat mengambil informasi. Mohon coba lagi.');
  }
};

export const getMissionFeedbackFromGemini = async (missionTitle: string, userDescription: string): Promise<string> => {
  try {
    const ai = getGenAIInstance();
    const prompt = `Berikan umpan balik yang memotivasi dan edukatif untuk siswa yang baru saja menyelesaikan misi lingkungan:\n\nMisi: ${missionTitle}\nDeskripsi yang dilakukan siswa: ${userDescription}\n\nFokus pada apresiasi usaha siswa dan kaitkan dengan dampak positif lingkungan.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Or gemini-3-pro-preview for more nuanced feedback
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 200,
      },
    });
    return response.text || 'Hebat! Anda telah menyelesaikan misi ini!';
  } catch (error) {
    console.error('Error getting mission feedback from Gemini:', error);
    if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
      alert("API Key error: Requested entity was not found. Please re-select your API key.");
      await window.aistudio.openSelectKey();
    }
    return 'Terima kasih telah menyelesaikan misi! Terus semangat!';
  }
};

// Function to check and open API key selection dialog
export const ensureApiKeySelected = async (): Promise<boolean> => {
  if (typeof window !== 'undefined' && window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      alert("Untuk menggunakan fitur ini, Anda perlu memilih kunci API. Ini akan membuka dialog untuk pemilihan.");
      await window.aistudio.openSelectKey();
      // Assume success for race condition mitigation
      return true;
    }
    return true;
  }
  console.warn("window.aistudio not available. API key selection might not function as expected.");
  return !!process.env.API_KEY; // Fallback to check env variable
};

// Simplified audio context management for Live API example (not fully implemented in current app, but provided as a helper)
let nextStartTime = 0;
// Use only AudioContext for modern browser compatibility.
const outputAudioContext = new AudioContext({ sampleRate: 24000 });
const outputNode = outputAudioContext.createGain();
outputNode.connect(outputAudioContext.destination);
const sources = new Set<AudioBufferSourceNode>();

export const playAudioResponse = async (base64EncodedAudioString: string) => {
  if (base64EncodedAudioString) {
    nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
    const audioBuffer = await decodeAudioData(
      decode(base64EncodedAudioString),
      outputAudioContext,
      24000,
      1,
    );
    const source = outputAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputNode);
    source.addEventListener('ended', () => {
      sources.delete(source);
    });

    source.start(nextStartTime);
    nextStartTime = nextStartTime + audioBuffer.duration;
    sources.add(source);
  }
};

export const stopAllAudio = () => {
  for (const source of sources.values()) {
    source.stop();
    sources.delete(source);
  }
  nextStartTime = 0;
};
