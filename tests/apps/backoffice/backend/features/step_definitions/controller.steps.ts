import { AfterAll, BeforeAll, Given, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { createReadStream, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import request from 'supertest';

import { BackofficeBackendApp } from '../../../../../../src/apps/backoffice/backend/BackofficeBackendApp';

let _request: request.Test;
let application: BackofficeBackendApp;
let _response: request.Response;

// -------- GET --------
Given('I send a GET request to {string}', (route: string) => {
	_request = request(application.httpServer).get(route);
});

Given(
	'I send a PUT request to {string} with a fake file of type {string}',
	(route: string, mimeType: string) => {
		const uploadsDir = path.resolve(process.cwd(), 'tests/uploads');
		mkdirSync(uploadsDir, { recursive: true });

		const ext = mimeType.includes('json') ? 'json' : 'txt';
		const filename = `auto-generated.${ext}`;
		const fullPath = path.join(uploadsDir, filename);

		const content =
			ext === 'json' ? JSON.stringify({ auto: true }) : 'Contenido de prueba automático';

		writeFileSync(fullPath, content);

		const fileStream = createReadStream(fullPath);

		_request = request(application.httpServer).put(route).attach('data', fileStream, {
			filename,
			contentType: mimeType
		});
	}
);

// -------- THEN --------
Then('the response status code should be {int}', async (status: number) => {
	_response = await _request.expect(status);
});

Then('the response should be empty', () => {
	assert.deepStrictEqual(_response.body, {});
});

// -------- INIT & TEARDOWN --------
BeforeAll(() => {
	application = new BackofficeBackendApp();
	application.start();
});

AfterAll(() => {
	application.stop();
});
