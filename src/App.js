import { useState } from "react";
import "./App.css";

function App() {
  const [differences, setDifferences] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    procesFiles(files);
  };

  const handleChange = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    procesFiles(files);
  };

  const procesFiles = (files) => {
    if (files.length < 2 || !files) return;

    const readers = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          resolve({
            name: file.name,
            content: reader.result.split("\n") || e.target.result.split("\n"),
          });
        };

        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsText(file);
      });
    });

    Promise.all(readers)
      .then((processedFiles) => {
        console.log("processedFiles", processedFiles);
      })
      .catch((error) => {
        console.error("Error resolving promises", error);
      });
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center ">
      <div className="h-full w-full flex flex-col p-4 gap-4 md:flex-row md:h-[500px] md:w-[768px] lg:w-[1000px] shadow-xl">
        <form
          className="flex flex-col items-center border h-full w-full border-dashed border-black rounded-lg cursor-pointer bg-gray-100"
          action="submit"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <label htmlFor="click" className="m-auto cursor-pointer">
            Click here to upload files or drag and drop
            <input
              id="click"
              className="hidden"
              type="file"
              multiple
              accept=".csv, .txt"
              onChange={handleChange}
            />
          </label>
        </form>
        <div className="flex flex-col w-full h-full p-2 border border-black border-dashed rounded-lg">
          differences
        </div>
      </div>
    </div>
  );
}

export default App;
