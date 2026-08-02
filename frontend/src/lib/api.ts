import axiosClient from './axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface ChatMessage {
  role: "user" | "ai" | "assistant";
  content: string;
  timestamp?: string;
}

export const api = {
  async fetchChatHistory(userId: string): Promise<ChatMessage[]> {
    const response = await axiosClient.get(`/history/${userId}`);
    return response.data.history || [];
  },

  async clearChatHistory(userId: string): Promise<void> {
    await axiosClient.delete(`/history/${userId}`);
  },

  async sendChatMessage(message: string, userId: string = "guest_student", generateQuiz: boolean = false, subject: string = "science", language: string = "English"): Promise<{ response: string; context_used: boolean }> {
    const response = await axiosClient.post(`/chat`, {
      message,
      user_id: userId,
      generate_quiz: generateQuiz,
      subject,
      language
    });
    return response.data;
  },

  async uploadMaterial(file: File, category: string = "teacher_upload"): Promise<{ filename: string; message: string }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    const response = await axiosClient.post(`/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async fetchMaterials(): Promise<Array<{ title: string; type: string; size: string; date: string; category: string; path: string }>> {
    const response = await axiosClient.get(`/materials`);
    return response.data;
  },
};
