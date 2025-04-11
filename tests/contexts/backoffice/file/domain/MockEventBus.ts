import { DomainEvent } from '../../../../../src/contexts/backoffice/file/domain/DomainEvent';
import { EventBus } from '../../../../../src/contexts/backoffice/file/domain/EventBus';

export default class MockEventBus implements EventBus {
	private readonly mockPublish: jest.Mock;
	constructor() {
		this.mockPublish = jest.fn();
	}

	public async publish(_: DomainEvent): Promise<void> {
		this.mockPublish(_);

		return Promise.resolve();
	}

	public assertBusToHaveBeenCalledWith(expected: DomainEvent): void {
		const calls = this.mockPublish.mock.calls;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const calledEvent = calls[0][0] as DomainEvent;
		expect(expected.equals(calledEvent)).toBe(true);
	}
}
