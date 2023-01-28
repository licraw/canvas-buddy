import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  onFileAdded: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileAdded }) => {
  const handleFileAdded = useCallback((file: File) => {
    // Do any necessary file processing or validation here
    onFileAdded(file);
  }, [onFileAdded]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileAdded(acceptedFiles[0]);
    }
  }, [handleFileAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag and drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default FileUploader;

