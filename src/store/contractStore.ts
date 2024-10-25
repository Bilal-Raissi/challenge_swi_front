import { defineStore } from 'pinia';
import contractService from '@/services/contractService';
import type { ContractArticle } from "@/core/contractArticle";

export const useContractStore = defineStore('contractStore', {
    state: () => ({
        articles: [] as ContractArticle[],  // Liste des articles
        loading: false,                     // Indicateur de chargement
        error: null as string | null,       // Gestion des erreurs
    }),
    actions: {
        // Charger les articles
        async fetchArticles() {
            this.loading = true;
            try {
                const response = await contractService.getContractArticles();
                this.articles = response || []; // Ensure it's an array
            } catch (error) {
                this.error = 'Erreur lors de la récupération des articles';
            } finally {
                this.loading = false;
            }
        },
        // Créer un nouvel article
        async addArticle(article: { title: string; content: string }) {
            try {
                const newArticle = await contractService.createContractArticle(article);
                this.articles.push(newArticle); // Ajouter l'article à l'état
            } catch (error) {
                this.error = 'Erreur lors de l\'ajout de l\'article';
            }
        },
        // Mettre à jour un article existant
        async updateArticle(id: number, updatedData: { title: string; content: string }) {
            try {
                const updatedArticle = await contractService.updateContractArticle(id, updatedData);
                const index = this.articles.findIndex(article => article.id === id);
                if (index !== -1) this.articles[index] = updatedArticle;
            } catch (error) {
                this.error = 'Erreur lors de la mise à jour de l\'article';
            }
        },
        // Supprimer un article
        async deleteArticle(id: number) {
            try {
                await contractService.deleteContractArticle(id);
                this.articles = this.articles.filter(article => article.id !== id);
            } catch (error) {
                this.error = 'Erreur lors de la suppression de l\'article';
            }
        },
    },
});
