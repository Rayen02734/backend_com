const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.api_ia_key,
});

async function analyserBoutique(donnees) {
    try {

        const prompt = `
Tu es un expert en analyse e-commerce.

Analyse les données de cette boutique :

${JSON.stringify(donnees, null, 2)}

Retourne uniquement un JSON valide sous cette forme :

{
    "resume": "",
    "chiffreAffaires": {
        "analyse": ""
    },
    "commandes": {
        "analyse": "",
        "pointsImportants": []
    },
    "stock": {
        "analyse": "",
        "produitsFaibleStock": []
    },
    "risques": [],
    "recommandations": []
}

Ne retourne aucun texte avant ou après le JSON.
`;

        console.log("🤖 Envoi des données à Gemini...");

        const interaction = await ai.interactions.create({
            model: "gemini-3.6-flash",
            input: prompt,
            generation_config: {
                max_output_tokens: 4096,
                thinking_level: "medium",
            },
        });

        const resultat = interaction.output_text;

        console.log("🤖 Réponse Gemini reçue :");
        console.log(resultat);

        if (!resultat) {
            throw new Error("Gemini n'a retourné aucune réponse.");
        }

        const jsonText = resultat
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        const analyse = JSON.parse(jsonText);

        return analyse;

    } catch (error) {
        console.error("❌ ERREUR GEMINI COMPLETE :");
        console.error(error);

        throw error;
    }
}

module.exports = {
    analyserBoutique
};