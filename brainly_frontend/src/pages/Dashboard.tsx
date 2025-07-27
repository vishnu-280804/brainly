import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CreateContentModel } from "../components/CreateContentModel";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { SideBar } from "../components/SideBar";
import axios from "axios";
import { backendURL } from "../config";

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [contents, setContents] = useState([]);

  const fetchContent = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/v1/content`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      setContents(res.data.content);
    } catch (err) {
      console.error("Error fetching content", err);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <div>
      <SideBar />
      <div className="p-4 ml-72 min-h-screen bg-gray-100 border-2">
        <CreateContentModel
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            fetchContent();
          }}
          onContentAdded={() => {
            fetchContent();
            setModalOpen(false);
          }}
        />

        <div className="flex justify-end gap-4">
          <Button
            size="md"
            onClick={() => setModalOpen(true)}
            variant="primary"
            text="Add content"
            startIcon={<PlusIcon size="md" />}
          />
          <Button
            size="md"
            onClick={async () => {
              try {
                const response = await axios.post(
                  `${backendURL}/api/v1/brain/share`,
                  { share: true },
                  {
                    headers: {
                      Authorization: localStorage.getItem("token") || "",
                    },
                  }
                );
                const shareUrl = `http://localhost:5173/share/${response.data.link}`;
                alert(shareUrl);
              } catch (err) {
                console.error("Failed to generate share link", err);
                alert("Error generating share link.");
              }
            }}
            variant="secondary"
            text="Share brain"
            startIcon={<ShareIcon size="md" />}
          />
        </div>

        <div className="flex gap-4 flex-wrap mt-6">
          {contents.map((item: any) => (
            <Card
              key={item._id}
              title={item.title}
              typeLink={item.type}
              link={item.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
