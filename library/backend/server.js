const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT =process.env.PORT || 7000;
const SECRET = "library_secret_key_2024";

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));

// Helper: ensure file exists
function ensureFile(file, defaultVal) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(defaultVal, null, 2));
}
ensureFile("./books.json", []);
ensureFile("./users.json", []);
ensureFile("./issues.json", []);
ensureFile("./announcements.json", []);

// ✅ SERVE FRONTEND
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ✅ GET all books
app.get("/books", (req, res) => {
  const books = JSON.parse(fs.readFileSync("./books.json"));
  res.json(books);
});

// ✅ SEARCH books
app.get("/books/search", (req, res) => {
  const { q } = req.query;
  const books = JSON.parse(fs.readFileSync("./books.json"));
  const result = books.filter(book =>
    book.title.toLowerCase().includes(q.toLowerCase()) ||
    book.author.toLowerCase().includes(q.toLowerCase()) ||
    book.category.toLowerCase().includes(q.toLowerCase())
  );
  res.json(result);
});

// ✅ GET ALL ISSUED BOOKS
app.get("/issues", (req, res) => {
  const issues = JSON.parse(fs.readFileSync("./issues.json"));
  const books = JSON.parse(fs.readFileSync("./books.json"));
  const detailed = issues.map(issue => {
    const book = books.find(b => b.id == issue.bookId);
    return {
      ...issue,
      bookTitle: book ? book.title : "Unknown",
      author: book ? book.author : "Unknown",
      fine: issue.fine || 0
    };
  });
  res.json(detailed);
});

// ✅ ISSUE BOOK
app.post("/issue", (req, res) => {
  const { userId, bookId } = req.body;
  if (!userId || !bookId)
    return res.json({ message: "userId and bookId are required" });

  const books = JSON.parse(fs.readFileSync("./books.json"));
  const issues = JSON.parse(fs.readFileSync("./issues.json"));
  const book = books.find(b => b.id == bookId);

  if (!book) return res.json({ message: "Book not found" });
  if (!book.available) return res.json({ message: "Book already issued" });

  const issueDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(issueDate.getDate() + 7);

  const newIssue = {
    id: Date.now(),
    userId,
    bookId,
    issueDate: issueDate.toISOString(),
    dueDate: dueDate.toISOString(),
    returnDate: null,
    fine: 0
  };

  issues.push(newIssue);
  book.available = false;

  fs.writeFileSync("./issues.json", JSON.stringify(issues, null, 2));
  fs.writeFileSync("./books.json", JSON.stringify(books, null, 2));

  res.json({ message: "Book issued successfully", issue: newIssue });
});

// ✅ RETURN BOOK
app.post("/return", (req, res) => {
  const { bookId } = req.body;
  const books = JSON.parse(fs.readFileSync("./books.json"));
  const issues = JSON.parse(fs.readFileSync("./issues.json"));

  const book = books.find(b => b.id == bookId);
  if (!book) return res.json({ message: "Book not found" });

  const issue = issues.find(i => i.bookId == bookId && !i.returnDate);
  if (!issue) return res.json({ message: "No active issue found for this book" });

  const returnDate = new Date();
  issue.returnDate = returnDate.toISOString();

  const dueDate = new Date(issue.dueDate);
  const diffTime = returnDate - dueDate;
  const lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  issue.fine = lateDays > 0 ? lateDays * 10 : 0;
  book.available = true;

  fs.writeFileSync("./issues.json", JSON.stringify(issues, null, 2));
  fs.writeFileSync("./books.json", JSON.stringify(books, null, 2));

  res.json({ message: "Book returned successfully", fine: issue.fine });
});

// ✅ REGISTER
app.post("/register", async (req, res) => {
  const { username, password, role, adminCode } = req.body;
  if (!username || !password)
    return res.json({ message: "Username and password required" });

  // Admin registration requires a secret code
  if (role === "admin" && adminCode !== "LIBRARY_ADMIN_2024") {
    return res.json({ message: "Invalid admin code" });
  }

  const users = JSON.parse(fs.readFileSync("./users.json"));
  const exists = users.find(u => u.username === username);
  if (exists) return res.json({ message: "Username already taken" });

  const hashed = await bcrypt.hash(password, 10);
  users.push({
    id: Date.now(),
    username,
    password: hashed,
    role: role === "admin" ? "admin" : "user"
  });
  fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));

  res.json({ message: "Registered successfully!" });
});

// ✅ LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync("./users.json"));
  const user = users.find(u => u.username === username);

  if (!user) return res.json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role || "user" },
    SECRET,
    { expiresIn: "1d" }
  );
  res.json({
    message: "Login successful!",
    token,
    username: user.username,
    role: user.role || "user"
  });
});

// ✅ ADMIN: Get full stats
app.get("/admin/stats", (req, res) => {
  const books = JSON.parse(fs.readFileSync("./books.json"));
  const issues = JSON.parse(fs.readFileSync("./issues.json"));

  const totalFine = issues.reduce((sum, i) => sum + (i.fine || 0), 0);
  const activeIssues = issues.filter(i => !i.returnDate);
  const members = [...new Set(issues.map(i => i.userId))];

  // Per-member breakdown
  const memberStats = members.map(userId => {
    const userIssues = issues.filter(i => i.userId === userId);
    const activeBooks = userIssues
      .filter(i => !i.returnDate)
      .map(i => {
        const book = books.find(b => b.id == i.bookId);
        return {
          bookId: i.bookId,
          bookTitle: book ? book.title : "Unknown",
          issueDate: i.issueDate,
          dueDate: i.dueDate,
          fine: i.fine || 0
        };
      });
    const totalUserFine = userIssues.reduce((s, i) => s + (i.fine || 0), 0);
    return { userId, totalIssued: userIssues.length, activeBooks, totalFine: totalUserFine };
  });

  res.json({
    totalBooks: books.length,
    availableBooks: books.filter(b => b.available !== false).length,
    totalIssued: issues.length,
    activeIssues: activeIssues.length,
    totalFineCollected: totalFine,
    totalMembers: members.length,
    memberStats,
    recentIssues: issues
      .slice(-20)
      .reverse()
      .map(i => {
        const book = books.find(b => b.id == i.bookId);
        return {
          ...i,
          bookTitle: book ? book.title : "Unknown"
        };
      })
  });
});

// ✅ ANNOUNCEMENTS: Get all
app.get("/announcements", (req, res) => {
  const announcements = JSON.parse(fs.readFileSync("./announcements.json"));
  res.json(announcements.slice().reverse()); // newest first
});

// ✅ ANNOUNCEMENTS: Post new (admin only - verified client-side via role in token)
app.post("/announcements", (req, res) => {
  const { title, message, author } = req.body;
  if (!title || !message) return res.json({ message: "Title and message required" });

  const announcements = JSON.parse(fs.readFileSync("./announcements.json"));
  const newAnn = {
    id: Date.now(),
    title,
    message,
    author: author || "Librarian",
    date: new Date().toISOString()
  };
  announcements.push(newAnn);
  fs.writeFileSync("./announcements.json", JSON.stringify(announcements, null, 2));
  res.json({ message: "Announcement posted!", announcement: newAnn });
});

// ✅ ANNOUNCEMENTS: Delete (admin only)
app.delete("/announcements/:id", (req, res) => {
  const { id } = req.params;
  let announcements = JSON.parse(fs.readFileSync("./announcements.json"));
  announcements = announcements.filter(a => a.id != id);
  fs.writeFileSync("./announcements.json", JSON.stringify(announcements, null, 2));
  res.json({ message: "Announcement deleted" });
});

// ✅ START SERVER
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});