# Module-Content-Tracker-UI

The frontend provides the user interface of the Module Content Tracker system and enables interactive visualization of the data delivered by the backend. It offers multiple views for exploring modules, departments, and study programs, as well as access to competence and content profiles.

The application communicates with the backend service module-content-tracker-RAG, which handles the analysis and delivery of module data. The frontend uses ECharts for data visualization and provides interactive components such as selectors, filters, and graph-based diagrams.

## How to install

To install dependencies, use npm.
A clean installation is recommended before running the project for the first time:
```
npm clean install
```
## Start in development mode

To start the application in development mode, use the following command:

```
ng serve -c development --proxy-config src/proxy.conf.json
```

## Run End-to-End Tests

Before running the Playwright E2E tests, start the application in test mode:

```
ng serve -c test --proxy-config src/proxy.conf.json
```

Then execute the Playwright tests with:

```
npx playwright test show-report --config=playwright.config.ts
```

Normally charts are rendered by ECharts using the Canvas element. During testing, ECharts switches to SVG rendering to enable DOM-based element inspection.

## How to build
To build the application, use the following command:

```
ng build --configuration developement
```
