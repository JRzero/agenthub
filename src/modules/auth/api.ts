import { apiRequest } from "@/shared/api/http-client";

export interface CreatorProfile {
  id: number;
  uuid: string;
  username: string;
  email: string;
  status: string;
  metadata?: {
    full_name?: string;
    avatar?: string;
  };
}

export interface AuthResult {
  api_key: string;
  creator: CreatorProfile;
}

export interface RegistrationInput {
  username: string;
  email: string;
  password: string;
  invitationCode: string;
}

export function login(username: string, password: string): Promise<AuthResult> {
  return apiRequest<AuthResult>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function register(input: RegistrationInput): Promise<AuthResult> {
  return apiRequest<AuthResult>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username: input.username.trim(),
      email: input.email.trim(),
      password: input.password,
      invitation_code: input.invitationCode.trim(),
    }),
  });
}
