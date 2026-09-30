export async function loadLog() {
  const logBox = document.getElementById("logs");

  try {
    const response = await fetch("/api/logs/");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to load logs");
    }

    logBox.innerText = data.log || "";
    logBox.scrollTop = logBox.scrollHeight;
  } catch (err) {
    console.error(err);
  }
}

export function clearlog() {
    fetch("/api/logs/clear", {method: "POST"})

        .then(res => res.json())
        .then(data => {console.log(data.status);})
        .catch(err => {console.error("Failed to clear log:", err);});
}

export function connectLogSocket() {
    const socket = new WebSocket(
        `${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/api/ws/logs`
    );

    socket.onmessage = (event) => {
        const logBox = document.getElementById("logs");

        logBox.innerText += event.data + "\n";
        logBox.scrollTop = logBox.scrollHeight;
    };
}