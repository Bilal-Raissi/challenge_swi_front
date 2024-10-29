<template>
    <div class="modal fade" id="generateContractModal" tabindex="-1" aria-labelledby="generateContractLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="generateContractLabel">Générer un contrat</h5>
                    <button type="button" class="btn-close" @click="closeModalContract" aria-label="Fermer"></button>
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
                            <button type="button" class="btn btn-secondary" @click="closeModalContract">Annuler</button>
                            <button type="submit" class="btn btn-primary">Générer</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import jsPDF from 'jspdf';
import { Modal } from 'bootstrap'; // Import de la modal Bootstrap
import { useContractStore } from '@/store/contractStore';
import type { ContractArticle } from '@/core/contractArticle';

const articleStore = useContractStore(); // Store pour gérer les articles du contrat

// Formulaire pour les informations de l'employé
const employeeForm = ref({
    name: '',
    position: '',
    cin: '',
    birth: ''
});

// Fonction pour gérer la génération du contrat
const generateContract = () => {
    // Filtrer les articles sélectionnés pour le contrat
    const selectedArticles = articleStore.articles.filter((article: ContractArticle) => article.selected);
    const employeeDetails = { ...employeeForm.value }; // Récupérer les détails de l'employé

    // Initialiser jsPDF pour générer le PDF
    const doc = new jsPDF();

    // Ajouter les détails de l'employé dans le PDF
    doc.setFontSize(16);
    doc.text("Contrat de Travail", 10, 10); // Titre du contrat
    doc.setFontSize(12);
    doc.text(`Nom de l'employé : ${employeeDetails.name}`, 10, 30);
    doc.text(`Poste : ${employeeDetails.position}`, 10, 40);
    doc.text(`CIN : ${employeeDetails.cin}`, 10, 50);
    doc.text(`Date de naissance : ${employeeDetails.birth}`, 10, 60);

    // Ajouter un titre pour les articles de contrat
    doc.text("Articles de Contrat :", 10, 80);

    // Variable pour suivre la position verticale actuelle dans le PDF
    let currentY = 90;

    // Boucle pour ajouter chaque article sélectionné avec un ajustement de texte
    selectedArticles.forEach((article, index) => {
        // Titre de l'article
        doc.text(`${index + 1}. ${article.title} :`, 10, currentY);
        currentY += 10; // Déplacer la position verticale pour le contenu

        // Diviser le texte de l'article pour un ajustement de largeur de 180
        const articleContent = doc.splitTextToSize(article.content, 180);
        doc.text(articleContent, 10, currentY);

        // Ajuster la position verticale en fonction de la longueur du texte pour éviter le chevauchement
        currentY += articleContent.length * 6; // Ajuster l'espacement pour chaque ligne de texte
    });

    // Sauvegarder et télécharger le fichier PDF avec le nom de l'employé
    doc.save(`${employeeDetails.name}_Contrat.pdf`);

    // Réinitialiser le formulaire et fermer la modal après la génération du contrat
    employeeForm.value = { name: '', position: '', cin: '', birth: '' };
    closeModalContract();
};

// Fonction pour fermer la modal
const closeModalContract = () => {
    const modalElement = document.getElementById('generateContractModal');
    const modal = Modal.getInstance(modalElement!);
    modal?.hide();
};
</script>
