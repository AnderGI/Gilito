import { AfterAll, BeforeAll, Given, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { exec } from 'child_process';
import { configDotenv } from 'dotenv';
import path from 'path';
import request from 'supertest';

import { BackofficeBackendApp } from '../../../../../../src/apps/backoffice/backend/BackofficeBackendApp';
import container from '../../../../../../src/apps/backoffice/backend/dependency-injection/diod.config';
import EnvironmentArranger from '../../../../../contexts/shared/infrastructure/typeorm/EnvironmentArranger';

let _request: request.Test;
let application: BackofficeBackendApp;
let _response: request.Response;
const arrenger = container.get(EnvironmentArranger);

// -------- INIT & TEARDOWN --------
BeforeAll(async () => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const envFile = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV!}`);
	configDotenv({ path: envFile });
	application = new BackofficeBackendApp();
	await application.start();
	await arrenger.clean();
});

AfterAll(async () => {
	await arrenger.clean();
	await arrenger.close();
	await application.stop();

	setTimeout(() => process.exit(0), 30000);
});

// -------- GIVEN --------
Given('I send a GET request to {string}', (route: string) => {
	_request = request(application.httpServer).get(route);
});

Given('I send a PUT request to {string} with body:', (route: string, body: string) => {
	_request = request(application.httpServer)
		.put(route)
		.send(JSON.parse(body) as object);
});

// -------- THEN --------
Then('the response status code should be {int}', async (status: number) => {
	_response = await _request.expect(status);
});

Then('the response should be empty', () => {
	assert.deepStrictEqual(_response.body, {});
});

let _curlStatus = 0;

Given(
	'I upload {string} via curl to {string} with mime type {string}',
	async (filename: string, route: string, mimeType: string) => {
		const filePath = path.resolve(process.cwd(), 'uploads', filename);
		const url = `http://localhost:5000${route}`;

		const curlCommand = `curl -s -o /dev/null -w "%{http_code}" -X PUT ${url} -F "data=@${filePath};type==${mimeType}"`;

		await new Promise<void>(resolve => {
			exec(curlCommand, (error, stdout, stderr) => {
				console.log(' 📤 CURL STDOUT:', stdout);
				console.error(' ❌ CURL STDERR:', stderr);
				if (error) {
					console.error('⚠️ CURL Error object:', error);
				}

				const lines = stdout.trim().split('\n');
				const statusLine = lines[lines.length - 1];
				_curlStatus = parseInt(statusLine, 10) || 0;

				resolve();
			});
		});
	}
);

Then('the curl response status should be {int}', (expected: number) => {
	assert.strictEqual(_curlStatus, expected);
});
