# Polygon Copilot 

## Description

Polygon Copilot is your AI assistant for all things Polygon. From coding assistance, to validator set up guides, and whatever you want to know about Polygon, our GPT-4 powered Copilot can help you. 

Know more about Polygon Copilot [here](https://www.notion.so/layer-e/About-the-Polygon-Copilot-574cafd65ac3448e9e75d4b8f0caa378).


## Getting Started

To get a local copy up and running follow these simple steps.

Clone this repository: `git clone git@github.com:0xPolygon/copilot.git`
Install the dependencies:
```bash
yarn
```

Run the development server:

```bash
yarn dev
```
Open http://localhost:3000 with your browser to see the app.


## Building the App

To build the app for production, follow these steps:

1. Install the dependencies:
   ```bash
   yarn or npm install
   ```

2. Build the app:
   ```bash
   yarn build or npm run build
   ```

   This command will create an optimized production build of the app in the `build` directory.

3. Start the production server:
   ```bash
   yarn start or npm run start
   ```

   The app will be running on http://localhost:3000.

## Static Export

To export the app as a static site, you can use Next.js's static site generation feature. Follow these steps:

1. Install the dependencies (if you haven't done so already):
   ```bash
   yarn or npm install
   ```

2. Generate the static files:
   ```bash
   yarn build && yarn export or npm run build && npm run export
   ```

   This command will generate the static files in the `out` directory.

3. You can now deploy the `out` directory to a static hosting service of your choice, such as Vercel, Netlify, or GitHub Pages. Consult the documentation of your chosen hosting service for specific instructions on how to deploy a static site.

   Alternatively, you can serve the static files locally using a static file server. For example, you can use the `serve` package:
   ```bash
   yarn global add serve 
   serve -s out

   # Or, if you're using npm:

   npm install -g serve
   serve -s out
   ```

   The app will be available at http://localhost:3000.

### Customization

The app's appearance and behavior can be customized by modifying the relevant files in the `pages` directory. You can update the styles in the `styles` directory and modify the components in the `components` directory to suit your needs.

## Contributing

If you'd like to contribute to the development of Polygon Copilot, follow these steps:

1. Fork the repository and clone it to your local machine.

2. Install the dependencies:
  
 ```bash
   yarn
   ```
   
3. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b my-feature
   ```

4. Make your changes and test them locally.

5. Commit your changes:
   ```bash
   git commit -m "Add my feature"
   ```

6. Push your changes to your forked repository:
   ```bash
   git push origin my-feature
   ```

7. Create a pull request on the main repository, describing your changes and why they should be merged.