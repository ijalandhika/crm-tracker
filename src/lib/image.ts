export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getFileExtensionFromBase64 = (base64String: string) => {
  const match = base64String.match(/^data:image\/(.*);base64,/);
  return match ? match[1] : "png";
};
