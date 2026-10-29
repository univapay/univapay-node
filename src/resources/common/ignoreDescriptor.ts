import { ResponseErrorCode } from "../../errors/APIError.js";
import { RequestResponseBaseError } from "../../errors/RequestResponseError.js";

type WithOptionalDescriptor<Data> = Data | Omit<Data, "descriptor">;
export const ignoreDescriptor = async <Data extends { descriptor?: string }, Response>(
    execute: (data: WithOptionalDescriptor<Data>) => Promise<Response>,
    data: Data,
): Promise<Response> => {
    try {
        // Await so rejected promises reach the catch block
        return await execute(data);
    } catch (error) {
        const isDescriptorNotSupportedError =
            error instanceof RequestResponseBaseError &&
            error.errorResponse.code === ResponseErrorCode.ValidationError &&
            error.errorResponse.errors.length === 1 &&
            error.errorResponse.errors.find(
                (e) =>
                    "field" in e && e.field === "descriptor" && e.reason === ResponseErrorCode.NotSupportedByProcessor,
            );

        if (isDescriptorNotSupportedError) {
            const { descriptor, ...clonedData } = data; // eslint-disable-line @typescript-eslint/no-unused-vars

            return execute(clonedData);
        } else {
            throw error;
        }
    }
};
