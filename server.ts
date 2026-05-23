/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { parseKnowledgePoints } from './src/data';
import { generateKnowledgeHTML } from './src/htmlGenerator';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize and load the math points data on server bootstrap
  const knowledgePoints = parseKnowledgePoints();

  // Route: Health check API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', count: knowledgePoints.length });
  });

  // Route: Custom raw physical static HTML file server endpoint
  app.get('/knowledge-custom/:htmlFile', (req, res) => {
    const fileParam = req.params.htmlFile;
    const decodedFileParam = decodeURIComponent(fileParam);

    const publicPaths = [
      path.join(process.cwd(), 'public', 'knowledge', decodedFileParam),
      path.join(process.cwd(), 'public', '知识', decodedFileParam),
      path.join(process.cwd(), 'public', decodedFileParam),
      path.join(process.cwd(), 'public', 'knowledge', fileParam),
      path.join(process.cwd(), 'public', '知识', fileParam),
      path.join(process.cwd(), 'public', fileParam),
    ];

    for (const p of publicPaths) {
      if (fs.existsSync(p)) {
        return res.sendFile(p);
      }
    }
    res.status(404).send('Not Found');
  });

  // Route: Custom iframe handler for each of the 240 knowledge points.
  // This captures path requests like "./knowledge/认识10以内的数字.html"
  app.get('/knowledge/:htmlFile', (req, res) => {
    const fileParam = req.params.htmlFile;
    
    // Decode Chinese URL parameter
    const decodedFileParam = decodeURIComponent(fileParam);

    // Let's check if the physical file exists in /public or /public/知识 or /public/knowledge
    const publicPaths = [
      path.join(process.cwd(), 'public', 'knowledge', decodedFileParam),
      path.join(process.cwd(), 'public', '知识', decodedFileParam),
      path.join(process.cwd(), 'public', decodedFileParam),
      path.join(process.cwd(), 'public', 'knowledge', fileParam),
      path.join(process.cwd(), 'public', '知识', fileParam),
      path.join(process.cwd(), 'public', fileParam),
    ];

    let customGameUrl: string | undefined = undefined;
    for (const p of publicPaths) {
      if (fs.existsSync(p)) {
        customGameUrl = `/knowledge-custom/${encodeURIComponent(fileParam)}`;
        break;
      }
    }

    // Strip trailing .html for dynamic lookup
    const nameWithoutExt = decodedFileParam.endsWith('.html') 
      ? decodedFileParam.substring(0, decodedFileParam.length - 5) 
      : decodedFileParam;

    const pointName = nameWithoutExt;

    // Look it up in our 240+ dataset
    const foundPoint = knowledgePoints.find(
      (p) => p.name === pointName || p.id === pointName
    );

    let category = '数与代数';
    let subCategory = '数的认识';
    let grade = '';
    let finalTitle = pointName;

    if (foundPoint) {
      category = foundPoint.category;
      subCategory = foundPoint.subCategory;
      grade = foundPoint.grade;
      finalTitle = foundPoint.name;
    }

    // Generate responsive, interactive HTML layout 
    const html = generateKnowledgeHTML(finalTitle, category, subCategory, grade, customGameUrl);
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  });

  // Setup Hot Module Replacement or standard spa routers depending on mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log(`[Development] Server running on http://0.0.0.0:${PORT}`);
  } else {
    // production static paths
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // Fallback all other client-side routing to index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log(`[Production] Server running on http://0.0.0.0:${PORT}`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Math Preview Port configured at ${PORT}`);
  });
}

startServer();
