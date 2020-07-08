import { ResponseErrorCode } from "../../errors/APIError";

type WithOptionalDescriptor<Data> = Data | Omit<Data, "descriptor">;
export async function ignoreDescriptor<Data extends { descriptor?: string }>(
    callback: (data: WithOptionalDescriptor<Data>) => Promise<WithOptionalDescriptor<Data>>,
    data: Data
): Promise<WithOptionalDescriptor<Data>> {
    try {
        return callback(data);
    } catch (error) {
        const isDescriptorNotSupportedError =
            error.errorResponse.code === ResponseErrorCode.ValidationError &&
            error.errorResponse.errors.length === 1 &&
            error.errorResponse.errors.find(
                (e) => e.field === "descriptor" && e.reason === ResponseErrorCode.NotSupportedByProcessor
            );

        if (isDescriptorNotSupportedError) {
            const { ...clonedData } = data;
            delete clonedData.descriptor;

            return callback(clonedData);
        } else {
            throw error;
        }
    }
}
