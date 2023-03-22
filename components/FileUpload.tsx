import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import Nav from "./Nav";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  max-width: 100%;
`;

const QuizWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 350px;
  margin: 0 auto;
  margin-top: 150px;
  @media (min-width: 768px) {
    width: 600px;
  }
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
  padding: 12px 20px;
  border-radius: 4px;
  margin: 16px 0;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
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
  const [fileList, setFileList] = useState<File[]>([]);
  const [error, setError] = useState(false);

  const processFiles = (files: File[]) => {
    const validFiles: File[] = [];
    let hasError = false;

    files.forEach((file) => {
      if (file.type !== "text/html") {
        hasError = true;
        return;
      }

      // Check file size
      const maxFileSize = 1e6; // 1 MB
      if (file.size > maxFileSize) {
        hasError = true;
        return;
      }

      validFiles.push(file);
    });

    setError(hasError);
    setFileList([...fileList, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setHtmlContent((prevHtmlContent) => [
          ...prevHtmlContent,
          e.target.result,
        ]);
      };
      reader.readAsText(file);
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    }

    processFiles(acceptedFiles);
  }, []);

  useEffect(() => {
    if (sendData === true) {
      const htmlContentBlob = new Blob([extractMainContents(htmlContent)], {
        type: "text/html",
      });
      const formData = new FormData();
      formData.append("file", htmlContentBlob);
      fetch("https://canvas-bud.herokuapp.com/", {
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
      let result: string = `<h2 class=display_question quiz-file id="question_${
        index + 1
      }">Quiz ${index + 1}</h2>`;
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
        <>
          <Nav numberOfQuizzes={htmlContent.length} />
          <QuizWrapper>
            {innerHTML && (
              <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
            )}
          </QuizWrapper>
        </>
      ) : (
        <>
          {" "}
          <h1>Canvas Study Guide Maker</h1>
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
          {error && (
            <ErrorMessage>
              Invalid file type or file size too large. Please upload a valid
              HTML file less than 1 MB.
            </ErrorMessage>
          )}
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
