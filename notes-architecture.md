# Remarques sur l'architecture originelle

1. Absence de module src/app/core/ qui doit contenir les services singleton, les composants shell, etc...
2. Absence de module src/app/shared/ contenant les composants, directives et pipes réutilisables
3. Abscence de services.
4. Absence de model.
5. Fichier src/app/app.component.scss est vide.
6. Duplication du code de récupération des données à partir du mock  et appel http depuis les home.component.ts et country.component.ts. Gestion des données directement dans le composant.
7. Présence de any dans les fichiers home.component.ts et country.component.ts alors qu'on aimerait du typage strict.
