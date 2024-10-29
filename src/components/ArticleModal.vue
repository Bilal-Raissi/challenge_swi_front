<template>
    <div class="modal fade" id="articleModal" tabindex="-1" aria-labelledby="articleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ isEditing ? 'Modifier' : 'Ajouter' }} un article</h5>
                    <button type="button" class="btn-close" @click="closeModal" aria-label="Fermer"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="handleSubmit">
                        <div class="form-group">
                            <label for="title">Titre</label>
                            <input v-model="localArticle.title" type="text" id="title" class="form-control" required />
                        </div>
                        <div class="form-group mt-3">
                            <label for="content">Contenu</label>
                            <textarea v-model="localArticle.content" id="content" class="form-control" rows="5"
                                required></textarea>
                        </div>
                        <div class="modal-footer mt-3">
                            <button type="button" class="btn btn-secondary" @click="closeModal">Annuler</button>
                            <button type="submit" class="btn btn-success">{{ isEditing ? 'Enregistrer' : 'Ajouter' }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';

// Définition des propriétés passées au composant
const props = defineProps({
    article: Object,
    isEditing: Boolean
});

// Émission des événements 'save' et 'close' pour la communication avec le parent
const emit = defineEmits(['save', 'close']);

// Initialisation d'un article local basé sur l'article passé en prop
const localArticle = ref({ ...props.article });

// Observer les changements de l'article reçu en prop et mettre à jour localArticle
watch(
    () => props.article,
    (newArticle) => {
        localArticle.value = { ...newArticle };
    },
    { deep: true, immediate: true } 
);

// Fonction pour gérer la soumission du formulaire
const handleSubmit = () => {
    emit('save', localArticle.value);
};

// Fonction pour fermer la modal et émettre l'événement 'close'
const closeModal = () => {
    emit('close');
};
</script>
