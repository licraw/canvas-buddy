import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

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
  const [sendData, setSendData] = useState(false);

  const handleFileAdded = async (files: File[]) => {
    let htmlContent = "";
    for (const file of files) {
      if (file.type !== "text/html") {
        alert("Invalid file type. Please select an HTML file.");
        return;
      }

      // Check file size
      const maxFileSize = 1e6; // 1 MB
      if (file.size > maxFileSize) {
        alert(
          `File size too large. Please select a file less than ${
            maxFileSize / 1e6
          } MB.`
        );
        return;
      }

      /// Read file content
      const reader = new FileReader();
      reader.onload = (e: any) => {
        htmlContent += e.target.result;
      };
      reader.readAsText(file);
    }
    console.log(files);
    setHtmlContent(htmlContent);
    console.log(htmlContent);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileAdded(acceptedFiles);
  }, []);

  useEffect(() => {
    if (sendData) {
      fetch("http://localhost:3001", {
        method: "POST",
        body: JSON.stringify({ html: htmlContent }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [sendData, htmlContent]);

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
      <br></br>
      <button onClick={()=>setSendData}>Build Study Guide</button>
      <QuizWrapper>
        {htmlContent && (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        )}
      </QuizWrapper>
    </PageWrapper>
  );
};

export default FileUploader;
