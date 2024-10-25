import axios from 'axios';
import type { ContractArticle } from "@/core/contractArticle";

// Définir l'URL de base de ton API
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Remplace par l'URL de ton API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  // GET: Récupérer tous les articles de contrat
  getContractArticles(): Promise<ContractArticle[]> {
    return apiClient.get('/contract-articles').then(response => response.data);
  },

  // POST: Créer un nouvel article de contrat
  createContractArticle(article: Omit<ContractArticle, 'id'>): Promise<ContractArticle> {
    return apiClient.post('/contract-articles', article).then(response => response.data);
  },

  // PUT: Modifier un article de contrat existant
  updateContractArticle(id: number, article: Omit<ContractArticle, 'id'>): Promise<ContractArticle> {
    return apiClient.put(`/contract-articles/${id}`, article).then(response => response.data);
  },

  // DELETE: Supprimer un article de contrat
  deleteContractArticle(id: number): Promise<void> {
    return apiClient.delete(`/contract-articles/${id}`).then(response => response.data);
  },
};
