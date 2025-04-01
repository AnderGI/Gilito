import { AfterAll, BeforeAll, Given, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { createReadStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import request from 'supertest';

import { BackofficeBackendApp } from '../../../../../../src/apps/backoffice/backend/BackofficeBackendApp';

let _request: request.Test;
let application: BackofficeBackendApp;
let _response: request.Response;

Given('I send a GET request to {string}', (route: string) => {
	_request = request(application.httpServer).get(route);
});

Then('the response status code should be {int}', async (status: number) => {
	_response = await _request.expect(status);
});

Given(
	'I send a PUT request to {string} with file in {string}',
	(route: string, filePath: string) => {
		const fullPath = path.resolve(process.cwd(), filePath);

		// Auto-crear si no existe
		if (!fs.existsSync(fullPath)) {
			console.warn(`[Auto-crear] Archivo no encontrado. Generando: ${fullPath}`);

			const ext = path.extname(fullPath);
			const dir = path.dirname(fullPath);

			fs.mkdirSync(dir, { recursive: true });

			if (ext === '.txt') {
				fs.writeFileSync(fullPath, 'Contenido dummy generado automáticamente');
			} else if (ext === '.json') {
				fs.writeFileSync(fullPath, JSON.stringify({ auto: true }));
			} else {
				throw new Error(`Extensión de archivo no soportada: ${ext}`);
			}
		}

		const filestream = createReadStream(fullPath);

		_request = request(application.httpServer)
			.put(route)
			.attach('data', filestream, {
				filename: path.basename(fullPath),
				contentType: 'text/plain'
			});
	}
);

Then('the response should be empty', () => {
	assert.deepStrictEqual(_response.body, {});
});

BeforeAll(() => {
	const uploadsPath = path.resolve(process.cwd(), 'tests/uploads');
	mkdirSync(uploadsPath, { recursive: true });

	const txtPath = path.join(uploadsPath, '01-demo.txt');
	const jsonPath = path.join(uploadsPath, '01-demo.json');

	if (!existsSync(txtPath)) {
		writeFileSync(txtPath, 'Contenido de prueba para 01-demo.txt');
	}

	if (!existsSync(jsonPath)) {
		writeFileSync(jsonPath, JSON.stringify({ mensaje: 'Contenido inválido' }));
	}

	application = new BackofficeBackendApp();
	application.start();
});

AfterAll(() => {
	application.stop();
});
