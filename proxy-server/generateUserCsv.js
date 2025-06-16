const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const inputCSV = path.join(__dirname, "rawUserData.csv"); // Your raw file
const outputCSV = path.join(__dirname, "users_final.csv");

const clientsMap = new Map(); // agent => array of clients
const agentsSet = new Set();

fs.createReadStream(inputCSV)
  .pipe(csv())
  .on("data", (row) => {
    const rawName = row["NAME"]?.trim();
    const agent = row["AGENT"]?.trim();

    if (!rawName || !agent) return;

    if (!clientsMap.has(agent)) {
      clientsMap.set(agent, []);
    }

    clientsMap.get(agent).push(rawName);
    agentsSet.add(agent);
  })
  .on("end", () => {
    const users = [];

    // Add admin
    users.push({
      Username: "admin",
      Password: "admin123",
      Role: "admin",
      LinkedClients: "",
      PhoneNumber: "911111111111",
      DisplayName: "Admin",
    });

    let clientIndex = 1;

    // First add clients
    for (const [agent, clientNames] of clientsMap.entries()) {
      clientNames.forEach((clientName) => {
        const username = `client${clientIndex++}`;
        users.push({
          Username: username,
          Password: `pass${Math.floor(1000 + Math.random() * 9000)}`,
          Role: "client",
          LinkedClients: "",
          PhoneNumber: "9" + Math.floor(1000000000 + Math.random() * 900000000),
          DisplayName: clientName,
          Agent: agent,
        });
      });
    }

    // Now add agents
// Now add agents with client display names in LinkedClients
let agentIndex = 1;
for (const [agentName, clientNames] of clientsMap.entries()) {
  const username = `agent${agentIndex++}`;

  users.push({
    Username: username,
    Password: `agent${Math.floor(1000 + Math.random() * 9000)}`,
    Role: "agent",
    LinkedClients: clientNames.join(", "), // ✅ Use full client names
    PhoneNumber: "9" + Math.floor(1000000000 + Math.random() * 900000000),
    DisplayName: agentName,
  });
}


    const csvWriter = createCsvWriter({
      path: outputCSV,
      header: [
        { id: "Username", title: "Username" },
        { id: "Password", title: "Password" },
        { id: "Role", title: "Role" },
        { id: "LinkedClients", title: "LinkedClients" },
        { id: "PhoneNumber", title: "PhoneNumber" },
        { id: "DisplayName", title: "DisplayName" },
      ],
    });

    csvWriter.writeRecords(users).then(() => {
      console.log("✅ users_final.csv created successfully.");
    });
  });
