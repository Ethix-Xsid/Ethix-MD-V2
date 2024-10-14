/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { RequestOptions } from "../../types";
import { FileMetadata, FileMetadataResponse, ListFilesResponse, ListParams, UploadFileResponse } from "./types";
export interface UploadMetadata {
    name?: string;
    ["display_name"]?: string;
}
/**
 * Class for managing GoogleAI file uploads.
 * @public
 */
export declare class GoogleAIFileManager {
    apiKey: string;
    private _requestOptions?;
    constructor(apiKey: string, _requestOptions?: RequestOptions);
    /**
     * Upload a file
     */
    uploadFile(filePath: string, fileMetadata: FileMetadata): Promise<UploadFileResponse>;
    /**
     * List all uploaded files
     */
    listFiles(listParams?: ListParams): Promise<ListFilesResponse>;
    /**
     * Get metadata for file with given ID
     */
    getFile(fileId: string): Promise<FileMetadataResponse>;
    /**
     * Delete file with given ID
     */
    deleteFile(fileId: string): Promise<void>;
}
