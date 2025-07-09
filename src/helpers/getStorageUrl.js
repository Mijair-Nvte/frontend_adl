// helpers/getStorageUrl.js
export function getStorageUrl(file) {
  if (!file) return "";
  // Si el backend te manda "file_path": "tesoreria/archivo.png"
  // y tu variable de entorno es "NEXT_PUBLIC_STORAGE_URL=http://localhost:8000/storage/"
  if (file.file_path)
    return `${process.env.NEXT_PUBLIC_STORAGE_URL.replace(/\/$/, "")}/${file.file_path}`;
  if (file.url && file.url.startsWith("http")) return file.url;
  return "";
}
