const PROJECT_ID = '69c138dc003803eb6ca8';
const DATABASE_ID = 'laboutiquerd';
const COLLECTION_ID = 'site-content';
const API_KEY = 'standard_98c952da1d87decadc560eb22c2e3f1dd5d907ec0e79eb52af8ac9e62da2b5abd5d717193ca6ce12be9f23fe4a528846e5903e1640bce86ce084edcd9ba4631f90fff6f348e89f8967b56758a52b085abc304c78201ec5387d2e5dbe8db826b843b09d09701c9e93810194cb7e708b6f6bcd5cda76ef6d2b000b92f360fb06ca';
const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';

const legalDocs = [
  {
    key: 'terms_es',
    value: "Términos y Condiciones de La Boutique RD.\\n1. Al usar nuestra tienda y reservar servicios de trenzas, aceptas nuestras normas del resort.\\n2. Los reembolsos solo aplican si el producto está defectuoso en los primeros 7 días.\\n3. Todo arte de personalización es provisto bajo el consentimiento del cliente.\\n4. Para trenzas, llegar con 15 minutos de antelación."
  },
  {
    key: 'terms_en',
    value: "Terms and Conditions of La Boutique RD.\\n1. By using our store and booking braid services, you accept our resort rules.\\n2. Refunds only apply if the product is defective within the first 7 days.\\n3. All customization artwork is provided under the customer's consent.\\n4. For braids, please arrive 15 minutes early."
  },
  {
    key: 'terms_fr',
    value: "Conditions Générales de La Boutique RD.\\n1. En utilisant notre boutique et en réservant des services de tresses, vous acceptez les règles de notre resort.\\n2. Les remboursements ne s'appliquent que si le produit est défectueux dans les 7 premiers jours.\\n3. Toutes les personnalisations sont effectuées avec le consentement du client.\\n4. Pour les tresses, veuillez arriver 15 minutes à l'avance."
  },
  {
    key: 'privacy_es',
    value: "Política de Privacidad.\\nRecopilamos su nombre y número telefónico única y exclusivamente para gestionar su reserva o pedido por WhatsApp.\\nSus fotos de productos personalizados son privadas y no las usaremos con fines promocionales sin su permiso expreso."
  },
  {
    key: 'privacy_en',
    value: "Privacy Policy.\\nWe collect your name and phone number solely and exclusively to manage your reservation or order via WhatsApp.\\nYour custom product photos are private and we will not use them for promotional purposes without your express permission."
  },
  {
    key: 'privacy_fr',
    value: "Politique de Confidentialité.\\nNous recueillons votre nom et votre numéro de téléphone uniquement et exclusivement pour gérer votre réservation ou commande via WhatsApp.\\nVos photos de produits personnalisés sont privées et nous ne les utiliserons pas à des fins promotionnelles sans votre autorisation expresse."
  }
];

async function updateLegalContent() {
  for (const doc of legalDocs) {
    try {
      const searchRes = await fetch(ENDPOINT + '/databases/' + DATABASE_ID + '/collections/' + COLLECTION_ID + '/documents?queries[]=equal("key", ["' + doc.key + '"])', {
        headers: {
          'X-Appwrite-Project': PROJECT_ID,
          'X-Appwrite-Key': API_KEY
        }
      });
      const searchData = await searchRes.json();
      
      let method = 'POST';
      let url = ENDPOINT + '/databases/' + DATABASE_ID + '/collections/' + COLLECTION_ID + '/documents';
      let body = {
        documentId: 'unique()',
        data: {
          key: doc.key,
          value: doc.value
        }
      };

      if (searchData.total > 0) {
        method = 'PATCH';
        url = ENDPOINT + '/databases/' + DATABASE_ID + '/collections/' + COLLECTION_ID + '/documents/' + searchData.documents[0].$id;
        body = {
          data: {
            value: doc.value
          }
        };
      }

      const res = await fetch(url, {
        method,
        headers: {
          'X-Appwrite-Project': PROJECT_ID,
          'X-Appwrite-Key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) {
        console.error('Failed for', doc.key, await res.text());
      } else {
        console.log('Successfully updated', doc.key);
      }
    } catch (err) {
      console.error('Error for', doc.key, err);
    }
  }
}

updateLegalContent();
