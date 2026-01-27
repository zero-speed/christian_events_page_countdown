import { Event, AboutData, GalleryItem } from "./types"

export const events: Event[] = [
  {
    id: 1,
    title: "Culto Unido Circuital",
    date: "2025-11-01",
    time: "10:00 AM",
    location: "Parque Cachimayo",
    description:
      "Ven y sé parte de un día especial de adoración, unidad y alegría en medio de la naturaleza. Compartiremos juntos un tiempo de alabanza, palabra, juegos y convivencia, celebrando la presencia de Dios en un hermoso entorno al aire libre.",
    gallery: [
      "campo_01.jpeg",
      "logo_metodista.png",
      "campo_02.jpeg",
    ],
    category: "Jovenes",
    targetAudience: "jóvenes",
    organizer: "Circuito Valle Sur Cusco",
    capacity: "80 personas",
    confirmations: 45,
    comments: [],
  },
  {
    id: 2,
    title: "Congreso de Jovenes",
    date: "2025-12-26",
    time: "09:00 AM",
    location: "Casa Hogar Azul Wasi - Oropesa Cusco",
    description:`
    Durante cinco días llenos de fe, alegría y propósito, tendrás la oportunidad de ser parte de un encuentro masivo de jóvenes de todo el Distrito Sur Andino Inca.
    Será un tiempo único para buscar más de Dios, fortalecer tu fe, hacer nuevas amistades y vivir momentos que marcarán tu vida para siempre.

    Prepárate para experimentar alabanza con pasión, palabra transformadora, talleres, dinámicas y noches de adoración, donde Cristo será el centro de todo.
    No es solo un evento, es un encuentro divino, una oportunidad para avivar el fuego en tu corazón y renovar tu compromiso con Jesús.
    `,
    gallery: [
      "congreso_01.jpeg",
      "congreso_02.jpeg",
      "logo_metodista.png",
    ],
    category: "Enseñanza",
    targetAudience: "jóvenes",
    organizer: "Distrito Sur Andino Inca",
    capacity: "120 personas",
    confirmations: 87,
    comments: [],
  },
  {
    id: 3,
    title: "Chocolatada con Cristo",
    date: "2025-12-27",
    time: "06:00 PM",
    location: "Iglesia Central Sol de Oro - Cusco",
    description:`
      Una noche especial para disfrutar como familia de fe. Nos reuniremos con la congregación joven para compartir momentos de alegría, unidad y hermandad en Cristo. Será un tiempo para reír, conversar, agradecer y disfrutar juntos una deliciosa chocolatada preparada con mucho amor.
Más que un encuentro, será una oportunidad para fortalecer los lazos que nos unen y recordar que somos un solo cuerpo en Jesús.
    `,
    gallery: [
      "chocolatada_01.jpeg",
      "chocolatada_02.jpeg",
      "logo_metodista.png",
    ],
    category: "Jóvenes",
    targetAudience: "todos",
    organizer: "Ministerio Juvenil",
    capacity: "200 personas",
    confirmations: 125,
    comments: [],
  },
  {
    id: 4,
    title: "Hello 2026",
    date: "2026-01-03",
    time: "06:00 PM",
    location: "Iglesia Central Sol de Oro - Cusco",
    description:`
    Un nuevo año comienza, y con él llega una nueva oportunidad para poner a Cristo en el centro de nuestras vidas. 🙏
Este 2026, que cada día sea una ocasión para renovar nuestra fe, fortalecer nuestros pasos en el camino del Señor y compartir Su amor con los demás.

Que dejemos atrás todo lo que nos detuvo, y abracemos con esperanza lo que Dios tiene preparado.
🌿 Porque cuando Cristo guía nuestros planes, el año se llena de propósito, paz y bendición.
    `,
      
    gallery: [
      "2026_01.webp)",
      "2026_02.webp)",
      "logo_metodista.png",
    ],
    category: "Jovenes",
    targetAudience: "jóvenes",
    organizer: "Jovenes Cusco",
    capacity: "80 personas",
    confirmations: 62,
    comments: [],
  },
  {
    id: 5,
    title: "Festival Diospi Suyana",
    date: "2026-04-27",
    time: "10:00 AM",
    location: "Hospital Diospi Suyana - curahuasi",
    description:`
    El Festival Vida en los Andes, organizado por la institución Diospi Suyana, se realizara en abril de 2026 en Curahuasi, Apurímac, Perú. Este evento reunira a jóvenes de todo el país en una experiencia de fe, música y comunidad, incluyendo la participación de grupos musicales como Su Presencia Worship y talleres para fomentar la transformación y la esperanza entre los participantes
    `,
      
    gallery: [
      "vida_04.jpg",
      "vida_05.jpg",
      "vida_01.jpg",
      "vida_02.jpg",
      "vida_03.jpg"
    ],
    category: "Jovenes",
    targetAudience: "todos",
    organizer: "Hospital Diospi Suyana",
    capacity: "6000 personas",
    confirmations: 1200,
    comments: [],
  },
  {
    id: 6,
    title: "Sin titulo",
    date: "2025-02-05",
    time: "10:00 PM",
    location: "Templo Principal",
    description:
      "Aun no tenemos suficiente informacion del evento",
    gallery: [
      "logo_metodista.png",
      "logo_metodista.png",
      "logo_metodista.png",
    ],
    category: "Oración",
    targetAudience: "varones",
    organizer: "Ministerio de Intercesión",
    capacity: "300 personas",
    confirmations: 34,
    comments: [],
  },
]

export const aboutData: AboutData = {
  title: "Más sobre nosotros",
  subtitle: "Momentos especiales que compartimos juntos en fe y amor",
}

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    image: "/.jpg?height=800&width=600&query=church+worship+praise+hands+raised",
    title: "Adoración",
    description: "Momentos de adoración genuina donde experimentamos la presencia de Dios. Levantamos nuestras manos en gratitud y alabanza, unidos como una sola comunidad en fe.",
  },
  {
    id: 2,
    image: "/.jpg?height=800&width=600&query=bible+study+group+community",
    title: "Estudio Bíblico",
    description: "Nos reunimos para profundizar en la Palabra de Dios. Juntos estudiamos las Escrituras y compartimos reflexiones que enriquecen nuestra fe y comprensión espiritual.",
  },
  {
    id: 3,
    image: "/.jpg?height=800&width=600&query=youth+group+christian+fellowship",
    title: "Grupo de Jóvenes",
    description: "Nuestros jóvenes se reúnen para crecer espiritualmente, compartir experiencias de fe y fortalecerse mutuamente. Es un espacio de confraternidad, diversión y aprendizaje.",
  },
  {
    id: 4,
    image: "/.jpg?height=800&width=600&query=church+prayer+circle+community",
    title: "Círculo de Oración",
    description: "Un espacio sagrado donde compartimos nuestras peticiones e intercedemos los unos por los otros. La oración nos une y fortalece nuestra conexión con Dios.",
  },
  {
    id: 5,
    image: "/.jpg?height=800&width=600&query=christian+family+event+celebration",
    title: "Eventos Familiares",
    description: "Celebramos juntos como una gran familia. Estos momentos nos permiten fortalecer vínculos, crecer en comunión y vivir nuestra fe de manera alegre y compartida.",
  },
  {
    id: 6,
    image: "/.jpg?height=800&width=600&query=church+choir+singing+worship",
    title: "Ministerio de Coro",
    description: "Nuestro coro alaba a Dios con voces unidas. A través de la música, expresamos la gloria del Señor y tocamos los corazones de quienes nos escuchan.",
  },
]
