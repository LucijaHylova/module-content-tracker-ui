const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Absoluter Pfad zu deinem build (funktioniert lokal & Railway)
const distFolder = path.join(process.cwd(), 'dist', 'module-content-tracker-ui', 'browser');

// Static files ausliefern
app.use(express.static(distFolder));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(path.join(distFolder, 'index.html')));
});

// app.get(/.*/, (req, res) => {
//   res.sendFile(path.resolve('dist/module-content-tracker-ui', 'index.html'));
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
