export type Modality = "text" | "image" | "audio";

export type MessageRole = "user" | "assistant";

export type ImageStatus = "pending" | "generated" | "error";

export interface TextContent {
  type: "text";
  content: string;
}

export interface ImageContent {
  type: "image";
  prompt: string;
  url: string | null;
  alt: string;
  status: ImageStatus;
}

export interface AudioContent {
  type: "audio";
  text: string;
  label: string;
}

export type ContentBlock = TextContent | ImageContent | AudioContent;

export interface Message {
  id: string;
  role: MessageRole;
  blocks: ContentBlock[];
  timestamp: number;
  metadata: {
    modalitiesUsed: Modality[];
    difficultyLevel: number;
    isBreakthrough: boolean;
    topic: string;
  };
}

export interface SocraticLLMResponse {
  thinking: string;
  text_response: string;
  should_generate_image: boolean;
  image_prompt: string | null;
  image_alt: string | null;
  should_offer_audio: boolean;
  audio_text: string | null;
  difficulty_adjustment: number;
  detected_topic: string;
  user_understanding_level: number;
  is_breakthrough: boolean;
}

export interface Session {
  id: string;
  title: string;
  topic: string;
  messages: Message[];
  startedAt: number;
  lastActiveAt: number;
  currentDifficulty: number;
  resolved: boolean;
}

export interface ModalityInteraction {
  modality: Modality;
  messageId: string;
  sessionId: string;
  timestamp: number;
  durationMs: number;
  interactionType: "view" | "expand" | "play" | "replay" | "hover";
}

export interface ModalityStats {
  modality: Modality;
  totalInteractions: number;
  totalTimeMs: number;
  averageTimeMs: number;
  breakthroughCorrelation: number;
  sessionsUsed: number;
}

export interface SessionAnalytics {
  sessionId: string;
  topic: string;
  startedAt: number;
  durationMs: number;
  messageCount: number;
  modalitiesUsed: Modality[];
  difficultyProgression: number[];
  breakthroughCount: number;
  resolved: boolean;
  engagementScore: number;
}

export interface AnalyticsData {
  interactions: ModalityInteraction[];
  sessionSummaries: SessionAnalytics[];
  updatedAt: number;
}

export interface ChatRequest {
  messages: Array<{
    role: MessageRole;
    content: string;
  }>;
  sessionContext: {
    currentDifficulty: number;
    topic: string;
    messageCount: number;
    modalityPreference: Modality | null;
  };
}

export interface ChatStreamChunk {
  type: "text_delta" | "metadata" | "done" | "error";
  content?: string;
  metadata?: Omit<SocraticLLMResponse, "text_response" | "thinking">;
  error?: string;
}

export interface ImageRequest {
  prompt: string;
}

export interface ImageResponse {
  url: string;
  revisedPrompt: string;
}
