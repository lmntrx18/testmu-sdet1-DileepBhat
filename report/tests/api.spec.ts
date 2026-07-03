import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/pages/api';

const TEST_EMAIL = process.env.TEST_USER_EMAIL || '';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || '';

test.describe('API Module', () => {
  let apiClient: ApiClient;
  let authToken: string;

  test.beforeAll(async ({ playwright }) => {
    const request = await playwright.request.newContext();
    apiClient = new ApiClient(request);

    const loginResponse = await apiClient.login(TEST_EMAIL, TEST_PASSWORD);
    const loginBody = await loginResponse.json();
    authToken = loginBody.data.token;
    apiClient.setToken(authToken);
  });

  test('API-001 - Successful login returns valid auth token', async () => {
    const response = await apiClient.login(TEST_EMAIL, TEST_PASSWORD);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('token');
    expect(typeof body.data.token).toBe('string');
    expect(body.data.token.length).toBeGreaterThan(0);
  });

  test('API-011 - Create a new note with valid data succeeds', async () => {
    const response = await apiClient.createNote({
      title: 'Grocery run',
      description: 'Buy milk, eggs, bread',
      category: 'Personal',
      completed: false,
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('id');
    expect(body.data.title).toBe('Grocery run');
    expect(body.data.category).toBe('Personal');
    expect(body.data.completed).toBe(false);

    // Cleanup so repeated test runs don't pile up notes in the account
    await apiClient.deleteNote(body.data.id);
  });

  test('API-012 - Create note fails when required title field is missing', async () => {
    const response = await apiClient.createNote({
      description: 'Missing a title',
      category: 'Personal',
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message.toLowerCase()).toContain('title');
  });

  test('API-018 - Get a note by non-existent ID returns 404', async () => {
    const nonExistentId = '64a1f0000000000000000000';

    const response = await apiClient.getNoteById(nonExistentId);
    const body = await response.json();

    expect(response.status()).toBe(404);
    expect(body.success).toBe(false);
    expect(body.message).toContain("No note was found with the provided ID, Maybe it was deleted");
  });

});