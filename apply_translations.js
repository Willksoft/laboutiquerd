const fs = require('fs');

function translateFile(file, replacements) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    if (!content.includes('useTranslation')) {
        content = content.replace("import React,", "import React, { useTransition } from 'react';\nimport { useTranslation } from 'react-i18next';");
        content = content.replace("import React from 'react';", "import React from 'react';\nimport { useTranslation } from 'react-i18next';");
        
        // Customizer
        content = content.replace("const Customizer: React.FC<CustomizerProps> = ({", "const Customizer: React.FC<CustomizerProps> = ({\n");
        content = content.replace("const Customizer: React.FC<CustomizerProps> = ({\n", "const Customizer: React.FC<CustomizerProps> = ({\n  ...props\n}) => {\n  const { t } = useTranslation();\n  const {");
        content = content.replace("  ...props\n}) => {\n  const { t } = useTranslation();\n  const {\n  product,", "const Customizer: React.FC<CustomizerProps> = ({ ...props }) => {\n  const { t } = useTranslation();\n  const { product,");
        
        // UniversalCustomizer
        content = content.replace("const UniversalCustomizer: React.FC<UniversalCustomizerProps> = ({", "const UniversalCustomizer: React.FC<UniversalCustomizerProps> = ({ ...props }) => {\n  const { t } = useTranslation();\n  const {");
        content = content.replace(") => {", ""); // Hacky but we'll specific later.
    }

    // Since regex replacement of React props is risky, let's just use string replace.
    replacements.forEach(([oldStr, newStr]) => {
        content = content.split(oldStr).join(newStr);
    });

    fs.writeFileSync(file, content, 'utf8');
}

// Safer approach: manual explicit substring replace for injection
function safeInject(file) {
    let content = fs.readFileSync(file, 'utf8');
    if(!content.includes('useTranslation')) {
        content = content.replace("import React", "import React from 'react';\nimport { useTranslation } from 'react-i18next';\n//import React");
        
        let target1 = "const UniversalCustomizer: React.FC<UniversalCustomizerProps> = ({ \n  product, \n  initialItem, \n  onBack, \n  onAddToCart \n}) => {";
        let target2 = "const Customizer: React.FC<CustomizerProps> = ({ \n  product, \n  initialItem, \n  onBack, \n  onAddToCart \n}) => {";
        let target3 = "const UniversalCustomizer: React.FC<UniversalCustomizerProps> = (props) => {";
        
        // RegEx injection
        content = content.replace(/const ([a-zA-Z]+Customizer): React\.FC<([^>]+)>\s*=\s*\(\s*\{([^}]+)\}\s*\)\s*=>\s*\{/g, 
            (match, name, prop, args) => `const ${name}: React.FC<${prop}> = ({${args}}) => {\n  const { t } = useTranslation();`);
    }

    fs.writeFileSync(file, content, 'utf8');
}

safeInject('c:/Users/marke/Downloads/laboutiquerd/components/UniversalCustomizer.tsx');
safeInject('c:/Users/marke/Downloads/laboutiquerd/components/Customizer.tsx');
safeInject('c:/Users/marke/Downloads/laboutiquerd/components/TicketPage.tsx');
safeInject('c:/Users/marke/Downloads/laboutiquerd/components/TicketReceipt.tsx');
safeInject('c:/Users/marke/Downloads/laboutiquerd/components/BraidsBooking.tsx');

function replaceStrings(file, replacements) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    replacements.forEach(([old, newv]) => { content = content.split(old).join(newv); });
    fs.writeFileSync(file, content, 'utf8');
}

replaceStrings('c:/Users/marke/Downloads/laboutiquerd/components/UniversalCustomizer.tsx', [
  ['>Diseñador de Accesorios<', '>{t("Diseñador de Accesorios")}<'],
  ['>Diseñador de Productos<', '>{t("Diseñador de Productos")}<'],
  ['Diseñador de ', '{t("Diseñador de ")}'],
  ['>Cancelar<', '>{t("Cancelar")}<'],
  ['>Nombre del Diseño <', '>{t("Nombre del Diseño")} <'],
  ['>Texto Personalizado <', '>{t("Texto Personalizado")} <'],
  ['>Color Base<', '>{t("Color Base")}<'],
  ['>Color del Texto<', '>{t("Color del Texto")}<'],
  ['>Zonas Activas<', '>{t("Zonas Activas")}<'],
  ['>Añadido al precio base<', '>{t("Añadido al precio base")}<'],
  ['>Guardar y Crear Otro<', '>{t("Guardar y Crear Otro")}<'],
  ['>Finalizar<', '>{t("Finalizar")}<'],
  ['>Vista Posterior<', '>{t("Vista Posterior")}<'],
  ["Ej: Mi ${product.name}", "Ej: Mi ${product.name}"]
]);

replaceStrings('c:/Users/marke/Downloads/laboutiquerd/components/Customizer.tsx', [
  ['>Cancelar<', '>{t("Cancelar")}<'],
  ['>Nombre del Diseño <', '>{t("Nombre del Diseño")} <'],
  ['>Texto Personalizado <', '>{t("Texto Personalizado")} <'],
  ['>Color del Texto<', '>{t("Color del Texto")}<'],
  ['>Color del Hilo<', '>{t("Color del Hilo")}<'],
  ['>Color del Termo<', '>{t("Color del Termo")}<'],
  ['>Zonas Activas<', '>{t("Zonas Activas")}<'],
  ['>Color de la Tela<', '>{t("Color de la Tela")}<'],
  ['>Añadido al precio base<', '>{t("Añadido al precio base")}<'],
  ['>Guardar y Crear Otro<', '>{t("Guardar y Crear Otro")}<'],
  ['>Finalizar<', '>{t("Finalizar")}<']
]);

// BraidsBooking.tsx also needs regex inject
let bbContent = fs.readFileSync('c:/Users/marke/Downloads/laboutiquerd/components/BraidsBooking.tsx', 'utf8');
if (!bbContent.includes('const { t } = useTranslation();')) {
    bbContent = bbContent.replace("export default function BraidsBooking({ onGenerateTicket }: BraidsBookingProps) {", "export default function BraidsBooking({ onGenerateTicket }: BraidsBookingProps) {\n  const { t } = useTranslation();");
    if(!bbContent.includes('useTranslation')) bbContent = "import { useTranslation } from 'react-i18next';\n" + bbContent;
    fs.writeFileSync('c:/Users/marke/Downloads/laboutiquerd/components/BraidsBooking.tsx', bbContent, 'utf8');
}
replaceStrings('c:/Users/marke/Downloads/laboutiquerd/components/BraidsBooking.tsx', [
    ['>Agendar Trenzas<', '>{t("Agendar Trenzas")}<'],
    ['>Reserva tu espacio<', '>{t("Reserva tu espacio")}<'],
    ['>Completa tu reserva<', '>{t("Completa tu reserva")}<'],
    ['>Elegir Estilos<', '>{t("Elegir Estilos")}<'],
    ['>Selecciona tu base<', '>{t("Selecciona tu base")}<'],
    ['>Añadir Complementos<', '>{t("Añadir Complementos")}<'],
    ['>Beads, hilos y accesorios<', '>{t("Beads, hilos y accesorios")}<'],
    ['>Fecha de tu cita<', '>{t("Fecha de tu cita")}<'],
    ['>Horario disponible<', '>{t("Horario disponible")}<'],
    ['>Continuar<', '>{t("Continuar")}<'],
    ['>Volver<', '>{t("Volver")}<']
]);

let tpContent = fs.readFileSync('c:/Users/marke/Downloads/laboutiquerd/components/TicketPage.tsx', 'utf8');
if (!tpContent.includes('const { t } = useTranslation();')) {
    tpContent = tpContent.replace("const TicketPage = () => {", "const TicketPage = () => {\n  const { t } = useTranslation();");
    if(!tpContent.includes('useTranslation')) tpContent = "import { useTranslation } from 'react-i18next';\n" + tpContent;
    fs.writeFileSync('c:/Users/marke/Downloads/laboutiquerd/components/TicketPage.tsx', tpContent, 'utf8');
}
replaceStrings('c:/Users/marke/Downloads/laboutiquerd/components/TicketPage.tsx', [
    ['>Tu Orden de<', '>{t("Tu Orden de")}<'],
    ['>Ticket de Resumen<', '>{t("Ticket de Resumen")}<'],
    ['>Ticket Virtual<', '>{t("Ticket Virtual")}<'],
    ['>Presenta este ticket<', '>{t("Presenta este ticket")}<'],
    ['>Subtotal<', '>{t("Subtotal")}<'],
    ['>Impuestos<', '>{t("Impuestos")}<'],
    ['>Total a Pagar<', '>{t("Total a Pagar")}<'],
    ['>Ticket Listo<', '>{t("Ticket Listo")}<'],
    ['>Descargar Ticket PDF<', '>{t("Descargar Ticket PDF")}<'],
    ['>Volver al Inicio<', '>{t("Volver al Inicio")}<']
]);

let trContent = fs.readFileSync('c:/Users/marke/Downloads/laboutiquerd/components/TicketReceipt.tsx', 'utf8');
if (!trContent.includes('const { t } = useTranslation();')) {
    trContent = trContent.replace("const TicketReceipt = React.forwardRef<HTMLDivElement, TicketReceiptProps>(({ cart, total }, ref) => {", "const TicketReceipt = React.forwardRef<HTMLDivElement, TicketReceiptProps>(({ cart, total }, ref) => {\n  const { t } = useTranslation();");
    if(!trContent.includes('useTranslation')) trContent = "import { useTranslation } from 'react-i18next';\n" + trContent;
    fs.writeFileSync('c:/Users/marke/Downloads/laboutiquerd/components/TicketReceipt.tsx', trContent, 'utf8');
}
replaceStrings('c:/Users/marke/Downloads/laboutiquerd/components/TicketReceipt.tsx', [
    ['>TICKET DE RESERVA<', '>{t("TICKET DE RESERVA")}<'],
    ['>CANT.<', '>{t("CANT.")}<'],
    ['>P.UNIT<', '>{t("P.UNIT")}<'],
    ['>TOTAL<', '>{t("TOTAL")}<'],
    ['>Subtotal<', '>{t("Subtotal")}<'],
    ['>Total a pagar<', '>{t("Total a pagar")}<'],
    ['>Servicio Completo<', '>{t("Servicio Completo")}<']
]);

