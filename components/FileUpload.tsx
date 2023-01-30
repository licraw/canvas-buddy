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
  margin-bottom: 32px;
  width: 350px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
`;

const FileWrapper = styled.div`
  border: solid black 1px;
  padding: 16px;
  margin: 16px 0;
`;

const FileUploader: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string[]>([]);
  const [innerHTML, setInnerHTML] = useState<string | null>(null);
  const [sendData, setSendData] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<File[]>([]);

  useEffect(() => {
    if (selectedFile) {
      setFileList([...fileList, selectedFile]);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setHtmlContent([...htmlContent, e.target.result]);
      };
      reader.readAsText(selectedFile);
    }
  }, [selectedFile]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];
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

    setSelectedFile(file);
  }, []);

  useEffect(() => {
    if (sendData === true) {
      const htmlContentBlob = new Blob([extractMainContents(htmlContent)], {
        type: "text/html",
      });
      const formData = new FormData();
      formData.append("file", htmlContentBlob);
      fetch("http://localhost:3001", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((data) => {
          setInnerHTML(data);
          console.log("innerHTML: ", innerHTML);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [htmlContent, sendData]);

  const extractMainContents = (htmlArray: string[]) => {
    const mainContents = htmlArray.map((html, index) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const mainElement = doc.querySelector(".quiz-submission");
      let result = `<h2 class=display_question quiz-file id="question_${index + 1}">Quiz ${index + 1}</h2>`;
      if (mainElement) {
        result += `<div>${mainElement.innerHTML}</div>`;
      }
      return result;
    });
    return mainContents.join("");
};

  const handleSumbit = () => {
    setSendData(true);
    const mainContents = extractMainContents(htmlContent);
    console.log("mainContents: ", mainContents);
    console.log(htmlContent);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <PageWrapper>
      {innerHTML ? (
        <QuizWrapper>
          {innerHTML && <div dangerouslySetInnerHTML={{ __html: innerHTML }} />}
        </QuizWrapper>
      ) : (
        <>
          {" "}
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <UploadWrapper>
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag and drop some files here, or click to select files</p>
              )}
            </UploadWrapper>
          </div>
          <ButtonWrapper>
            <button onClick={handleSumbit}>Build Study Guide</button>
            {fileList &&
              fileList.map((file) => (
                <FileWrapper key={file.name}>{file.name}</FileWrapper>
              ))}
          </ButtonWrapper>
        </>
      )}
    </PageWrapper>
  );
};

export default FileUploader;
