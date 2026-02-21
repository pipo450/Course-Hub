import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, 'data.json');

const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/registrar-usuario') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const userData = JSON.parse(body);

                // Read existing data
                const data = await fs.readFile(dataFilePath, 'utf-8');
                const jsonData = JSON.parse(data);

                // Add new user
                if (!jsonData.usuarios) {
                    jsonData.usuarios = [];
                }
                jsonData.usuarios.push(userData);

                // Write updated data
                await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2));

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Usuario registrado con éxito' }));

            } catch (error) {
                console.error('Error processing registration:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error al registrar usuario', error: error.message }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = 3001; // Use a different port than your AI server
server.listen(PORT, () => {
    console.log(`Registro server running on port ${PORT}`);
});