export default async function handler(req, res) {
  console.log("Proxy request received:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  try {
    const response = await fetch("https://tarkov.dev/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching from Tarkov API:", error);
    res.status(500).json({ error: "Failed to fetch data from Tarkov API" });
  }
}
