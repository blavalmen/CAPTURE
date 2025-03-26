import React, { useState } from "react";
import "./App.css";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";

function App() {
  const regions = [
    "R0 - Central",  "R2 - Epigastrique", "R4 - Gouttière pariétale gauche", "R6 - Pelvis",  "R8 - Gouttière pariétale droite", "R10 - Jéjunum inférieur", "R12 - Iléon inférieur", "R1 - Hypocondre droit", "R3 - Hypocondre gauche",
    "R5 - Fosse iliaque gauche", "R7 - Fosse iliaque droite", "R9 - Jéjunum supérieur", "R11 - Iléon supérieur"
  ];

  const [data, setData] = useState({});
  const [surgeon1, setSurgeon1] = useState("");
  const [surgeon2, setSurgeon2] = useState("");
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [video, setVideo] = useState(null);

  const handleChange = (region, field, value) => {
    setData((prev) => ({
      ...prev,
      [region]: {
        ...prev[region],
        [field]: value,
      },
    }));
  };

  const handleFileChange = (region, file) => {
    setData((prev) => ({
      ...prev,
      [region]: {
        ...prev[region],
        photo: file,
      },
    }));
  };

  const handleVideoChange = (file) => {
    setVideo(file);
  };

  const exportToJSON = () => {
    const reportData = {
      date,
      surgeon1,
      surgeon2,
      patientId,
      data,
      video,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    saveAs(blob, "report.json");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.text(`Date: ${date}`, 10, 10);
    doc.text(`Patient ID: ${patientId}`, 10, 20);
    doc.text(`Chirurgien 1: ${surgeon1}`, 10, 30);
    doc.text(`Chirurgien 2: ${surgeon2}`, 10, 40);

    doc.text("Détails des lésions:", 10, 50);

    let yOffset = 60;
    for (const region in data) {
      doc.text(`${region}:`, 10, yOffset);
      yOffset += 10;
      doc.text(`Lesion: ${data[region].lesion}`, 10, yOffset);
      yOffset += 10;
      doc.text(`Taille: ${data[region].tamano}`, 10, yOffset);
      yOffset += 10;
      doc.text(`Apparence: ${data[region].apariencia}`, 10, yOffset);
      yOffset += 20;
      if (data[region].photo) {
        doc.text(`Photo: ${data[region].photo.name}`, 10, yOffset);
        yOffset += 20;
      }
    }

    if (video) {
      doc.text(`Vidéo: ${video.name}`, 10, yOffset);
    }

    doc.save("rapport.pdf");
  };

  return (
    <div className="App">
      <div className="header">
        <div className="logo">
          <img src="/icm-logo.png" alt="Logo ICM" width="150" />
        </div>
        <h1>Bienvenue sur CAPTURE</h1>
        <p>Enregistrement et évaluation des lésions pendant la chirurgie.</p>
      </div>

      <div className="patient-info">
        <div className="info-row">
          <div className="info-item">
            <label>Date :</label>
            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="info-item">
            <label>Identifiant du patient :</label>
            <input type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="Identifiant" />
          </div>
          <div className="info-item">
            <label>Nom du premier chirurgien :</label>
            <input type="text" value={surgeon1} onChange={(e) => setSurgeon1(e.target.value)} placeholder="Chirurgien 1" />
          </div>
          <div className="info-item">
            <label>Nom du deuxième chirurgien :</label>
            <input type="text" value={surgeon2} onChange={(e) => setSurgeon2(e.target.value)} placeholder="Chirurgien 2" />
          </div>
        </div>
      </div>

      <div className="quadrants">
        <div className="column">
          {regions.slice(0, 7).map((region, index) => (
            <div key={index} className="region-container">
              <div className="region-title">{region}</div>
              <div className="inputs">
                <label>Lesion Présente:</label>
                <select onChange={(e) => handleChange(region, "lesion", e.target.value)}>
                  <option value="">--Sélectionner--</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>

                <label>Taille:</label>
                <select onChange={(e) => handleChange(region, "tamano", e.target.value)}>
                  <option value="">--Sélectionner--</option>
                  <option value="<0.5 cm">&lt;0.5 cm</option>
                  <option value="0.5-5 cm">0.5-5 cm</option>
                  <option value=">5 cm">&gt;5 cm</option>
                </select>

                <label>Apparence:</label>
                <select onChange={(e) => handleChange(region, "apariencia", e.target.value)}>
                  <option value="">--Sélectionner--</option>
                  <option value="Blande tumorale">Blande tumorale</option>
                  <option value="Ferme/nodulaire">Ferme/nodulaire</option>
                  <option value="Fibrose/cicatrice">Fibrose/cicatrice</option>
                  <option value="Mucineuse">Mucineuse</option>
                  <option value="Autre">Autre</option>
                </select>

                <label>Ajouter une photo:</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(region, e.target.files[0])} />
              </div>
            </div>
          ))}
        </div>

        <div className="column">
          {regions.slice(7).map((region, index) => (
            <div key={index} className="region-container">
              <div className="region-title">{region}</div>
              <div className="inputs">
                <label>Lesion Présente:</label>
                <select onChange={(e) => handleChange(region, "lesion", e.target.value)}>
                  <option value="">--Sélectionner--</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>

                <label>Taille:</label>
                <select onChange={(e) => handleChange(region, "tamano", e.target.value)}>
                  <option value="">--Sélectionner--</option>
                  <option value="<0.5 cm">&lt;0.5 cm</option>
                  <option value="0.5-5 cm">0.5-5 cm</option>
                  <option value=">5 cm">&gt;5 cm</option>
                </select>

                <label>Apparence:</label>
                <select onChange={(e) => handleChange(region, "apariencia", e.target.value)}>
                  <option value="">--Sélectionner--</option>
                  <option value="Blande tumorale">Blande tumorale</option>
                  <option value="Ferme/nodulaire">Ferme/nodulaire</option>
                  <option value="Fibrose/cicatrice">Fibrose/cicatrice</option>
                  <option value="Mucineuse">Mucineuse</option>
                  <option value="Autre">Autre</option>
                </select>

                <label>Ajouter une photo:</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(region, e.target.files[0])} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="video-upload">
        <label>Ajouter une vidéo :</label>
        <input type="file" accept="video/*" onChange={(e) => handleVideoChange(e.target.files[0])} />
      </div>

      <div className="export-btn">
        <button onClick={exportToJSON}>Exporter les données en JSON</button>
        <button onClick={exportToPDF}>Exporter les données en PDF</button>
      </div>
    </div>
  );
}

export default App;
