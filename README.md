# dbmcp-app

The online app can be found here: https://dbmcp.me

**dbmcp-app** is the frontend companion built with Angular (generated using Angular CLI v17.0.0) for use alongside **dbmcp-server** to provide a seamless, web-based MongoDB MCP interface.

## Overview

This Angular application, **dbmcp-app**, is designed to run entirely in the browser, providing a user interface to connect and interact with a MongoDB instance exposed via the **dbmcp-server**.

## Features

- Built with **Angular 17** for a modern, reactive frontend.
- Easy-to-run locally — just use `ng serve` and browse to `http://localhost:4200/`.
- Supports hot-reload during development.
- Ready for building (`ng build`) and testing (`ng test`, `ng e2e`) via standard Angular tooling.

## Development Workflow

1. **Run a development server**  
   ```bash
   ng serve
   ```  
   Navigate to `http://localhost:4200/`. The app reloads instantly when source files change.

2. **Generate Angular boilerplate**  
   ```bash
   ng generate component component-name
   ```  
   Or generate directives, services, pipes, and more.

3. **Build for production**  
   ```bash
   ng build
   ```  
   The output files are placed in the `dist/` directory.

4. **Testing**  
   - Unit tests:  
     ```bash
     ng test
     ```  
   - End-to-end tests:  
     ```bash
     ng e2e
     ```

5. **CLI help**  
   ```bash
   ng help
   ```

## Repositories

- **App (frontend)**: [dbmcp-app](https://github.com/shoomkloom/dbmcp-app)  
- **Server (backend)**: [dbmcp-server](https://github.com/shoomkloom/dbmcp-server)

## License

MIT License. See the [LICENSE](LICENSE) file for details.
