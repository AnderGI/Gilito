import { BeforeAll, Given, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { createReadStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import path, { basename } from 'path';
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
		const filestream = createReadStream(filePath);

		_request = request(application.httpServer)
			.put(route)
			.attach('data', filestream, { filename: basename(filePath), contentType: 'text/plain' });
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
		writeFileSync(jsonPath, JSON.stringify({ mensaje: 'Este archivo no debería ser válido' }));
	}

	application = new BackofficeBackendApp();
	application.start();
});
