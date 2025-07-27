import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface ContentItem {
  _id: string;
  title: string;
  content: string;
}

export const SharePage = () => {
  const { shareId } = useParams();
  const [sharedContent, setSharedContent] = useState<ContentItem[]>([]);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchSharedContent = async () => {
      try {
        if (!shareId) {
          console.error("shareId is undefined");
          return;
        }
        const res = await axios.get(
          `http://localhost:3000/api/v1/brain/${shareId}`
        );

        setSharedContent(res.data.content); // ✅ correct key
        setUsername(res.data.username);     // ✅ username
      } catch (err) {
        console.error("Error loading shared brain", err);
      }
    };

    fetchSharedContent();
  }, [shareId]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Shared Content</h1>
      {username && (
        <h2 className="text-lg text-gray-600 mb-4">Shared by: {username}</h2>
      )}
      {sharedContent.length > 0 ? (
        <div className="space-y-4">
          {sharedContent.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded shadow bg-white"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-2">{item.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading or content not found...</p>
      )}
    </div>
  );
};
