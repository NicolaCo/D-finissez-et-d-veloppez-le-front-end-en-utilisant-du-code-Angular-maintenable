# Remarques sur l'architecture originelle
1. Absence de services.
2. Absence de model.
3. Fichier src/app/app.component.scss est vide.
4. Duplication du code de récupération des données à partir du mock  et appel http depuis les home.component.ts et country.component.ts. Gestion des données directement dans le composant.
5. Présence de any dans les fichiers home.component.ts et country.component.ts alors qu'on aimerait du typage strict.
6. Simplifier les fichiers vides ou presque app.components.html|css en mettant tout dans app.component.ts.

# Proposition de nouvelle architecture
On veut garder une architecture simple tout en permettant la réutilisation de composants communs. De plus, on veut mettre la structure des données dans le dossier models. Et l'accès aux données via un service que l'on met dans le dossier service.

src/app/
    ├── app.component.spec.ts
    ├── app.component.ts
    ├── app.module.ts
    ├── app-routing.module.ts
	├── components/
  		├── header/
  		├── error/
  		└── loading/
	├── pages/
  		├── country-detail/
			├── country.component.html
			├── country.component.scss
			├── country.component.spec.ts
			└── country.component.ts
  		└── dashboard/
  			├── home.component.html
			├── home.component.scss
			├── home.component.spec.ts
			└── home.component.ts
  ├── services/
  		└── data.service.ts
  └── models/
  		└── olympic.model.ts
assets/
	├── images/
		└── teleSport.png
	└── mock/
		└── olympic.json
├── environments/
	├── environment.prod.ts
    └── environment.ts
├── favicon.ico
├── index.html
├── main.ts
├── polyfills.ts
├── styles.scss
└── test.ts

