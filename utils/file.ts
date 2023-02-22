import httpClient from "@/apis";
import config from "@/config";
import { S3File } from "@/types/file.interface";

export const getFileDownloadUrl = (file: S3File) => {
  return `${config.baseURL}/api/file/download/${file.fileUid}`;
};

export const getFormData = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return formData;
};

export const getFileUidByFile = async (file: File) =>
  (await httpClient.file.upload(getFormData(file))).data.fileUid;
