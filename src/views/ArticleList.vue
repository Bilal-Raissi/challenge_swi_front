<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-9">
                <h3>Liste des articles</h3>
            </div>
            <div class="col-2">
                <button v-if="isSelected" @click="openGenerateContractModal" class="btn btn-danger">
                    <i class="bi bi-printer"></i>
                </button>
            </div>
            <div class="col-1">
                <button @click="openArticleModal(null)" class="btn btn-primary">
                    <i class="bi bi-plus-lg"></i>
                </button>
            </div>
        </div>

        <!-- Tableau pour afficher les articles -->
        <table class="table table-striped">
            <thead class="thead-dark">
                <tr>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col">Titre</th>
                    <th scope="col">Contenu</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- Boucle sur les articles récupérés -->
                <tr v-for="(article, index) in articleStore.articles" :key="article.id">
                    <td>
                        <input class="form-check-input" v-model="article.selected" type="checkbox" :id="article.id"
                            name="flexCheckDefault">
                    </td>
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ article.title }}</td>
                    <td>{{ article.content }}</td>
                    <td>
                        <button @click="openArticleModal(article)" class="btn btn-warning m-1"><i
                                class="bi bi-pencil-square"></i></button>
                        <button @click="deleteArticle(article.id)" class="btn btn-danger m-1"><i
                                class="bi bi-trash"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Inclure le composant ArticleModal -->
        <ArticleModal :article="articleForm" :isEditing="isEditing" @save="saveArticle" @close="closeArticleModal" />

        <!-- Importer le composant GenerateContractModal -->
        <GenerateContractModal />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useContractStore } from '@/store/contractStore';
import { Modal } from 'bootstrap'; // Import de la modal
import ArticleModal from '@/components/ArticleModal.vue';
import GenerateContractModal from '@/components/GenerateContractModal.vue';
import type { ContractArticle } from '@/core/contractArticle';

const articleStore = useContractStore();

// Formulaire d'article utilisé pour ajouter/modifier
const articleForm = ref({
    title: '',
    content: ''
});

// Indicateur pour savoir si on est en mode modification
const isEditing = ref(false);

// Propriété calculée pour vérifier si des articles sont sélectionnés
const isSelected = computed(() => articleStore.articles.some((article: ContractArticle) => article.selected) ?? false);

// Fonction pour ouvrir la modal et initialiser le formulaire
const openArticleModal = (article) => {
    const modal = new Modal(document.getElementById('articleModal')!);
    articleForm.value = article || { title: '', content: '' };
    isEditing.value = !!article;
    modal.show();
};

// Fonction pour sauvegarder un article (ajouter ou modifier)
const saveArticle = async (article) => {
    if (isEditing.value) {
        // Appel de la méthode de mise à jour pour un article existant
        await articleStore.updateArticle(article.id, article);
    } else {
        // Appel de la méthode d'ajout pour un nouvel article
        await articleStore.addArticle(article);
    }
    // Actualiser la liste des articles et fermer la modal
    await articleStore.fetchArticles();
    closeArticleModal();
};

// Fonction pour supprimer un article
const deleteArticle = async (id: number) => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?");
    if (confirmed) {
        await articleStore.deleteArticle(id);
        await articleStore.fetchArticles(); // Recharger les articles après suppression
    }
};

// Fonction pour fermer la modal
const closeArticleModal = () => {
    const modalElement = document.getElementById('articleModal');
    const modal = Modal.getInstance(modalElement!);
    modal?.hide();
};

// Charger les articles lors du montage
onMounted(() => {
    articleStore.fetchArticles();
});

// Fonction pour ouvrir la modal de génération de contrat
const openGenerateContractModal = () => {
    const modalInstance = new Modal(document.getElementById('generateContractModal')!);
    modalInstance.show();
};
</script>
