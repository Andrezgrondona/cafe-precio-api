import axios from "axios";
import pdf from "pdf-parse";

const PDF_URL =
  "https://federaciondecafeteros.org/app/uploads/2019/10/precio_cafe.pdf";

export const getPdfData = async (): Promise<string> => {
  const response = await axios.get(PDF_URL, { responseType: "arraybuffer" });
  const data = await pdf(response.data);
  return data.text;
};

// 👇 Nuevo: función que extrae el precio interno
export const getPrecioInterno = async () => {
  const text = await getPdfData();

  // Buscar línea con "Precio total por carga"
  const regex = /Precio total por carga.*?([\d.,]+)COP/i;
  const match = text.match(regex);

  if (match) {
    const precio = match[1].replace(/\./g, "").replace(/,/g, ".");
    return { precioCarga: parseFloat(precio), moneda: "COP" };
  }

  return { error: "No se pudo extraer el precio" };
};
