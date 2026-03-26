
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

export interface ComfyUiApi {
  id: number;
  name: string;
  server_url: string;
  prompt_api: string;
}

export interface NewComfyUiApi {
  name: string;
  server_url: string;
  prompt_api: string;
}
