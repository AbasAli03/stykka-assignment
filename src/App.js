import { useState } from "react";
import "./App.css";

function App() {
  const [differences, setDifferences] = useState([]);
  const [diffIdx, setDiffIdx] = useState(0);
  const [maxIdx, setMaxIdx] = useState(0);

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

    // read file and create promises
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

    // resolve promises
    Promise.all(readers)
      .then((processedFiles) => {
        compareFiles(processedFiles);
      })
      .catch((error) => {
        console.error("Error resolving promises", error);
      });
  };

  const compareFiles = (files) => {
    if (!files || files.length < 2) return;
    let countDiffs = 0;

    const lengthToCompare = Math.min(
      files[0].content.length,
      files[1].content.length
    );

    setDifferences((prev) => []);
    setDiffIdx(0);
    setMaxIdx(lengthToCompare - 1);

    // find differnces
    for (let i = 0; i < lengthToCompare; i++) {
      let file1 = files[0].name.includes(".csv")
        ? files[0].content[i].split(",")
        : files[0].content[i].split(" ");

      let file2 = files[1].name.includes(".csv")
        ? files[1].content[i].split(",")
        : files[1].content[i].split(" ");

      const minLengths = Math.min(file1.length, file2.length);
      //  const maxLengths = Math.max(file1.length, file2.length);

      for (let j = 0; j < minLengths; j++) {
        if (
          false === file1.includes(file2[j]) ||
          false === file2.includes(file1[j])
        ) {
          countDiffs++;
          setDifferences((prev) => {
            return [
              ...prev,
              {
                lines: {
                  file1: file1,
                  file2: file2,
                },
                differentWords: [j],
              },
            ];
          });
        }
      }
    }
    setMaxIdx(countDiffs - 1);
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (diffIdx < maxIdx) {
      setDiffIdx((prev) => prev + 1);
    }
  };

  const handlePrev = (e) => {
    e.preventDefault();
    if (diffIdx > 0) {
      setDiffIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="h-full w-full flex flex-col p-4 gap-4 md:flex-row md:h-[500px] md:w-[768px] lg:w-[1000px] shadow-xl">
        <form
          className="flex items-center justify-center border h-full w-full border-dashed border-black rounded-lg cursor-pointer bg-gray-100"
          action="submit"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <label htmlFor="click" className="cursor-pointer">
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
        {differences.length > 0 && (
          <div className="flex flex-col w-full h-full p-2 border border-black border-dashed rounded-lg overflow-hidden">
            <div className="flex flex-1 flex-col gap-2 items-center justify-center overflow-y-auto">
              {differences && differences[diffIdx] && (
                <div className="overflow-y-auto">
                  <p className="flex flex-wrap gap-1 break-words hyphens-auto">
                    {differences[diffIdx].lines.file1.map((word, index) => {
                      return (
                        <span
                          className={
                            differences[diffIdx].differentWords.includes(
                              index
                            ) &&
                            !differences[diffIdx].lines.file2.includes(word)
                              ? "underline underline-offset-4 decoration-red-600"
                              : ""
                          }
                          key={`file1-${index}`}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </p>
                  <p className="flex flex-wrap gap-1 break-words hyphens-auto">
                    {differences[diffIdx].lines.file2.map((word, index) => {
                      return (
                        <span
                          className={
                            differences[diffIdx].differentWords.includes(
                              index
                            ) &&
                            !differences[diffIdx].lines.file1.includes(word)
                              ? "underline underline-offset-4 decoration-red-600"
                              : ""
                          }
                          key={`file2-${index}`}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between w-full">
              <button
                className="p-2 bg-blue-950 rounded-lg text-white"
                disabled={diffIdx === 0}
                onClick={handlePrev}
              >
                Prev
              </button>
              <button
                className="p-2 bg-blue-950 rounded-lg text-white"
                disabled={diffIdx === maxIdx}
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
