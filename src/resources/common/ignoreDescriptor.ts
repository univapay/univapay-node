import { ResponseErrorCode } from '../../errors/APIError';

export async function ignoreDescriptor(callback: (data: any) => any, data) {
    try {
        return await callback(data);
    } catch (error) {
        const isDescriptorNotSupportedError =
            error.errorResponse.code === ResponseErrorCode.ValidationError &&
            error.errorResponse.errors.length === 1 &&
            error.errorResponse.errors.find(
                e => e.field === 'descriptor' && e.reason === ResponseErrorCode.NotSupportedByProcessor,
            );

        if (isDescriptorNotSupportedError) {
            const { descriptor, ...reducedData } = data;

            return callback(reducedData);
        } else {
            throw error;
        }
    }
}
