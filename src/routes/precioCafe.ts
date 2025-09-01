

// export default router;
import { Router } from "express";
import { getPdfData, getPrecioInterno } from "../services/pdfService";

const router = Router();

///precio-cafe/raw
// Mostramos la información completa
router.get("/raw", async (req, res) => {
  try {
    const text = await getPdfData();
    res.json({ success: true, extractedText: text });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al procesar PDF" });
  }
});

///precio
// Solamente se muestra el precio interno del café
router.get("/precio", async (req, res) => {
  try {
    const precio = await getPrecioInterno();
    res.json({ success: true, data: precio });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al obtener precio" });
  }
});

///allPrices
// Extraemos todos los valores importantes en JSON
router.get("/allPrices", async (req, res) => {
  try {
    const text = await getPdfData();

    // Usamos regex para encontrar cada campo en el PDF
    const nyPrice = text.match(/C Nueva York\s+([\d.,]+ USCent\/Lb)/)?.[1] || null;
    const internalPrice = text.match(/Precio total por carga de 125 Kg de pergamino seco FR 94\s+([\d.,]+ ?COP)/)?.[1] || null;
    const pasillaPrice = text.match(/Precio total\s+de pasilla contenida en el pergamino\s+([\d.,]+ ?COP\/Kg)/)?.[1] || null;
    const factorMerma = text.match(/factor de rendimiento 94\s+-\s+pasilla de ([\d.,]+Kg).*?merma del ([\d.,]+%)/);

    res.json({
      success: true,
      data: {
        nyPrice,
        internalPrice,
        pasillaPrice,
        factor: factorMerma ? "94" : null,
        pasillaKg: factorMerma?.[1] || null,
        merma: factorMerma?.[2] || null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al obtener datos filtrados" });
  }
});

export default router;
