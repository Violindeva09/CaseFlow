const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Serve static files (like style.css from public folder)
app.use(express.static("public"));

// In-memory tickets for demo
let tickets = [];

// Routes
app.get("/", (req, res) => {
  res.render("login");
});

app.post("/dashboard", (req, res) => {
  const role = req.body.role;
  if (role === "customer") {
    res.redirect("/customer");
  } else if (role === "agent") {
    res.redirect("/agent");
  } else {
    res.redirect("/supervisor");
  }
});

// Customer Dashboard
app.get("/customer", (req, res) => {
  res.render("customer", { tickets });
});

app.post("/customer", (req, res) => {
  const newTicket = {
    id: tickets.length + 1,
    title: req.body.title,
    description: req.body.description,
    urgency: req.body.urgency,
    status: "Open"
  };
  tickets.push(newTicket);
  res.render("customer", { tickets });
});

// Agent Dashboard
app.get("/agent", (req, res) => {
  res.render("agent", { tickets });
});

app.post("/agent/resolve/:id", (req, res) => {
  const ticketId = parseInt(req.params.id);
  tickets = tickets.map(ticket =>
    ticket.id === ticketId ? { ...ticket, status: "Resolved" } : ticket
  );
  res.redirect("/agent");
});

// Supervisor Dashboard with SLA check
app.get("/supervisor", (req, res) => {
  const enhancedTickets = tickets.map(ticket => {
    let sla = "Safe";
    if (ticket.urgency === "Critical") sla = "Breached";
    else if (ticket.urgency === "High") sla = "At Risk";
    return { ...ticket, sla };
  });
  res.render("supervisor", { tickets: enhancedTickets });
});

app.listen(PORT, () => {
  console.log(`CaseFlow running at http://localhost:${PORT}`);
});