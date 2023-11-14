import * as Buffer from 'buffer';

let fileTypeModule;

export async function getMimeTypeFromArrayBuffer(
    arrayBuffer: Buffer,
): Promise<string> {
    if (!fileTypeModule) {
        fileTypeModule = await eval(`import('file-type')`);
    }

    const fileType = await fileTypeModule.fileTypeFromBuffer(arrayBuffer);
    return fileType.mime;
}
