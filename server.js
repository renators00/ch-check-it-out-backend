import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analisar", async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: "URL obrigatória" });

  try {
    const psiResponse = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile`
    );
    const psiData = await psiResponse.json();

    const performance = Math.round(psiData.lighthouseResult.categories.performance.score * 100);
    const seo = Math.round(psiData.lighthouseResult.categories.seo.score * 100);
    const accessibility = Math.round(psiData.lighthouseResult.categories.accessibility.score * 100);

    res.json({ performance, seo, accessibility });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao analisar o site" });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Backend rodando!"));
