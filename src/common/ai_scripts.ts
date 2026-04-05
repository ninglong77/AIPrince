
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
  alias: {[key: string]: ParameterAlias};
}

export interface ParameterAlias {
  required: boolean;
  type: "input" | "textarea";
  alias: string;
  default: string | number | boolean | undefined;
  default_value_type: "string" | "number" | "boolean";
}

export interface NewComfyUiApi {
  name: string;
  server_url: string;
  prompt_api: string;
  alias?: {[key: string]: ParameterAlias};
}
