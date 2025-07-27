// useContent.tsx
import axios from "axios";
import { useEffect, useState } from "react";
import { backendURL } from "../config";

export function useContent() {
    const [contents, setContents] = useState([]);

    function refresh() {
        axios.get(`${backendURL}/api/v1/content`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
        .then((response) => {
            setContents(response.data.content);
        })
        .catch((err) => {
            console.error("Failed to fetch contents:", err);
        });
    }

    useEffect(() => {
        refresh();
    }, []);

    return { contents, refresh };
}
