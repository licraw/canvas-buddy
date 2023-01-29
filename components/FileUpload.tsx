import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from 'styled-components';

interface FileUploaderProps {
  onFileAdded: (file: File) => void;
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const QuizWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 600px;
  margin: 0 auto;
`;

const UploadWrapper = styled.div`
border: 2px dashed #ccc;
border-radius: 5px;
padding: 50px;
text-align: center;
`;

const FileUploader: React.FC<FileUploaderProps> = ({ onFileAdded }) => {
    const [htmlContent, setHtmlContent] = useState("");
    const handleFileAdded = useCallback((file: File) => {
        // Check file type
        if (file.type !== "text/html") {
            alert("Invalid file type. Please select an HTML file.");
            return;
        }
    
        // Check file size
        const maxFileSize = 1e6; // 1 MB
        if (file.size > maxFileSize) {
            alert(`File size too large. Please select a file less than ${maxFileSize / 1e6} MB.`);
            return;
        }
    
        // Prepare file for sending to endpoint
        const formData = new FormData();
        formData.append("file", file);
    
        // Send file to endpoint
        fetch("http://localhost:3001", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            setHtmlContent(data);
        })
        .catch(error => {
            console.error(error);
        });
    
    }, [onFileAdded]);
    

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFileAdded(acceptedFiles[0]);
      }
    },
    [handleFileAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <PageWrapper {...getRootProps()}>
      <input {...getInputProps()} />
      <UploadWrapper>
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag and drop some files here, or click to select files</p>
      )}
      </UploadWrapper>
     <QuizWrapper>{htmlContent && <div dangerouslySetInnerHTML={{ __html: htmlContent }} />}</QuizWrapper>
    </PageWrapper>
  );
};

export default FileUploader;
