# Project

Angular 18 single-page app — Olympic Games medal dashboard.

# Commands

```sh
npm install          # install deps first
ng build             # build only
ng serve             # dev server at http://localhost:4200/
```

# Architecture

Standalone (no NgModules). Bootstrapped via `bootstrapApplication(AppComponent, appConfig)` in `src/main.ts`.

```
src/                         # Folder containing the application's source code.
  app/                       # Folder containing the application and its configuration.
    app.config.ts            # ApplicationConfig: provideRouter(routes), provideHttpClient()
    app.routes.ts            # routes: '' → Home, 'country/:countryName' → Country, 'not-found'/'**' → NotFound
    app.component.ts         # standalone root.
    pages/                   # Folder containing the application's pages.
      home/                  # header + pie chart; indicators: number of countries, number of JOs.
      country/               # header + line chart of medals per year for one country; indicators: entries, medals, athletes.
      not-found/             # 404 page.
    components/              # Folder containing the application's reusable components.
      header/                # page title + indicator pills.
      countrycard/           # line chart per country.
      medal-chart-component/ # pie chart per country, navigates to 'country/:countryName' on click.
    models/                  # Application models: Olympic, Participation.
    services/                # DataService: loadOlympics() via HttpClient from the data source.
  assets/mock/               # Static data source (temporary).
  environnement/             # Configuration depending on the environment.
```


# Upcoming evolution

For now, the data source is static, but in the future the data.service will query an API (backend) via an http connection to fetch its data.