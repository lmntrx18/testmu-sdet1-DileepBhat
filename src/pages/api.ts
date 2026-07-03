import { APIRequestContext, APIResponse } from '@playwright/test';

const API_BASE_URL = 'https://practice.expandtesting.com/notes/api';

export interface NotePayload {
  title: string;
  description?: string;
  category?: 'Home' | 'Work' | 'Personal';
  completed?: boolean;
}

export class ApiClient {
  private request: APIRequestContext;
  private token: string;

  constructor(request: APIRequestContext, token: string = '') {
    this.request = request;
    this.token = token;
  }

  setToken(token: string) {
    this.token = token;
  }

  private authHeaders(): Record<string, string> {
    return this.token ? { 'x-auth-token': this.token } : {};
  }

  async login(email: string, password: string): Promise<APIResponse> {
    return this.request.post(`${API_BASE_URL}/users/login`, {
      data: { email, password },
    });
  }

  async register(name: string, email: string, password: string): Promise<APIResponse> {
    return this.request.post(`${API_BASE_URL}/users/register`, {
      data: { name, email, password },
    });
  }

  async createNote(payload: Partial<NotePayload>): Promise<APIResponse> {
    return this.request.post(`${API_BASE_URL}/notes`, {
      headers: this.authHeaders(),
      data: payload,
    });
  }

  async getNoteById(id: string): Promise<APIResponse> {
    return this.request.get(`${API_BASE_URL}/notes/${id}`, {
      headers: this.authHeaders(),
    });
  }

  async getAllNotes(): Promise<APIResponse> {
    return this.request.get(`${API_BASE_URL}/notes`, {
      headers: this.authHeaders(),
    });
  }

  async deleteNote(id: string): Promise<APIResponse> {
    return this.request.delete(`${API_BASE_URL}/notes/${id}`, {
      headers: this.authHeaders(),
    });
  }
}