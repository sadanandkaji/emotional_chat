const { exec } = require("child_process");

// Correct: run uvicorn executable from the venv
const command = ".\\.venv\\Scripts\\uvicorn.exe main:app --reload";

exec(command, { shell: true }, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ exec error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`⚠️ stderr: ${stderr}`);
  }
  console.log(`✅ Output:\n${stdout}`);
});
