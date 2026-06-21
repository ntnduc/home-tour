import { API_URL, PREFIX_URL } from "@/config";
import { filePrivateApi, privateApi } from "@/services/api";
import { storage } from "@/utils/storage";
import { AxiosProgressEvent } from "axios";
// Dùng API legacy của expo-file-system cho upload + progress
import * as FileSystem from "expo-file-system/legacy";
import { FileCollectionDetailResponse, UploadedFile, UploadFileDto } from "./types";

// Upload 1 file bằng expo-file-system, hỗ trợ progress
export const uploadFile = async (
  file: UploadedFile,
  postData?: UploadFileDto,
  onChange?: (status: "success" | "error" | "loading", progressEvent?: AxiosProgressEvent) => void
) => {
  try {
    const token = await storage.getAccessToken();
    const uploadUrl = `${API_URL}${PREFIX_URL}/upload-file/upload`;
    const parameters = {
      originalName: file.name || `file_${Date.now()}`,
      category: postData?.category ?? '',
      description: postData?.description ?? '',
      relatedEntityType: postData?.relatedEntityType ?? '',
      relatedEntityId: postData?.relatedEntityId ?? '',
      propertyId: postData?.propertyId ?? '',
      isPublic: postData?.isPublic ? 'true' : 'false',
      fileEntryId: postData?.fileEntryId ?? '',
    }

    const uploadTask = FileSystem.createUploadTask(
      uploadUrl,
      file.uri,
      {
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: "file",
        parameters: {
          ...parameters,
        },
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
      (progress: FileSystem.UploadProgressData) => {
        const fakeAxiosProgress: AxiosProgressEvent = {
          loaded: progress.totalBytesSent,
          total: progress.totalBytesExpectedToSend,
        } as AxiosProgressEvent;
        onChange?.("loading", fakeAxiosProgress);
      },
    );

    const result = await uploadTask.uploadAsync();
    if (!result) {
      throw new Error("Upload task returned no result");
    }

    if (result.status && result.status >= 400) {
      onChange?.("error");
      throw new Error(`Upload failed with status ${result.status}`);
    }
    let data: any = null;
    if (result.body) {
      try {
        data = JSON.parse(result.body);
      } catch (parseError) {
        data = result.body;
      }
    }

    onChange?.("success");
    return data;
  } catch (error) {
    console.log("💞💓💗💞💓💗 ~ uploadFile ~ error raw:", error);
    if (error instanceof Error) {
      console.log("💞💓💗💞💓💗 ~ uploadFile ~ error message:", error.message);
      console.log("💞💓💗💞💓💗 ~ uploadFile ~ error stack:", error.stack);
    }
    onChange?.("error");
    throw error;
  }
};

// Upload nhiều file theo endpoint mới /upload/multiple, có progress
export const uploadFileCollection = async (
  files: UploadedFile[],
  dto?: UploadFileDto,
  onChange?: (status: "success" | "error" | "loading", progressEvent?: AxiosProgressEvent) => void
) => {
  try {
    const token = await storage.getAccessToken();
    const uploadUrl = `${API_URL}${PREFIX_URL}/upload-file/upload/multiple`;

    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append("files", {
        uri: file.uri,
        type: file.mimeType || "application/octet-stream",
        name: file.name || `file_${Date.now()}_${index}`,
      } as any);
    });

    if (dto?.name) formData.append("name", dto.name);
    if (dto?.category) formData.append("category", dto.category);
    if (dto?.description) formData.append("description", dto.description);
    if (dto?.relatedEntityType) formData.append("relatedEntityType", dto.relatedEntityType);
    if (dto?.relatedEntityId) formData.append("relatedEntityId", dto.relatedEntityId);
    if (dto?.propertyId) formData.append("propertyId", dto.propertyId);
    if (dto?.collectionId) formData.append("collectionId", dto.collectionId);
    if (typeof dto?.isPublic === "boolean") {
      formData.append("isPublic", String(dto.isPublic));
    }

    const responseData = await new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("POST", uploadUrl);
      xhr.setRequestHeader("Accept", "application/json");
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.upload.onprogress = (event) => {
        const fakeAxiosProgress: AxiosProgressEvent = {
          loaded: event.loaded,
          total: event.total,
        } as AxiosProgressEvent;
        onChange?.("loading", fakeAxiosProgress);
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          if (!xhr.responseText) {
            resolve(null);
            return;
          }

          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (e) {
            resolve(xhr.responseText);
          }
          return;
        }

        reject(new Error(`Upload failed with status ${xhr.status}`));
      };

      xhr.onerror = () => reject(new Error("Network error while uploading multiple files"));
      xhr.onabort = () => reject(new Error("Upload aborted"));

      xhr.send(formData);
    }).then(response => {
      onChange?.("success");
      return response;
    }).catch(error => {
      onChange?.("error");
      throw error;
    });

    return responseData;
  } catch (error) {
    onChange?.("error");
    throw error;
  }
};

export const deleteFileCollection = async (fileCollectionId: string) => {
  const response = await filePrivateApi.delete(`/upload-file/delete-collection/${fileCollectionId}`);
  return response.data;
};

export const deleteFile = async (fileId: string) => {
  const response = await privateApi.delete(`/upload-file/file/${fileId}`);
  return response.data;
};

export const getFile = async (fileId: string) => {
  const response = await filePrivateApi.get(`/upload-file/${fileId}`);
  return response.data;
};

export const getFileUrl = (fileId: string): string => {
  return API_URL + PREFIX_URL + '/upload-file/' + fileId;
}

export const getFilesCollection = async (fileCollectionId: string): Promise<FileCollectionDetailResponse> => {
  const response = await filePrivateApi.get(`/upload-file/collection/${fileCollectionId}`);
  return response.data?.data;
};