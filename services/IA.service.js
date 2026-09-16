const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.api_ia_key;

if (!apiKey) {
    throw new Error(
        "api_ia_key n'est pas définie dans le fichier .env"
    );
}

const ai = new GoogleGenAI({
    apiKey,
});


async function analyserBoutique(donnees) {
    const prompt = `
Tu es un expert en analyse e-commerce et un assistant IA pour
un tableau de bord de gestion de boutique.

Voici les statistiques réelles de la boutique :

${JSON.stringify(donnees, null, 2)}

Analyse ces données sans inventer d'informations.

Ton analyse doit être en français et destinée au responsable
de la boutique.

Analyse obligatoirement :

1. Un résumé général de l'activité.
2. Le chiffre d'affaires.
3. Le nombre de commandes.
4. La répartition des commandes par statut.
5. Le niveau des stocks.
6. Les produits dont le stock est faible.
7. Les problèmes ou risques détectés.
8. Des recommandations concrètes.

Important :
- Utilise uniquement les données fournies.
- Ne crée aucune statistique.
- Si une information est insuffisante, indique-le.
- Sois clair et professionnel.
- Donne des recommandations directement exploitables.
- Réponds en JSON valide uniquement.

Utilise exactement cette structure :

{
  "resume": "Résumé général...",
  "chiffreAffaires": {
    "analyse": "Analyse du chiffre d'affaires..."
  },
  "commandes": {
    "analyse": "Analyse des commandes...",
    "pointsImportants": [
      "Point 1",
      "Point 2"
    ]
  },
  "stock": {
    "analyse": "Analyse du stock...",
    "produitsFaibleStock": [
      {
        "nom": "Nom du produit",
        "stock": 0
      }
    ]
  },
  "risques": [
    "Risque 1",
    "Risque 2"
  ],
  "recommandations": [
    "Recommandation 1",
    "Recommandation 2",
    "Recommandation 3"
  ]
}
`;

    try {
        const interaction = await ai.interactions.create({
            model: "models/gemini-3.5-flash",
            input: prompt,
            generation_config: {
                max_output_tokens: 4096,
                thinkingLevel: "medium",
            },
        });

        const step = interaction.steps?.at(-1);

        if (!step) {
            throw new Error("Gemini n'a retourné aucune réponse.");
        }

        // Selon la réponse du SDK
        let resultat = step.text;

        if (!resultat && step.content) {
            resultat = step.content;
        }

        if (!resultat) {
            throw new Error("Réponse Gemini vide.");
        }

        // Nettoyage éventuel du Markdown ```json
        resultat = resultat
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        try {
            return JSON.parse(resultat);
        } catch (parseError) {
            console.error("Réponse Gemini non JSON :", resultat);

            // On retourne quand même une réponse exploitable
            return {
                resume: resultat,
                chiffreAffaires: {
                    analyse: "",
                },
                commandes: {
                    analyse: "",
                    pointsImportants: [],
                },
                stock: {
                    analyse: "",
                    produitsFaibleStock: [],
                },
                risques: [],
                recommandations: [],
            };
        }
    } catch (error) {
        console.error("Erreur Gemini :", error);
        throw new Error("Impossible de générer l'analyse IA.");
    }
}

module.exports = {
    analyserBoutique,
};