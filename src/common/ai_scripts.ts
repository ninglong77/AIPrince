
// 剧本
export interface AiScript {
  id: number;
  name: string;
  uuid: string;
  content: string;
}

export interface NewAiScript {
  name: string;
  uuid: string;
  content: string;
}
