import os
import re

files_to_translate = {
    "components/UniversalCustomizer.tsx": [
        ("Diseñador de Accesorios", "Diseñador de Accesorios"),
        ("Diseñador de Productos", "Diseñador de Productos"),
        (">Cancelar<", ">{t('Cancelar')}<"),
        ("Nombre del Diseño", "Nombre del Diseño"),
        ("Texto Personalizado", "Texto Personalizado"),
        ("Vista Posterior", "Vista Posterior"),
        ("Color Base", "Color Base"),
        ("Color del Texto", "Color del Texto"),
        ("Zonas Activas", "Zonas Activas"),
        ("Añadido al precio base", "Añadido al precio base"),
        ("Guardar y Crear Otro", "Guardar y Crear Otro"),
        ("Finalizar", "Finalizar"),
        (">Clásico<", ">{t('Clásico')}<"),
        (">Dominicano<", ">{t('Dominicano')}<")
    ],
    "components/Customizer.tsx": [
        (">Cancelar<", ">{t('Cancelar')}<"),
        ("Diseñador de Custom", "Diseñador de Custom"),
        ("Nombre del Diseño", "Nombre del Diseño"),
        ("Texto Personalizado", "Texto Personalizado"),
        ("Vista Posterior", "Vista Posterior"),
        ("Color de la Tela", "Color de la Tela"),
        ("Color del Texto", "Color del Texto"),
        ("Color del Hilo", "Color del Hilo"),
        ("Color del Termo", "Color del Termo"),
        ("Zonas Activas", "Zonas Activas"),
        ("Añadido al precio base", "Añadido al precio base"),
        ("Guardar y Crear Otro", "Guardar y Crear Otro"),
        ("Finalizar", "Finalizar")
    ],
    "components/BraidsBooking.tsx": [
        ("Agendar Trenzas", "Agendar Trenzas"),
        ("Cita Online", "Cita Online"),
        ("Completa tu reserva", "Completa tu reserva"),
        ("Elegir Estilos", "Elegir Estilos"),
        ("Selecciona tu base", "Selecciona tu base"),
        ("Añadir Complementos", "Añadir Complementos"),
        ("Beads, hilos y accesorios", "Beads, hilos y accesorios"),
        ("Fecha de tu cita", "Fecha de tu cita"),
        ("Horario disponible", "Horario disponible"),
        ("Continuar", "Continuar"),
        ("Volver", "Volver")
    ],
    "components/TicketPage.tsx": [
        ("Tu Orden de", "Tu Orden de"),
        ("Boutique Creattive", "Boutique Creattive"),
        ("Ticket de Resumen", "Ticket de Resumen"),
        ("Ticket Virtual", "Ticket Virtual"),
        ("Ver tu", "Ver tu"),
        ("Presenta este ticket", "Presenta este ticket"),
        ("Subtotal", "Subtotal"),
        ("Impuestos", "Impuestos"),
        ("Total a Pagar", "Total a Pagar"),
        ("Ticket Listo", "Ticket Listo"),
        ("Generar Ticket PDF", "Generar Ticket PDF"),
        ("Crear Nuevo Diseño", "Crear Nuevo Diseño")
    ]
}

def setup_t_function(content, file):
    if 'useTranslation' not in content:
        # insert at top
        content = content.replace("import React,", "import React, { useTransition } from 'react';\nimport { useTranslation } from 'react-i18next';", 1)
        content = content.replace("import React from 'react';", "import React from 'react';\nimport { useTranslation } from 'react-i18next';", 1)
        
        # Insert hook definition depending on the Component
        comp_match = re.search(r"const ([a-zA-Z]+)(: React\.FC<| = \()", content)
        if comp_match:
            def_str = comp_match.group(0)
            replacement = def_str.replace("=> {", "=> {\n  const { t } = useTranslation();\n")
            if replacement == def_str: # wait, some definitions are differently patterned
                if "const UniversalCustomizer: React.FC<UniversalCustomizerProps> = " in content:
                    content = content.replace("const UniversalCustomizer: React.FC<UniversalCustomizerProps> = ({", "const UniversalCustomizer: React.FC<UniversalCustomizerProps> = ({...props}) => {\n  const { t } = useTranslation();\n  const {") # Simplified but risky
    
    return content

for filepath, replacements in files_to_translate.items():
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Manual replacements logic here if needed, but since it's risky and TSX is nested, 
    # it's usually better to just tell the user we're doing it carefully.
    
    for old, new in replacements:
        if old in content and new != old:
            content = content.replace(old, new)
            
    # with open(filepath, 'w', encoding='utf-8') as f:
    #     f.write(content)
