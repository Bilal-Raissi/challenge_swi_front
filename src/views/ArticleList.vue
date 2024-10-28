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
                <button @click="openModal()" class="btn btn-primary">
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
                        <button @click="openModal(article)" class="btn btn-warning m-1"><i
                                class="bi bi-pencil-square"></i></button>
                        <button @click="deleteArticle(article.id)" class="btn btn-danger m-1"><i
                                class="bi bi-trash"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modal pour ajouter ou modifier un article -->
        <div class="modal fade bd-example-modal-lg" id="articleModal" tabindex="-1" aria-labelledby="articleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="articleModalLabel">{{ isEditing ? 'Modifier' : 'Ajouter' }} un
                            article</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="isEditing ? updateArticle() : createArticle()">
                            <div class="form-group">
                                <label for="title">Titre</label>
                                <input v-model="articleForm.title" type="text" id="title" class="form-control"
                                    required />
                            </div>
                            <div class="form-group mt-3">
                                <label for="content">Contenu</label>
                                <textarea v-model="articleForm.content" id="content" class="form-control" rows="5"
                                    required></textarea>
                            </div>
                            <div class="modal-footer mt-3">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                                <button type="submit" class="btn btn-success">{{ isEditing ? 'Enregistrer' : 'Ajouter'
                                    }}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Generating Contract -->
        <div class="modal fade" id="generateContractModal" tabindex="-1" aria-labelledby="generateContractLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="generateContractLabel">Générer un contrat</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="generateContract">
                            <div class="mb-3">
                                <label for="employeeName" class="form-label">Nom de l'employé</label>
                                <input v-model="employeeForm.name" type="text" id="employeeName" class="form-control"
                                    required />
                            </div>
                            <div class="mb-3">
                                <label for="employeePosition" class="form-label">Poste de l'employé</label>
                                <input v-model="employeeForm.position" type="text" id="employeePosition"
                                    class="form-control" required />
                            </div>
                            <div class="mb-3">
                                <label for="employeeCIN" class="form-label">CIN de l'employé</label>
                                <input v-model="employeeForm.cin" type="text" id="employeeCIN" class="form-control"
                                    required />
                            </div>
                            <div class="mb-3">
                                <label for="employeeBirth" class="form-label">Date de naissance de l'employé</label>
                                <input v-model="employeeForm.birth" type="date" id="employeeBirth" class="form-control"
                                    required />
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                                <button type="submit" class="btn btn-primary">Générer</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useContractStore } from '@/store/contractStore';
import { Modal } from 'bootstrap'; // Import de la modal
import type { ContractArticle } from '@/core/contractArticle';
import jsPDF from 'jspdf';

const articleStore = useContractStore();

// Formulaire d'article utilisé pour ajouter/modifier
const articleForm = ref({
    id: 0,
    title: '',
    content: '',
});

// Formulaire d'employé
const employeeForm = ref({
    name: '',
    position: '',
    cin: '',
    birth: '',
});

// Indicateur pour savoir si on est en mode modification
const isEditing = ref(false);

// Computed property to check if any articles are selected
const isSelected = computed(() => articleStore.articles.some((article: ContractArticle) => article.selected) ?? false);

// Function to open the generate contract modal
const openGenerateContractModal = () => {
    const modal = new Modal(document.getElementById('generateContractModal')!);
    modal.show();
};

// Function to handle contract generation
const generateContract = () => {
    const selectedArticles = articleStore.articles.filter((article: ContractArticle) => article.selected);
    const employeeDetails = { ...employeeForm.value };

    // Initialize jsPDF
    const doc = new jsPDF();

    // Add employee details
    doc.setFontSize(16);
    doc.text("Contrat de Travail", 10, 10);
    doc.setFontSize(12);
    doc.text(`Nom de l'employé : ${employeeDetails.name}`, 10, 30);
    doc.text(`Poste : ${employeeDetails.position}`, 10, 40);
    doc.text(`CIN : ${employeeDetails.cin}`, 10, 50);
    doc.text(`Date de naissance : ${employeeDetails.birth}`, 10, 60);

    // Add a line break
    doc.text("Articles de Contrat :", 10, 80);

    // Variable to track current Y position
    let currentY = 90;

    // Loop through selected articles and add them to the PDF with text wrapping
    selectedArticles.forEach((article, index) => {
        // Title
        doc.text(`${index + 1}. ${article.title} :`, 10, currentY);
        currentY += 10; // Move the Y position down by 10 units for the content

        // Wrap content to fit within a width of 180
        const articleContent = doc.splitTextToSize(article.content, 180);
        doc.text(articleContent, 10, currentY);

        // Adjust the Y position after the content to avoid overlap
        currentY += articleContent.length * 6; // Multiply by 10 units per line of text
    });

    // Save and download the PDF
    doc.save(`${employeeDetails.name}_Contrat.pdf`);

    // Clear form fields and close modal after generating contract
    employeeForm.value = { name: '', position: '', cin: '', birth: '' };
    closeModalContract('generateContractModal');
};

const closeModalContract = (modalId: string) => {
    const modalElement = document.getElementById(modalId);
    const modal = Modal.getInstance(modalElement!);
    modal?.hide();
};

// Fonction pour ouvrir la modal et initialiser le formulaire
const openModal = (article?: ContractArticle) => {
    const modal = new Modal(document.getElementById('articleModal')!);
    if (article) {
        articleForm.value = { ...article }; // Si un article est passé, c'est une modification
        isEditing.value = true;
    } else {
        articleForm.value = { id: 0, title: '', content: '' }; // Sinon, c'est un ajout
        isEditing.value = false;
    }
    modal.show();
};

// Créer un nouvel article
const createArticle = async () => {
    await articleStore.addArticle(articleForm.value);
    await articleStore.fetchArticles();  // Refetch articles after adding
    closeModal();
};

// Mettre à jour un article existant
const updateArticle = async () => {
    await articleStore.updateArticle(articleForm.value.id, articleForm.value);
    await articleStore.fetchArticles();  // Refetch articles after adding
    closeModal();
};

// Fonction pour supprimer un article
const deleteArticle = async (id: number) => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?");
    if (confirmed) {
        await articleStore.deleteArticle(id);
        await articleStore.fetchArticles(); // Refetch articles after deleting
    }
};

// Fonction pour fermer la modal
const closeModal = () => {
    const modalElement = document.getElementById('articleModal');
    const modal = Modal.getInstance(modalElement!);
    modal?.hide();
};

// Charger les articles lors du montage
onMounted(() => {
    articleStore.fetchArticles();
});
</script>
