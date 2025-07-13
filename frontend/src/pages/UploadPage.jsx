import { useState } from "react";
import axios from "axios";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!file || !query) return alert("Please upload a file and enter a query.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("query", query);

    try {
      const res = await axios.post("http://localhost:4000/query", formData);
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to process query.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Your Document</h1>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <textarea
        placeholder="Enter your query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full mb-4 p-2 border border-gray-300 rounded"
        rows={4}
      />
      <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>

      {response && (
        <div className="mt-4 p-4 border border-green-500 rounded">
          <p><strong>Decision:</strong> {response.decision}</p>
          <p><strong>Amount:</strong> ₹{response.amount}</p>
          <p><strong>Justification:</strong> {response.justification}</p>
        </div>
      )}
    </div>
  );
}

export default UploadPage;