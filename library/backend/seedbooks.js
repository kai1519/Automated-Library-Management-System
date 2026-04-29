const fs = require("fs");

// 🔴 PASTE YOUR FULL DATASET HERE (UNCHANGED)

  // paste everything you sent here
 const BOOK_SEEDS = [
  // Fantasy
  ['Harry Potter and the Sorcerer\'s Stone', 'J.K. Rowling', 'Fantasy', '0439554934', 1997],
  ['The Fellowship of the Ring', 'J.R.R. Tolkien', 'Fantasy', '0618346252', 1954],
  ['A Wrinkle in Time', 'Madeleine L\'Engle', 'Fantasy', '0821925326', 1962],
  ['American Gods', 'Neil Gaiman', 'Fantasy', '1594970998', 2001],
  ['Storm Front', 'Jim Butcher', 'Fantasy', '0451457811', 2000],
  ['The Phantom Tollbooth', 'Norton Juster', 'Fantasy', '0394820371', 1961],
  ['The Name of the Wind', 'Patrick Rothfuss', 'Fantasy', '0756404746', 2007],
  ['The Hobbit', 'J.R.R. Tolkien', 'Fantasy', '054792822X', 1937],
  ['Mistborn', 'Brandon Sanderson', 'Fantasy', '0765311785', 2006],
  ['The Way of Kings', 'Brandon Sanderson', 'Fantasy', '0765326353', 2010],

  // Science Fiction
  ['The Ultimate Hitchhiker\'s Guide to the Galaxy', 'Douglas Adams', 'Science Fiction', '0345453743', 2002],
  ['The Long Dark Tea-Time of the Soul', 'Douglas Adams', 'Mystery', '0671742515', 1988],
  ['God Emperor of Dune', 'Frank Herbert', 'Science Fiction', '0441294677', 1981],
  ['The Moon is a Harsh Mistress', 'Robert A. Heinlein', 'Science Fiction', '0312863551', 1966],
  ['Ender\'s Game', 'Orson Scott Card', 'Science Fiction', '0812550706', 1985],
  ['Dune', 'Frank Herbert', 'Science Fiction', '0441013597', 1965],
  ['Neuromancer', 'William Gibson', 'Science Fiction', '0441569595', 1984],
  ['The Martian', 'Andy Weir', 'Science Fiction', '0553418025', 2011],
  ['Ready Player One', 'Ernest Cline', 'Science Fiction', '0307887443', 2011],
  ['Foundation', 'Isaac Asimov', 'Science Fiction', '0553293354', 1951],

  // Technology
  ['Agile Web Development with Rails', 'Dave Thomas', 'Technology', '097669400X', 2005],
  ['Introduction to Algorithms', 'Cormen et al.', 'Technology', '9780262033848', 2009],
  ['Clean Code', 'Robert C. Martin', 'Technology', '9780132350884', 2008],
  ['The Pragmatic Programmer', 'Andrew Hunt', 'Technology', '9780201616224', 1999],
  ['Python Crash Course', 'Eric Matthes', 'Technology', '9781593276034', 2019],
  ['Deep Learning', 'Ian Goodfellow', 'Technology', '9780262035613', 2016],
  ['Artificial Intelligence', 'Russell & Norvig', 'Technology', '9780136101130', 2020],
  ['Design Patterns', 'Gang of Four', 'Technology', '9780201633610', 1994],
  ['Computer Networks', 'Andrew Tanenbaum', 'Technology', '9780132663748', 2010],
  ['Cracking the Coding Interview', 'Gayle McDowell', 'Technology', '9780984782673', 2015],

  // Literature
  ['Anna Karenina', 'Leo Tolstoy', 'Literature', '0143035002', 1878],
  ['Untouchable', 'Mulk Raj Anand', 'Literature', '0140183957', 1935],
  ['One Hundred Years of Solitude', 'Gabriel Garcia Marquez', 'Literature', '0060531045', 1967],
  ['Chocolat', 'Joanne Harris', 'Literature', '014100018X', 1999],
  ['The Scarlet Letter', 'Nathaniel Hawthorne', 'Literature', '0877208085', 1850],
  ['Persuasion', 'Jane Austen', 'Literature', '0393960188', 1818],
  ['1984', 'George Orwell', 'Literature', '0451524934', 1949],
  ['To Kill a Mockingbird', 'Harper Lee', 'Literature', '0061935468', 1960],
  ['Pride and Prejudice', 'Jane Austen', 'Literature', '0141439513', 1813],
  ['The Alchemist', 'Paulo Coelho', 'Literature', '0062315006', 1988],
  ['Brave New World', 'Aldous Huxley', 'Literature', '0060850523', 1932],
  ['Crime and Punishment', 'Fyodor Dostoevsky', 'Literature', '0140449132', 1866],
  ['Animal Farm', 'George Orwell', 'Literature', '0451526341', 1945],
  ['The Great Gatsby', 'F. Scott Fitzgerald', 'Literature', '0743273567', 1925],

  // Science
  ['A Short History of Nearly Everything', 'Bill Bryson', 'Science', '076790818X', 2003],
  ['A Brief History of Time', 'Stephen Hawking', 'Science', '0553380163', 1988],
  ['The Selfish Gene', 'Richard Dawkins', 'Science', '0198575191', 1976],
  ['Cosmos', 'Carl Sagan', 'Science', '0345331354', 1980],
  ['Astrophysics for People in a Hurry', 'Neil deGrasse Tyson', 'Science', '0393609391', 2017],
  ['The Origin of Species', 'Charles Darwin', 'Science', '0140432051', 1859],
  ['Relativity', 'Albert Einstein', 'Science', '0486417140', 1916],
  ['QED', 'Richard Feynman', 'Science', '0691125759', 1985],
  ['The Gene', 'Siddhartha Mukherjee', 'Science', '1476733503', 2016],
  ['The Elegant Universe', 'Brian Greene', 'Science', '0393338102', 1999],

  // Adventure & Thriller
  ['Hatchet', 'Gary Paulsen', 'Adventure', '0689840926', 1987],
  ['Treasure Island', 'Robert Louis Stevenson', 'Adventure', '0753453800', 1883],
  ['Perfume: The Story of a Murderer', 'Patrick Suskind', 'Thriller', '0140120831', 1985],
  ['The New York Trilogy', 'Paul Auster', 'Mystery', '0143039830', 1987],
  ['Gone Girl', 'Gillian Flynn', 'Thriller', '0307588378', 2012],
  ['The Girl with the Dragon Tattoo', 'Stieg Larsson', 'Thriller', '0307949486', 2005],
  ['The Da Vinci Code', 'Dan Brown', 'Thriller', '0385504209', 2003],
  ['In Cold Blood', 'Truman Capote', 'Thriller', '0679745580', 1966],

  // History
  ['Number the Stars', 'Lois Lowry', 'Historical Fiction', '0440227534', 1989],
  ['Sapiens', 'Yuval Noah Harari', 'History', '0062316095', 2011],
  ['Guns, Germs, and Steel', 'Jared Diamond', 'History', '0393317552', 1997],
  ['The Art of War', 'Sun Tzu', 'History', '1599869624', 500],
  ['The Diary of a Young Girl', 'Anne Frank', 'History', '0553296981', 1947],
  ['The Silk Roads', 'Peter Frankopan', 'History', '1408839997', 2015],
  ['India After Gandhi', 'Ramachandra Guha', 'History', '0330396102', 2007],
  ['Discovery of India', 'Jawaharlal Nehru', 'History', '0195623797', 1946],

  // Philosophy & Psychology
  ['The White Album', 'Joan Didion', 'Nonfiction', '0374522219', 1979],
  ['Thinking, Fast and Slow', 'Daniel Kahneman', 'Philosophy', '0374533555', 2011],
  ['Meditations', 'Marcus Aurelius', 'Philosophy', '0140441409', 180],
  ['Man\'s Search for Meaning', 'Viktor Frankl', 'Philosophy', '0807014295', 1946],
  ['The Power of Habit', 'Charles Duhigg', 'Psychology', '0812981605', 2012],
  ['Influence', 'Robert Cialdini', 'Psychology', '0061241895', 1984],
  ['Mindset', 'Carol Dweck', 'Psychology', '0345472322', 2006],
  ['Emotional Intelligence', 'Daniel Goleman', 'Psychology', '0553383713', 1995],

  // Mathematics & Engineering
  ['Discrete Mathematics', 'Kenneth Rosen', 'Mathematics', '0073383095', 2018],
  ['Introduction to Linear Algebra', 'Gilbert Strang', 'Mathematics', '0980232740', 2016],
  ['Calculus', 'Michael Spivak', 'Mathematics', '0914098500', 2008],
  ['Engineering Mathematics', 'K.A. Stroud', 'Engineering', '1137031204', 2013],
  ['Fundamentals of Electric Circuits', 'Alexander & Sadiku', 'Engineering', '0073380571', 2012],
  ['Thermodynamics', 'Cengel & Boles', 'Engineering', '0073388175', 2014],

  // Economics
  ['The Wealth of Nations', 'Adam Smith', 'Economics', '0140432086', 1776],
  ['Freakonomics', 'Levitt & Dubner', 'Economics', '0061234001', 2005],
  ['The Black Swan', 'Nassim Taleb', 'Economics', '0812973815', 2007],
  ['Nudge', 'Thaler & Sunstein', 'Economics', '0143115267', 2008],

];

// ✅ Convert to JSON format
const formatted = BOOK_SEEDS.map((b, index) => ({
  id: index + 1,
  title: b[0],
  author: b[1],
  category: b[2],
  isbn: b[3],
  year: b[4],
  available: true
}));

// ✅ Save to books.json
fs.writeFileSync("./books.json", JSON.stringify(formatted, null, 2));

console.log("✅ ALL books added successfully!");