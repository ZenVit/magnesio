const CONTENIDO = {
  barraSuperior: [
    "🚚 Envío gratis a todo Paraguay",
    "💵 Pagás al recibir en zonas habilitadas",
    "📦 Producto sellado y listo para entregar",
    "💬 Confirmación personalizada por WhatsApp",
    "⚡ Despacho rápido desde Paraguay",
  ],

  menu: [
    { texto: "La fórmula", ancla: "#beneficios" },
    { texto: "Combos", ancla: "#combos" },
    { texto: "Cómo tomar", ancla: "#howtoSection" },
    { texto: "Preguntas", ancla: "#faq" },
  ],

  hero: {
    etiqueta: "Complejo mineral · Uso diario",
    titulo: "Magnesium Complex 8 en 1",
    subtitulo: "Frasco de 60 cápsulas para complementar tu rutina diaria",
    resenaTexto: "Fórmula multifuente de Toplux Nutrition",
    beneficios: [
      { icono: "◉", texto: "El magnesio contribuye al funcionamiento normal de músculos y sistema nervioso" },
      { icono: "◇", texto: "Participa en procesos normales de producción de energía" },
      { icono: "✦", texto: "Cápsula vegetal práctica para incorporar a tu día" },
      { icono: "✓", texto: "Presentación de 60 cápsulas por frasco" },
    ],
    botonComprar: "Comprá ya y pagás al recibir",
    botonWhatsapp: "Pedir por WhatsApp",
    respaldoTitulo: "Compra local con respaldo",
    respaldoSubtitulo: "Ver entrega, procedencia y atención",
    microcopy: "🔒 Pedido seguro · Te confirmamos todo por WhatsApp",
  },

  confianza: [
    { icono: "🚚", titulo: "Envío gratis", detalle: "A todo Paraguay" },
    { icono: "💵", titulo: "Pago al recibir", detalle: "En zonas habilitadas" },
    { icono: "🔒", titulo: "Compra segura", detalle: "Datos protegidos" },
    { icono: "💬", titulo: "Atención local", detalle: "Confirmación por WhatsApp" },
  ],

  combos: {
    etiqueta: "Oferta especial",
    titulo: "Elegí cuánto querés ahorrar",
    bajada: "Una unidad cuesta Gs. 169.000. Los combos bajan el precio por frasco e incluyen envío sin costo.",
    botonPrefijo: "Quiero",
    microcopy: "Stock sujeto a disponibilidad · Envío sin costo",
  },

  explicacion: {
    etiqueta: "Fórmula multifuente",
    titulo: "Distintas fuentes de magnesio en una sola cápsula",
    parrafo: "Magnesium Complex reúne varias formas de magnesio en un frasco de 60 cápsulas para complementar la alimentación sin preparar polvos ni bebidas. La información del fabricante declara 1.000 mg por porción de una cápsula vegetal.",
    puntos: [
      "<b>Composición declarada:</b> óxido, glicinato, taurato, carbonato, aspartato y orotato de magnesio.",
      "<b>Función muscular:</b> el magnesio contribuye al funcionamiento normal de los músculos.",
      "<b>Sistema nervioso:</b> contribuye a su funcionamiento normal y al equilibrio electrolítico.",
      "<b>Rutina práctica:</b> una cápsula al día, acompañada con agua y preferentemente con una comida.",
    ],
    aclaracion: "El frente se comercializa como “8 en 1”, aunque la etiqueta disponible enumera seis fuentes. Revisá siempre la composición de la presentación recibida.",
    boton: "Ver precios y combos",
  },

  caracteristicas: {
    etiqueta: "Lo esencial",
    titulo: "Información del producto",
    items: [
      { icono: "60", titulo: "60 cápsulas", detalle: "Presentación por frasco" },
      { icono: "1×", titulo: "Uso diario", detalle: "Una cápsula vegetal" },
      { icono: "6+", titulo: "Fórmula multifuente", detalle: "Revisá la composición del envase" },
      { icono: "🌿", titulo: "Cápsula vegetal", detalle: "Hipromelosa declarada" },
      { icono: "📦", titulo: "Frasco sellado", detalle: "Presentación según stock" },
      { icono: "🇵🇾", titulo: "Stock local", detalle: "Despacho desde Paraguay" },
    ],
  },

  modoUso: {
    etiqueta: "Modo de uso",
    titulo: "Una rutina fácil de mantener",
    bajada: "Seguí prioritariamente las indicaciones impresas en el envase que recibas.",
    pasos: [
      { titulo: "Tomá una cápsula", detalle: "El material del fabricante indica una porción diaria." },
      { titulo: "Acompañá con agua", detalle: "Preferentemente junto con una comida para una mejor tolerancia." },
      { titulo: "Sé constante", detalle: "Elegí un horario que puedas sostener dentro de tu rutina." },
    ],
    aclaracion: "No excedas la dosis recomendada. Si estás embarazada, en lactancia, tomás medicamentos o tenés una condición renal, consultá antes con un profesional de la salud.",
  },

  galeria: {
    etiqueta: "Detalles",
    titulo: "Conocé la fórmula y su uso",
  },

  // Bloque de piezas verticales que va después de los combos.
  // Las imágenes se configuran en SALES_STACK (config.js).
  // Poné  ventaVisual: null  para que la sección desaparezca.
  ventaVisual: {
    etiqueta: "La fórmula en imágenes",
    titulo: "Qué declara la etiqueta y cómo se toma",
    bajada: "Material del fabricante. Verificá siempre la composición y las instrucciones del envase que recibas.",
    hint: "Tocá cualquier imagen para elegir tu combo",
  },

  entrega: {
    etiqueta: "Entrega simple",
    titulo: "Pedí hoy y coordinamos por WhatsApp",
    tarjetas: [
      {
        icono: "🚚",
        titulo: "Entrega estimada",
        texto: "Si comprás de <b>lunes a viernes</b>, la entrega se programa para el día siguiente. Los pedidos del <b>sábado o domingo</b> se entregan el lunes.",
        nota: "En el checkout te mostramos la fecha exacta antes de confirmar.",
      },
      {
        icono: "💵",
        titulo: "Pago contra entrega",
        texto: "En Asunción y ciudades habilitadas pagás en efectivo cuando recibís tu pedido.",
        nota: "El envío ya está incluido: no tiene costo adicional.",
      },
      {
        icono: "📦",
        titulo: "Cobertura nacional",
        texto: "Para otras ciudades despachamos por <b>TSI</b> o <b>Multienvíos</b> con pago anticipado.",
        nota: "Te enviamos los datos y acompañamos la coordinación por WhatsApp.",
      },
    ],
  },

  faq: {
    etiqueta: "Información clara",
    titulo: "Preguntas frecuentes",
    items: [
      { p: "¿Qué incluye cada frasco?", r: "Cada frasco contiene 60 cápsulas de Magnesium Complex 8 en 1 de Toplux Nutrition." },
      { p: "¿Qué es Magnesium Complex?", r: "Es un suplemento alimentario que combina distintas fuentes de magnesio en cápsulas. Complementa la alimentación, pero no es un medicamento ni está destinado a tratar enfermedades." },
      { p: "¿Por qué dice 8 en 1 si la etiqueta enumera seis formas?", r: "“8 en 1” es el nombre comercial mostrado en el frente. La imagen de composición disponible enumera óxido, glicinato, taurato, carbonato, aspartato y orotato. Por transparencia, te recomendamos verificar el rótulo del frasco recibido." },
      { p: "¿Los 1.000 mg son magnesio elemental?", r: "La etiqueta disponible dice “Magnesio 1.000 mg” por porción, pero no permite confirmar de forma independiente que todo corresponda a magnesio elemental. No hacemos esa interpretación; seguí la información del envase y la recomendación de un profesional." },
      { p: "¿Cómo se toma?", r: "El material del producto indica una cápsula al día con agua, preferentemente junto con una comida. Seguí siempre las instrucciones del envase recibido." },
      { p: "¿Sirve para dormir de inmediato?", r: "No. No es un somnífero y no garantiza sueño inmediato. El magnesio participa en funciones normales del organismo, pero la experiencia puede variar entre personas." },
      { p: "¿Puede causar molestias?", r: "Una ingesta elevada de magnesio proveniente de suplementos puede causar diarrea, náuseas o cólicos. Suspendé el uso y consultá si sentís molestias." },
      { p: "¿Cuánto cuesta el envío?", r: "El envío está incluido en el precio del combo. Es gratis tanto en zonas con delivery como en los despachos al interior por transportadora." },
      { p: "¿Cuándo pago?", r: "En zonas habilitadas pagás en efectivo al recibir. Para envíos por transportadora se requiere pago anticipado antes del despacho." },
      { p: "¿Cómo hago el pedido?", r: "Tocá “Comprá ya y pagás al recibir”, elegí tu combo y completá tus datos. Te escribiremos por WhatsApp para confirmar la entrega." },
    ],
  },

  cierreFinal: {
    etiqueta: "Envío gratis a todo Paraguay",
    titulo: "Sumá magnesio a tu rutina sin complicaciones",
    boton: "Elegir mi combo",
    enlaceWhatsapp: "Prefiero pedir por WhatsApp",
  },

  avisoLegal: "",

  pie: {
    descripcion: "Magnesium Complex 8 en 1 · Frasco de 60 cápsulas",
  },

  respaldo: {
    titulo: "Compra local con respaldo",
    bajada: "Información clara antes y después de tu pedido.",
    bannerTitulo: "ATENCIÓN EN PARAGUAY",
    bannerDetalle: "Confirmación y coordinación por WhatsApp",
    puntos: [
      { icono: "📦", texto: "<b>Producto sellado.</b> Despachamos el frasco cerrado y revisado exteriormente." },
      { icono: "🔎", texto: "<b>Información transparente.</b> La presentación puede variar; verificá el rótulo del envase recibido antes de consumir." },
      { icono: "💬", texto: "<b>Atención local.</b> Confirmamos el pedido, la modalidad de pago y el plazo por WhatsApp." },
    ],
    legal: [
      "<span aria-hidden=\"true\">⚖️</span> <b>Compra protegida por ley.</b> Operación amparada por la Ley N° 4868/2013 de Comercio Electrónico del Paraguay.",
      "<span aria-hidden=\"true\">💵</span> <b>Pago al recibir</b> en zonas habilitadas. Los despachos por transportadora requieren pago anticipado.",
    ],
    boton: "Entendido",
  },
};

window.CONTENIDO = CONTENIDO;
