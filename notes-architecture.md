# Remarques sur l'architecture originelle

## 1. Architecture et structure
1. **Aucun service** : la récupération des données et la logique métier sont directement dans les composants. Le chargement du mock est dupliqué dans `home.component.ts` et `country.component.ts`. Il faudrait un service et un dossier `services/`.
2. **Aucun modèle / interface** : le schéma des données du mock n'est pas typé ce qui entraine l'usage de  `any` à plein d'endroits. Il manque les interfaces `Olympic` et `Participation` dans un dossier `models/`.
3. **Composants vides inutiles** :
`app.component.scss` et `home.component.scss` sont vides.

## 2. Bugs et erreurs fonctionnelles
1. **Chargement de données dupliqué** — le même appel HTTP + calculs sont répétés dans les deux composants :
```ts
// home.component.ts:21-39
ngOnInit() {
  this.http.get<any[]>(this.olympicUrl).pipe().subscribe(
    (data) => {
      console.log(`Liste des données : ${JSON.stringify(data)}`);
      if (data && data.length > 0) {
        this.totalJOs = Array.from(new Set(data.map((i: any) => i.participations.map((f: any) => f.year)).flat())).length;
        ...
      }
    },
    ...
  )
}
```
```ts
// country.component.ts:24-46
ngOnInit() {
  let countryName: string | null = null
  this.route.paramMap.subscribe((param: ParamMap) => countryName = param.get('countryName'));
  this.http.get<any[]>(this.olympicUrl).pipe().subscribe(
    (data) => {
      if (data && data.length > 0) {
        const selectedCountry = data.find((i: any) => i.country === countryName);
        ...
      }
    },
    ...
  );
}
```
2. **Crash si le pays n'existe pas dans l'URL** : `selectedCountry` peut être `undefined`, puis on accède à `.country` dessus :
```ts
// country.component.ts:29-33
const selectedCountry = data.find((i: any) => i.country === countryName);
this.titlePage = selectedCountry.country;      // TypeError si selectedCountry est undefined
const participations = selectedCountry?.participations.map((i: any) => i);
```
Pas de redirection vers `not-found`, ni de gestion du cas `undefined`.  
3. **Mauvaise gestion des données** : `countryName` est initialisé à `null` puis rempli par un `subscribe` asynchrone pendant que l'appel HTTP part immédiatement. Si la réponse HTTP arrive avant l'émission de `paramMap`, la recherche ne trouve rien → crash :
```ts
// country.component.ts:25-30
let countryName: string | null = null
this.route.paramMap.subscribe((param: ParamMap) => countryName = param.get('countryName'));
this.http.get<any[]>(this.olympicUrl).pipe().subscribe(
  (data) => {
    if (data && data.length > 0) {
      const selectedCountry = data.find((i: any) => i.country === countryName);
```  
4. **Navigation entre deux pays cassée** : le composant est réutilisé entre `/country/Italy` et `/country/France` (même route, param différent) → `ngOnInit` ne se ré-exécute pas et les données ne sont pas rechargées.
5. **Fuite mémoire** : les abonnements ne sont jamais désabonnés :
```ts
// country.component.ts:26
this.route.paramMap.subscribe((param: ParamMap) => countryName = param.get('countryName'));
```
`paramMap` est un observable infini (ne se termine jamais). Il faut `takeUntil` / `first()` / `async pipe`.  
6. **Interpolation inutile des graphiques** : on tente d'afficher un objet `Chart` dans le DOM, liaison sans effet :
```html
<!-- home.component.html:19 -->
<canvas id="DashboardPieChart">{{ pieChart }}</canvas>
```
```html
<!-- country.component.html:23 -->
<canvas id="countryChart">{{ lineChart }}</canvas>
```
7. **Erreurs jamais affichées** : les erreurs sont stockées mais aucune condition d'affichage n'existe dans les templates :
```ts
// home.component.ts:34-37
(error:HttpErrorResponse) => {
  console.log(`erreur : ${error}`);
  this.error = error.message
}
```
```ts
// country.component.ts:42-44
(error: HttpErrorResponse) => {
  this.error = error.message
}
```
L'utilisateur ne voit rien en cas d'échec du chargement.  
8. **Calcul bancale des médailles/athlètes** : les nombres sont convertis en chaînes puis repassés par `parseInt`, et le `reduce` sur un tableau vide renvoie `undefined` :
```ts
// country.component.ts:34-38
const years = selectedCountry?.participations.map((i: any) => i.year) ?? [];
const medals = selectedCountry?.participations.map((i: any) => i.medalsCount.toString()) ?? [];
this.totalMedals = medals.reduce((accumulator: any, item: any) => accumulator + parseInt(item), 0);
const nbAthletes = selectedCountry?.participations.map((i: any) => i.athleteCount.toString()) ?? []
this.totalAthletes = nbAthletes.reduce((accumulator: any, item: any) => accumulator + parseInt(item), 0);
```
9. **`console.log` de débogage restant** : affichage de toutes les données sérialisées dans la console :
```ts
// home.component.ts:24
console.log(`Liste des données : ${JSON.stringify(data)}`);
```

## 3. Typage et qualité TypeScript
1. **Usage massif de `any`** :
```ts
// home.component.ts:22
this.http.get<any[]>(this.olympicUrl)
```
```ts
// home.component.ts:26-30
this.totalJOs = Array.from(new Set(data.map((i: any) => i.participations.map((f: any) => f.year)).flat())).length;
const countries: string[] = data.map((i: any) => i.country);
...
const medals = data.map((i: any) => i.participations.map((i: any) => (i.medalsCount)));
const sumOfAllMedalsYears = medals.map((i) => i.reduce((acc: any, i: any) => acc + i, 0));
```
```ts
// country.component.ts:16
public totalEntries: any = 0;
```
```ts
// country.component.ts:27-38
this.http.get<any[]>(this.olympicUrl).pipe().subscribe(
  (data) => {
    ...
    const selectedCountry = data.find((i: any) => i.country === countryName);
    ...
```
2. **Variables masquées (shadowing)** : le paramètre `i` est réutilisé dans des `map`/`reduce` imbriqués, code illisible et sujet à erreur :
```ts
// home.component.ts:29-30
const medals = data.map((i: any) => i.participations.map((i: any) => (i.medalsCount)));
const sumOfAllMedalsYears = medals.map((i) => i.reduce((acc: any, i: any) => acc + i, 0));
```
3. **`Router` injecté mais inutilisé** :
```ts
// country.component.ts:21
constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {
}
```
Le lien retour est dans le template, `router` n'est jamais utilisé dans le composant.  
4. **Pipe vide inutile** :
```ts
// home.component.ts:22
this.http.get<any[]>(this.olympicUrl).pipe().subscribe(
```
```ts
// country.component.ts:27
this.http.get<any[]>(this.olympicUrl).pipe().subscribe(
```
5. **Incohérences de style** : mélange de guillemets simples/doubles dans les imports, points-virgules manquants, `console.log` pour les erreurs au lieu de `console.error` :
```ts
// app-routing.module.ts:5
import { CountryComponent } from "./pages/country/country.component";
```
```ts
// app.module.ts:8
import { CountryComponent } from "./pages/country/country.component";
```
```ts
// home.component.ts:14-15
public totalCountries: number = 0
public totalJOs: number = 0
```
La config `.editorconfig` impose les guillemets simples (`quote_type = single`).

## 4. UX / UI
1. **Aucun état de chargement ni d'erreur** affiché à l'utilisateur pendant l'appel HTTP (les champs `error` restent inexploités).
2. **Aucune page «not found» affichée** : la route `not-found` existe (`app-routing.module.ts:17-20`) mais n'est jamais utilisée depuis `CountryComponent` :
```ts
// app-routing.module.ts:16-24
{
  path : 'not-found',
  component : NotFoundComponent
},
{
  path: '**',
  component: NotFoundComponent,
},
```
3. **Accessibilité** : pas d\'`aria-label` sur le graphique :
```ts
// home.component.ts:55-64
onClick: (e) => {
  if (e.native) {
    const points = pieChart.getElementsAtEventForMode(e.native, 'point', { intersect: true }, true)
    if (points.length) {
      const firstPoint = points[0];
      const countryName = pieChart.data.labels ? pieChart.data.labels[firstPoint.index] : '';
      this.router.navigate(['country', countryName]);
    }
  }
}
```

4. **Responsive partiel** : géré uniquement dans `country.component.scss`, rien pour la page d'accueil.

## 5. Configuration et outillage
1. **Pas de lint** : aucun script `lint` dans `package.json`, aucune dépendance ESLint ni script de vérification :
```json
// package.json:4-10
"scripts": {
  "ng": "ng",
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test"
},
```

# Proposition de nouvelle architecture
On veut garder une architecture simple tout en permettant la réutilisation de composants communs. De plus, on veut mettre la structure des données dans le dossier models. Et l'accès aux données via un service que l'on met dans le dossier service.

```
src/                         # Dossier contennt le code source de l'application.
  app/                       # Dossier contenant l'application et ses configurations.
    pages/                   # Dossier contenant les pages de l'application.
      home/                  	# Page d'accueil.
      country/               	# Page pays.
      not-found/             	# Page 404.
    components/              # Dossier contenant les composants réutilisables.
      header/                	# Titre des pages avec indicateurs.
      countrycard/           	# Graphique pour un pays.
      medal-chart-component/ 	# Graphique en camembert par pays.
      spinner/                # Animation de chargement
    models/                  # Model de l'application: Olympic, Participation.
    services/                # Service DataService: charge les données via HttpClient depuis la source de données.
  assets/mock/               # Source de données statique (pour le moment).
  environnement/             # Variable de configuration dépendantes de l'environnement.
```
