/* eslint-disable @typescript-eslint/no-explicit-any */

import ValueObject from '../../../../shared/domain/ValueObject';
import { NewableClass } from './Newable';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ValueObjectTransformer = (ValueObject: NewableClass<ValueObject<any>>) => {
	return {
		to: (value: ValueObject<any>): any => value.value,
		from: (value: any): ValueObject<any> => new ValueObject(value)
	};
};
