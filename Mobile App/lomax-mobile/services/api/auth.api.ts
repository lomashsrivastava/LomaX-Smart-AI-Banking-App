import client from './client';
import { ENDPOINTS } from '@/constants/endpoints';

export const authApi = {
  login: (customerId: string, password: string) =>
    client.post(ENDPOINTS.LOGIN, { customerId, password }),

  register: (data: Record<string, unknown>) =>
    client.post(ENDPOINTS.REGISTER, data),

  logout: () => client.post(ENDPOINTS.LOGOUT),

  refresh: (refreshToken: string) =>
    client.post(ENDPOINTS.REFRESH, { refreshToken }),

  changePassword: (currentPassword: string, newPassword: string) =>
    client.post(ENDPOINTS.CHANGE_PASSWORD, { currentPassword, newPassword }),

  getSessions: () => client.get(ENDPOINTS.SESSIONS),

  revokeSession: (sessionId: string) =>
    client.delete(ENDPOINTS.SESSION_REVOKE(sessionId)),

  get2FAStatus: () => client.get(ENDPOINTS.TWO_FA_STATUS),

  toggle2FA: (enabled: boolean) =>
    client.post(ENDPOINTS.TWO_FA_TOGGLE, { enabled }),
};
