📁 Project Overview

This project is designed to run with a **XAMPP server** setup. Below you'll find the full file structure, setup instructions, and requirements for getting started.

🗂️ Original File Structure

```
├── js/
│   ├── js files
│
├── php/
│   ├── php files
│
├── pro/
│   ├── html files
│
├── schema/
│   └── database.sql
│
├── .gitignore
└── README.md (this file)
```
⚙️ Setup Instructions

🔧 1. Install XAMPP
- Download XAMPP from [apachefriends.org](https://www.apachefriends.org/index.html)
- Launch the **XAMPP Control Panel**
- Start both **Apache** and **MySQL**

📁 2. Move the Project Folder
- Place the project inside the `htdocs` folder
- Default location: `C:/xampp/htdocs/`

🌐 3. Open the Website in Browser
Visit:
```bash
http://localhost/your_project_folder/pro/index.html
```
> Replace `your_project_folder` with the actual folder name.

🗃️ 4. Set Up the Database
- Go to [phpMyAdmin](http://localhost/phpmyadmin/)
- Create a new database (e.g., `wishgrid`)
- Open the `schema/database.sql` file
- Copy and paste the SQL into phpMyAdmin’s **SQL tab**, then execute it

🎨 5. Setup Tailwind CSS (CLI)
Make sure you have [Node.js](https://nodejs.org) installed. Then:
```bash
npm install -g tailwindcss
```
Run Tailwind CLI in your project folder:
```bash
tailwindcss -i ./input.css -o ./output.css --watch
```

> This ensures Tailwind compiles your styles in real-time while you develop.

✅ You're All Set!
Explore and tweak the project as needed. Happy coding! 🚀

