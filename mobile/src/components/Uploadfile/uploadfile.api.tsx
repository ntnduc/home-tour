import { API_URL, PREFIX_URL } from "@/config";
import { filePrivateApi } from "@/services/api";
import { storage } from "@/utils/storage";
import { AxiosProgressEvent } from "axios";
// Dùng API legacy của expo-file-system cho upload + progress
import * as FileSystem from "expo-file-system/legacy";
import { UploadedFile } from "./UploadFile";

// Upload 1 file bằng expo-file-system, hỗ trợ progress
export const uploadFile = async (
  file: UploadedFile,
  onChange?: (status: "success" | "error" | "loading", progressEvent?: AxiosProgressEvent) => void
) => {
  try {
    const token = await storage.getAccessToken();
    const uploadUrl = `${API_URL}${PREFIX_URL}/upload-file/upload`;

    // Tạo task upload với MULTIPART, fieldName = 'file'
    const uploadTask = FileSystem.createUploadTask(
      uploadUrl,
      file.uri,
      {
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: "file",
        parameters: {
          // Thêm meta nếu backend cần, ví dụ: fileName
          fileName: file.name || `file_${Date.now()}`,
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
      console.log("💞💓💗💞💓💗 ~ uploadFile ~ httpError:", {
        status: result.status,
        body: result.body,
      });
      onChange?.("error");
      throw new Error(`Upload failed with status ${result.status}`);
    }
    let data: any = null;
    if (result.body) {
      try {
        data = JSON.parse(result.body);
      } catch (parseError) {
        console.log("💞💓💗💞💓💗 ~ uploadFile ~ parseError:", parseError);
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

// Upload nhiều file 1 lần (không cần progress chi tiết từng file)
export const uploadFileCollection = async (
  files: UploadedFile[],
  onChange?: (status: "success" | "error" | "loading", progressEvent?: AxiosProgressEvent) => void
) => {
  try {
    onChange?.("loading");

    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append("files", {
        uri: file.uri,
        type: file.mimeType || "application/octet-stream",
        name: file.name || `file_${Date.now()}_${index}`,
      } as any);
    });

    const response = await filePrivateApi.post("/upload-file/upload-collection", formData, {
      onUploadProgress: (progressEvent) => {
        onChange?.("loading", progressEvent);
      },
    });

    onChange?.("success");
    return response.data;
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
  const response = await filePrivateApi.delete(`/upload-file/delete/${fileId}`);
  return response.data;
};

export const getFile = async (fileId: string) => {
  const response = await filePrivateApi.get(`/upload-file/get/${fileId}`);
  return response.data;
};

export const getFilesCollection = async (fileCollectionId: string) => {
  const response = await filePrivateApi.get(`/upload-file/get-collection/${fileCollectionId}`);
  return response.data;
};