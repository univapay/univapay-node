import { ResponseErrorCode } from "../../errors/APIError.js";

type WithOptionalDescriptor<Data> = Data | Omit<Data, "descriptor">;
export const ignoreDescriptor = async <Data extends { descriptor?: string }>(
    execute: (data: WithOptionalDescriptor<Data>) => Promise<WithOptionalDescriptor<Data>>,
    data: Data,
): Promise<WithOptionalDescriptor<Data>> => {
    try {
        return execute(data);
    } catch (error) {
        const isDescriptorNotSupportedError =
            error.errorResponse.code === ResponseErrorCode.ValidationError &&
            error.errorResponse.errors.length === 1 &&
            error.errorResponse.errors.find(
                (e) => e.field === "descriptor" && e.reason === ResponseErrorCode.NotSupportedByProcessor,
            );

        if (isDescriptorNotSupportedError) {
            const { descriptor, ...clonedData } = data; // eslint-disable-line @typescript-eslint/no-unused-vars

            return execute(clonedData);
        } else {
            throw error;
        }
    }
};
