import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiOverview() {
    return {
      name: 'NestJS Comprehensive API Showcase',
      version: '1.0.0',
      database: 'MySQL 8 (nest_db) conectado vía TypeORM',
      description: 'Demostración completa de endpoints GET, POST, PUT, PATCH, DELETE, TypeORM + MySQL, Parámetros y Multipart en NestJS',
      endpoints: {
        products: {
          'GET /products': 'Listar productos con filtrado (@Query) y paginación',
          'GET /products/:id': 'Obtener un producto por ID (@Param, ParseIntPipe)',
          'POST /products': 'Crear producto (@Body, DTO Validation, @HttpCode(201))',
          'PUT /products/:id': 'Actualización completa de producto (@Param, @Body)',
          'PATCH /products/:id': 'Actualización parcial de producto (@Param, @Body)',
          'DELETE /products/:id': 'Eliminar producto por ID (@Param, ParseIntPipe)',
        },
        files: {
          'POST /files/upload-single': 'Subida de un solo archivo (FileInterceptor, ParseFilePipeBuilder)',
          'POST /files/upload-multiple': 'Subida múltiple (FilesInterceptor)',
          'POST /files/upload-fields': 'Multipart mixto: campos de texto + archivos (FileFieldsInterceptor)',
          'GET /files/list': 'Listado de archivos almacenados en servidor',
          'GET /files/download/:filename': 'Descarga y streaming de archivos (StreamableFile)',
        },
        examples: {
          'GET /examples/inspect-request': 'Inspección de IP, User-Agent y Headers (@Ip, @Headers)',
          'GET /examples/custom-headers': 'Emisión de cabeceras HTTP personalizadas (@Header)',
          'GET /examples/pipes-showcase': 'Pipes nativos (ParseBoolPipe, ParseArrayPipe, DefaultValuePipe)',
          'POST /examples/custom-status': 'Código de estado 202 Accepted (@HttpCode)',
          'GET /examples/redirect-demo': 'Redirección HTTP 302/301 (@Redirect)',
          'GET /examples/express-interop': 'Interoperabilidad Express (@Req, @Res({ passthrough: true }))',
        },
      },
    };
  }

  getDashboardHtml(): string {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NestJS Endpoint Explorer & Testing Lab</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-primary: #0a0f1d;
      --bg-surface: #111827;
      --bg-surface-elevated: #1f2937;
      --border-color: rgba(255, 255, 255, 0.08);
      --border-hover: rgba(224, 35, 78, 0.4);
      --text-primary: #f9fafb;
      --text-secondary: #9ca3af;
      --text-muted: #6b7280;
      --accent-nest: #e0234e;
      --accent-nest-glow: rgba(224, 35, 78, 0.25);
      --accent-cyan: #06b6d4;
      --accent-purple: #8b5cf6;
      --accent-green: #10b981;
      --accent-amber: #f59e0b;
      --accent-blue: #3b82f6;
      --method-get: #10b981;
      --method-post: #3b82f6;
      --method-put: #f59e0b;
      --method-patch: #8b5cf6;
      --method-delete: #ef4444;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: radial-gradient(circle at 10% 20%, #171c2f 0%, var(--bg-primary) 70%);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.5;
    }

    header {
      background: rgba(17, 24, 39, 0.8);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 50;
      padding: 1rem 2rem;
    }

    .header-container {
      max-width: 1440px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .brand-logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #e0234e 0%, #ff4d6d 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px var(--accent-nest-glow);
    }

    .brand-logo svg {
      width: 24px;
      height: 24px;
      fill: white;
    }

    .brand-text h1 {
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      background: linear-gradient(to right, #fff, #9ca3af);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand-text p {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .badge-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      color: #34d399;
      font-size: 0.75rem;
      padding: 0.35rem 0.8rem;
      border-radius: 9999px;
      font-weight: 600;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    main {
      max-width: 1440px;
      margin: 0 auto;
      padding: 2rem;
      width: 100%;
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    @media (max-width: 1024px) {
      main {
        grid-template-columns: 1fr;
      }
    }

    /* Tabs Styling */
    .nav-tabs {
      display: flex;
      gap: 0.5rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.75rem;
      margin-bottom: 1.5rem;
      overflow-x: auto;
    }

    .tab-btn {
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-secondary);
      font-family: inherit;
      font-weight: 600;
      font-size: 0.875rem;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .tab-btn:hover {
      color: var(--text-primary);
      background: rgba(255, 255, 255, 0.04);
    }

    .tab-btn.active {
      background: var(--bg-surface-elevated);
      color: var(--text-primary);
      border-color: var(--border-color);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .tab-btn.active[data-tab="products"] {
      border-bottom: 2px solid var(--accent-cyan);
    }

    .tab-btn.active[data-tab="files"] {
      border-bottom: 2px solid var(--accent-nest);
    }

    .tab-btn.active[data-tab="examples"] {
      border-bottom: 2px solid var(--accent-purple);
    }

    /* Cards */
    .card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 1.5rem;
      margin-bottom: 1.25rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      transition: border-color 0.2s ease, transform 0.2s ease;
    }

    .card:hover {
      border-color: rgba(255, 255, 255, 0.16);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .endpoint-badge {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.825rem;
      font-weight: 600;
    }

    .method-tag {
      padding: 0.25rem 0.55rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .method-tag.get { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .method-tag.post { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
    .method-tag.put { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .method-tag.patch { background: rgba(139, 92, 246, 0.15); color: #a78bfa; }
    .method-tag.delete { background: rgba(239, 68, 68, 0.15); color: #f87171; }

    .route-path {
      color: var(--text-primary);
    }

    .endpoint-desc {
      font-size: 0.825rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }

    .form-group {
      margin-bottom: 0.85rem;
    }

    .form-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 0.35rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .form-control, .form-textarea {
      width: 100%;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      font-family: inherit;
      font-size: 0.875rem;
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      outline: none;
      transition: all 0.2s ease;
    }

    .form-control:focus, .form-textarea:focus {
      border-color: var(--accent-cyan);
      box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15);
    }

    .form-textarea {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      min-height: 90px;
      resize: vertical;
    }

    .file-input-wrapper {
      position: relative;
      background: var(--bg-primary);
      border: 1px dashed var(--border-color);
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .file-input-wrapper:hover {
      border-color: var(--accent-nest);
      background: rgba(224, 35, 78, 0.03);
    }

    .file-input-wrapper input[type="file"] {
      width: 100%;
      cursor: pointer;
      color: var(--text-secondary);
    }

    .btn-action {
      background: linear-gradient(135deg, #1f2937, #111827);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      font-family: inherit;
      font-weight: 600;
      font-size: 0.825rem;
      padding: 0.6rem 1.1rem;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }

    .btn-action:hover {
      background: var(--bg-surface-elevated);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }

    .btn-primary {
      background: linear-gradient(135deg, #e0234e 0%, #c01b40 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 14px var(--accent-nest-glow);
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #f02d58 0%, #d12046 100%);
      box-shadow: 0 6px 18px rgba(224, 35, 78, 0.4);
    }

    /* Response Console Panel */
    .console-panel {
      position: sticky;
      top: 6rem;
      height: calc(100vh - 8rem);
      display: flex;
      flex-direction: column;
      background: #080c14;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5);
    }

    .console-header {
      padding: 0.85rem 1.25rem;
      background: rgba(17, 24, 39, 0.6);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .console-title {
      font-size: 0.825rem;
      font-weight: 700;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .console-meta {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .status-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-muted);
    }

    .status-badge.s2xx { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .status-badge.s3xx { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
    .status-badge.s4xx { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .status-badge.s5xx { background: rgba(239, 68, 68, 0.2); color: #f87171; }

    .time-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .console-body {
      flex: 1;
      overflow: auto;
      padding: 1.25rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      line-height: 1.6;
      background: #050811;
    }

    pre {
      white-space: pre-wrap;
      word-break: break-word;
      color: #e5e7eb;
    }

    .console-empty {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      text-align: center;
      gap: 0.5rem;
    }

    .code-pill {
      background: rgba(255, 255, 255, 0.06);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .copy-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .copy-btn:hover {
      color: var(--text-primary);
    }
  </style>
</head>
<body>
  <header>
    <div class="header-container">
      <div class="brand">
        <div class="brand-logo">
          <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/></svg>
        </div>
        <div class="brand-text">
          <h1>NestJS Endpoint Lab</h1>
          <p>Demostración integral de controladores, parámetros, DTOs y archivos multipart</p>
        </div>
      </div>
      <div style="display: flex; gap: 0.6rem; align-items: center;">
        <div class="badge-status" style="background: rgba(59, 130, 246, 0.12); border-color: rgba(59, 130, 246, 0.35); color: #60a5fa;">
          <span>🐬 MySQL (nest_db) + TypeORM</span>
        </div>
        <div class="badge-status">
          <span class="pulse-dot"></span>
          <span>Servidor Activo (v12)</span>
        </div>
      </div>
    </div>
  </header>

  <main>
    <!-- Left Column: Controls & Endpoints -->
    <div class="endpoints-column">
      <div class="nav-tabs">
        <button class="tab-btn active" data-tab="products" onclick="switchTab('products')">
          📦 CRUD & Parámetros
        </button>
        <button class="tab-btn" data-tab="files" onclick="switchTab('files')">
          📁 Manejo de Archivos
        </button>
        <button class="tab-btn" data-tab="examples" onclick="switchTab('examples')">
          ⚙️ Casos Avanzados & Headers
        </button>
      </div>

      <!-- TAB 1: PRODUCTS (CRUD & PARAMETERS) -->
      <div id="tab-products" class="tab-content">
        <!-- GET ALL / FILTER -->
        <div class="card">
          <div class="card-header">
            <div class="endpoint-badge">
              <span class="method-tag get">GET</span>
              <span class="route-path">/products</span>
            </div>
            <button class="btn-action btn-primary" onclick="testGetAllProducts()">Ejecutar</button>
          </div>
          <p class="endpoint-desc">
            Demuestra <span class="code-pill">@Query()</span> con DTO de validación, búsqueda por texto, filtrado por precio/categoría y paginación.
          </p>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Buscar (search)</label>
              <input type="text" id="filter-search" class="form-control" placeholder="ej: rgb o switch">
            </div>
            <div class="form-group">
              <label class="form-label">Categoría</label>
              <input type="text" id="filter-category" class="form-control" placeholder="ej: Periféricos">
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Precio Máx</label>
              <input type="number" id="filter-maxPrice" class="form-control" placeholder="ej: 100">
            </div>
            <div class="form-group">
              <label class="form-label">Límite</label>
              <input type="number" id="filter-limit" class="form-control" value="10">
            </div>
          </div>
        </div>

        <!-- GET ONE -->
        <div class="card">
          <div class="card-header">
            <div class="endpoint-badge">
              <span class="method-tag get">GET</span>
              <span class="route-path">/products/:id</span>
            </div>
            <button class="btn-action" onclick="testGetProductById()">Consultar</button>
          </div>
          <p class="endpoint-desc">
            Demuestra <span class="code-pill">@Param('id', ParseIntPipe)</span>. Si envías letras en vez de número, retornará 400 Bad Request automático.
          </p>
          <div class="form-group">
            <label class="form-label">ID de Producto</label>
            <input type="text" id="get-id" class="form-control" value="1">
          </div>
        </div>

        <!-- POST (CREATE) -->
        <div class="card">
          <div class="card-header">
            <div class="endpoint-badge">
              <span class="method-tag post">POST</span>
              <span class="route-path">/products</span>
            </div>
            <button class="btn-action btn-primary" onclick="testCreateProduct()">Crear Producto</button>
          </div>
          <p class="endpoint-desc">
            Demuestra <span class="code-pill">@Body()</span> con <span class="code-pill">CreateProductDto</span> validado por <span class="code-pill">class-validator</span> y código 201 Created.
          </p>
          <div class="form-group">
            <label class="form-label">Cuerpo JSON (Request Body)</label>
            <textarea id="post-body" class="form-textarea">{
  "name": "Headset Gamer 7.1",
  "description": "Sonido envolvente con cancelación de ruido",
  "price": 89.99,
  "category": "Audio",
  "tags": ["headset", "audio", "gamer"],
  "inStock": true
}</textarea>
          </div>
        </div>

        <!-- PUT (REPLACE) -->
        <div class="card">
          <div class="card-header">
            <div class="endpoint-badge">
              <span class="method-tag put">PUT</span>
              <span class="route-path">/products/:id</span>
            </div>
            <button class="btn-action" onclick="testPutProduct()">Actualizar (PUT)</button>
          </div>
          <p class="endpoint-desc">
            Demuestra <span class="code-pill">@Put()</span> para actualización o reemplazo completo del registro.
          </p>
          <div class="form-group">
            <label class="form-label">ID a actualizar</label>
            <input type="number" id="put-id" class="form-control" value="1">
          </div>
          <div class="form-group">
            <label class="form-label">Cuerpo JSON</label>
            <textarea id="put-body" class="form-textarea">{
  "name": "Teclado Mecánico RGB v2",
  "description": "Edición especial switches rojos silenciosos",
  "price": 99.50,
  "category": "Periféricos",
  "tags": ["red-switches", "silencioso"]
}</textarea>
          </div>
        </div>

        <!-- PATCH (PARTIAL) -->
        <div class="card">
          <div class="card-header">
            <div class="endpoint-badge">
              <span class="method-tag patch">PATCH</span>
              <span class="route-path">/products/:id</span>
            </div>
            <button class="btn-action" onclick="testPatchProduct()">Modificar (PATCH)</button>
          </div>
          <p class="endpoint-desc">
            Demuestra <span class="code-pill">@Patch()</span> con <span class="code-pill">PartialType</span> para modificar únicamente campos específicos (ej: solo el precio).
          </p>
          <div class="form-group">
            <label class="form-label">ID a modificar</label>
            <input type="number" id="patch-id" class="form-control" value="2">
          </div>
          <div class="form-group">
            <label class="form-label">Cuerpo JSON Parcial</label>
            <textarea id="patch-body" class="form-textarea">{
  "price": 42.90,
  "inStock": false
}</textarea>
          </div>
        </div>

        <!-- DELETE -->
        <div class="card">
          <div class="card-header">
            <div class="endpoint-badge">
              <span class="method-tag delete">DELETE</span>
              <span class="route-path">/products/:id</span>
            </div>
            <button class="btn-action" onclick="testDeleteProduct()">Eliminar</button>
          </div>
          <p class="endpoint-desc">
            Demuestra <span class="code-pill">@Delete()</span> con eliminación en memoria.
          </p>
          <div class="form-group">
            <label class="form-label">ID a eliminar</label>
            <input type="number" id="delete-id" class="form-control" value="3">
          </div>
        </div>
      </div>

      <!-- TAB 2: FILES & MULTIPART -->
      <div id="tab-files" class="tab-content" style="display: none;">
        <!-- SINGLE FILE UPLOAD -->
        <div class="card">
          <div class="card-header">
            <div class="endpoint-badge">
              <span class="method-tag post">POST</span>
              <span class="route-path">/files/upload-single</span>
            </div>
            <button class="btn-action btn-primary" onclick="testUploadSingle()">Subir Archivo</button>
          </div>
          <p class="endpoint-desc">
            Demuestra <span class="code-pill">@UseInterceptors(FileInterceptor('file'))</span> y validación de tamaño máx (10MB) con <span class="code-pill">ParseFilePipeBuilder</span>.
          </p>
          <div class="form-group">
            <div class="file-input-wrapper">
              <input type="file" id="file-single">
            </div>
          </div>
        </div>

        <!-- MULTIPLE FILES UPLOAD -->
        <div class="card">
          <div class="card-header">
            <div class="endpoint-badge">
              <span class="method-tag post">POST</span>
              <span class="route-path">/files/upload-multiple</span>
            </div>
            <button class="btn-action btn-primary" onclick="testUploadMultiple()">Subir Múltiples</button>
          </div>
          <p class="endpoint-desc">
            Demuestra <span class="code-pill">@UseInterceptors(FilesInterceptor('files', 5))</span> para procesar colecciones de archivos simultáneamente.
          </p>
          <div class="form-group">
            <div class="file-input-wrapper">
              <input type="file" id="file-multiple" multiple>
            </div>
          </div>
        </div>

        <!-- MIXED MULTIPART FIELDS (AVATAR + DOCS + TEXT) -->
        <div class="card">
          <div class="card-header">
            <div class="endpoint-badge">
              <span class="method-tag post">POST</span>
              <span class="route-path">/files/upload-fields</span>
            </div>
            <button class="btn-action btn-primary" onclick="testUploadFields()">Enviar Formulario Mixto</button>
          </div>
          <p class="endpoint-desc">
            Demuestra <span class="code-pill">FileFieldsInterceptor</span>: recibe archivos con nombres distintos (<span class="code-pill">avatar</span> y <span class="code-pill">documents</span>) más datos de texto en <span class="code-pill">@Body()</span>.
          </p>
          <div class="form-group">
            <label class="form-label">Usuario / Metadata (Campo de texto)</label>
            <input type="text" id="fields-username" class="form-control" value="piero_dev">
          </div>
          <div class="form-group">
            <label class="form-label">Avatar (Campo: avatar)</label>
            <input type="file" id="fields-avatar" class="form-control">
          </div>
          <div class="form-group">
            <label class="form-label">Documentos (Campo: documents, máx 3)</label>
            <input type="file" id="fields-docs" class="form-control" multiple>
          </div>
        </div>

        <!-- LIST FILES & DOWNLOAD -->
        <div class="card">
          <div class="card-header">
            <div class="endpoint-badge">
              <span class="method-tag get">GET</span>
              <span class="route-path">/files/list</span>
            </div>
            <button class="btn-action" onclick="testListFiles()">Listar Archivos</button>
          </div>
          <p class="endpoint-desc">
            Muestra los archivos guardados en el directorio <span class="code-pill">./uploads</span> del servidor.
          </p>
          <div class="form-group" style="margin-top: 1rem;">
            <label class="form-label">Descargar archivo vía StreamableFile (GET /files/download/:filename)</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" id="download-filename" class="form-control" placeholder="Escribe el nombre del archivo guardado">
              <button class="btn-action" onclick="triggerDownload()">Descargar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: EXAMPLES & HEADERS -->
      <div id="tab-examples" class="tab-content" style="display: none;">
        <!-- INSPECT REQUEST -->
        <div class="card">
          <div class="card-header">
            <div class="endpoint-badge">
              <span class="method-tag get">GET</span>
              <span class="route-path">/examples/inspect-request</span>
            </div>
            <button class="btn-action" onclick="testInspectRequest()">Inspeccionar</button>
          </div>
          <p class="endpoint-desc">
            Demuestra <span class="code-pill">@Ip()</span>, <span class="code-pill">@Headers('user-agent')</span> y <span class="code-pill">@Headers()</span> para inspección de peticiones entrantes.
          </p>
        </div>

        <!-- CUSTOM HEADERS -->
        <div class="card">
          <div class="card-header">
            <div class="endpoint-badge">
              <span class="method-tag get">GET</span>
              <span class="route-path">/examples/custom-headers</span>
            </div>
            <button class="btn-action" onclick="testCustomHeaders()">Ver Cabeceras</button>
          </div>
          <p class="endpoint-desc">
            Demuestra cómo emitir cabeceras HTTP de respuesta con el decorador declarativo <span class="code-pill">@Header()</span>.
          </p>
        </div>

        <!-- PIPES SHOWCASE -->
        <div class="card">
          <div class="card-header">
            <div class="endpoint-badge">
              <span class="method-tag get">GET</span>
              <span class="route-path">/examples/pipes-showcase</span>
            </div>
            <button class="btn-action" onclick="testPipesShowcase()">Probar Pipes</button>
          </div>
          <p class="endpoint-desc">
            Demuestra <span class="code-pill">ParseBoolPipe</span>, <span class="code-pill">ParseArrayPipe</span> y <span class="code-pill">DefaultValuePipe</span> nativos de NestJS.
          </p>
        </div>

        <!-- CUSTOM STATUS CODE -->
        <div class="card">
          <div class="card-header">
            <div class="endpoint-badge">
              <span class="method-tag post">POST</span>
              <span class="route-path">/examples/custom-status</span>
            </div>
            <button class="btn-action" onclick="testCustomStatus()">Enviar (202)</button>
          </div>
          <p class="endpoint-desc">
            Demuestra modificación del código HTTP de respuesta usando <span class="code-pill">@HttpCode(HttpStatus.ACCEPTED)</span>.
          </p>
        </div>

        <!-- EXPRESS INTEROP -->
        <div class="card">
          <div class="card-header">
            <div class="endpoint-badge">
              <span class="method-tag get">GET</span>
              <span class="route-path">/examples/express-interop</span>
            </div>
            <button class="btn-action" onclick="testExpressInterop()">Probar Cookies</button>
          </div>
          <p class="endpoint-desc">
            Demuestra el uso de <span class="code-pill">@Res({ passthrough: true })</span> para inyectar cookies y cabeceras nativas de Express sin perder la respuesta automática de NestJS.
          </p>
        </div>
      </div>
    </div>

    <!-- Right Column: Interactive Console -->
    <div class="console-panel">
      <div class="console-header">
        <div class="console-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
          Consola de Respuesta HTTP
        </div>
        <div class="console-meta">
          <span id="response-time" class="time-badge">0 ms</span>
          <span id="response-status" class="status-badge">Esperando...</span>
          <button class="copy-btn" onclick="copyConsoleContent()" title="Copiar JSON">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Copiar
          </button>
        </div>
      </div>
      <div class="console-body" id="console-body">
        <div class="console-empty">
          <p>Selecciona cualquier endpoint de la izquierda y haz clic en <strong>Ejecutar</strong> para inspeccionar la respuesta en vivo.</p>
        </div>
      </div>
    </div>
  </main>

  <script>
    function switchTab(tabName) {
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
      });
      document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = content.id === 'tab-' + tabName ? 'block' : 'none';
      });
    }

    async function executeRequest(url, options = {}) {
      const startTime = performance.now();
      const statusBadge = document.getElementById('response-status');
      const timeBadge = document.getElementById('response-time');
      const consoleBody = document.getElementById('console-body');

      statusBadge.textContent = 'Enviando...';
      statusBadge.className = 'status-badge';
      consoleBody.innerHTML = '<div style="color: #9ca3af;">Cargando petición...</div>';

      try {
        const response = await fetch(url, options);
        const duration = Math.round(performance.now() - startTime);
        timeBadge.textContent = duration + ' ms';

        statusBadge.textContent = response.status + ' ' + response.statusText;
        if (response.status >= 200 && response.status < 300) {
          statusBadge.className = 'status-badge s2xx';
        } else if (response.status >= 300 && response.status < 400) {
          statusBadge.className = 'status-badge s3xx';
        } else if (response.status >= 400 && response.status < 500) {
          statusBadge.className = 'status-badge s4xx';
        } else {
          statusBadge.className = 'status-badge s5xx';
        }

        const contentType = response.headers.get('content-type') || '';
        let result;
        if (contentType.includes('application/json')) {
          result = await response.json();
          consoleBody.innerHTML = '<pre>' + escapeHtml(JSON.stringify(result, null, 2)) + '</pre>';
        } else {
          result = await response.text();
          consoleBody.innerHTML = '<pre>' + escapeHtml(result) + '</pre>';
        }

        return { response, result };
      } catch (err) {
        const duration = Math.round(performance.now() - startTime);
        timeBadge.textContent = duration + ' ms';
        statusBadge.textContent = 'ERROR DE RED';
        statusBadge.className = 'status-badge s5xx';
        consoleBody.innerHTML = '<pre style="color: #ef4444;">' + escapeHtml(err.message) + '</pre>';
      }
    }

    function escapeHtml(string) {
      return String(string)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function copyConsoleContent() {
      const text = document.getElementById('console-body').innerText;
      if (text) {
        navigator.clipboard.writeText(text);
        alert('Copiado al portapapeles');
      }
    }

    // CRUD Handlers
    function testGetAllProducts() {
      const params = new URLSearchParams();
      const search = document.getElementById('filter-search').value.trim();
      const category = document.getElementById('filter-category').value.trim();
      const maxPrice = document.getElementById('filter-maxPrice').value.trim();
      const limit = document.getElementById('filter-limit').value.trim();

      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (limit) params.append('limit', limit);

      const queryStr = params.toString() ? '?' + params.toString() : '';
      executeRequest('/products' + queryStr);
    }

    function testGetProductById() {
      const id = document.getElementById('get-id').value.trim() || '1';
      executeRequest('/products/' + id);
    }

    function testCreateProduct() {
      try {
        const body = JSON.parse(document.getElementById('post-body').value);
        executeRequest('/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } catch (e) {
        alert('JSON inválido en el cuerpo de la petición');
      }
    }

    function testPutProduct() {
      const id = document.getElementById('put-id').value.trim() || '1';
      try {
        const body = JSON.parse(document.getElementById('put-body').value);
        executeRequest('/products/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } catch (e) {
        alert('JSON inválido en el cuerpo de la petición');
      }
    }

    function testPatchProduct() {
      const id = document.getElementById('patch-id').value.trim() || '2';
      try {
        const body = JSON.parse(document.getElementById('patch-body').value);
        executeRequest('/products/' + id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } catch (e) {
        alert('JSON inválido en el cuerpo de la petición');
      }
    }

    function testDeleteProduct() {
      const id = document.getElementById('delete-id').value.trim() || '3';
      executeRequest('/products/' + id, {
        method: 'DELETE',
      });
    }

    // Files Handlers
    function testUploadSingle() {
      const input = document.getElementById('file-single');
      if (!input.files || input.files.length === 0) {
        alert('Por favor selecciona un archivo primero');
        return;
      }
      const formData = new FormData();
      formData.append('file', input.files[0]);

      executeRequest('/files/upload-single', {
        method: 'POST',
        body: formData,
      });
    }

    function testUploadMultiple() {
      const input = document.getElementById('file-multiple');
      if (!input.files || input.files.length === 0) {
        alert('Por favor selecciona uno o más archivos');
        return;
      }
      const formData = new FormData();
      for (let i = 0; i < input.files.length; i++) {
        formData.append('files', input.files[i]);
      }

      executeRequest('/files/upload-multiple', {
        method: 'POST',
        body: formData,
      });
    }

    function testUploadFields() {
      const username = document.getElementById('fields-username').value;
      const avatarInput = document.getElementById('fields-avatar');
      const docsInput = document.getElementById('fields-docs');

      const formData = new FormData();
      formData.append('username', username);
      formData.append('timestamp', new Date().toISOString());

      if (avatarInput.files && avatarInput.files[0]) {
        formData.append('avatar', avatarInput.files[0]);
      }
      if (docsInput.files) {
        for (let i = 0; i < docsInput.files.length; i++) {
          formData.append('documents', docsInput.files[i]);
        }
      }

      executeRequest('/files/upload-fields', {
        method: 'POST',
        body: formData,
      });
    }

    function testListFiles() {
      executeRequest('/files/list');
    }

    function triggerDownload() {
      const filename = document.getElementById('download-filename').value.trim();
      if (!filename) {
        alert('Ingresa el nombre del archivo a descargar');
        return;
      }
      window.open('/files/download/' + encodeURIComponent(filename), '_blank');
    }

    // Examples Handlers
    function testInspectRequest() {
      executeRequest('/examples/inspect-request', {
        headers: {
          'Authorization': 'Bearer demo-token-xyz-123',
          'X-Client-Custom': 'Browser-Test-Client',
        },
      });
    }

    function testCustomHeaders() {
      executeRequest('/examples/custom-headers');
    }

    function testPipesShowcase() {
      executeRequest('/examples/pipes-showcase?active=true&tags=nest,typescript,web&page=5');
    }

    function testCustomStatus() {
      executeRequest('/examples/custom-status', {
        method: 'POST',
      });
    }

    function testExpressInterop() {
      executeRequest('/examples/express-interop');
    }
  </script>
</body>
</html>`;
  }
}
