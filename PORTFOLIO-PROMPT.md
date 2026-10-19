# Tailored portfolio website prompt

Build a responsive, visually distinctive personal architecture portfolio for **Kollene Aika Leyson**, a **fourth-year BS Architecture student at Mapúa University and aspiring architect**. Use the supplied **abou.pdf** as the source of truth for her identity, academic projects, images, education, and contact details.

The site should feel like a carefully art-directed architecture publication: calm, thoughtful, tactile, and confident. Let the work make the strongest impression.

## Design and aesthetic

Use a **warm editorial** visual direction: ivory paper, forest-green type, muted olive accents, fine rules, generous negative space, and a precise architectural grid. Pair an expressive serif for display headlines with a clear sans serif for body text and navigation. Keep body copy readable, navigation obvious, and the mobile layout comfortable.

Use large architectural renders, drawings, and models **extracted from abou.pdf**, with deliberate crops and captions. Keep detailed plans and presentation boards readable in their expanded views. Avoid generic stock architecture, invented buildings, dashboards, fake device mockups, and unnecessary decorative graphics. Set architectural imagery against quieter typography and whitespace.

Add restrained, purposeful micro-interactions: gentle image movement on hover, visible button states, smooth section navigation, and subtle entrance animation. Respect reduced-motion preferences. The experience should remain complete with animations disabled.

## Content and sections

### 1. Hero

Introduce **Kollene Aika Leyson** clearly, with the role **Architecture Student · Mapúa University**.

Suggested headline: **“Spaces shaped around people.”**

Suggested short introduction: **“I’m Kollene, an architecture student exploring how thoughtful planning, material expression, and a sense of place can shape more meaningful everyday spaces.”**

Use a striking render from the supplied portfolio as the hero image, with a real project name as its caption. Include **Explore my work** and **Let’s connect** calls to action. A small editorial note such as **Selected academic work** establishes the context honestly.

### 2. About

Write a short, human introduction grounded in the PDF. Explain her interest in balancing **functionality, aesthetics, and sustainability**, and her belief that architecture should respond to people's needs and experiences.

Describe the breadth of her academic explorations: residential spaces, hospitality, mixed-use environments, civic and institutional buildings, public spaces, and transportation. Present this as a developing architectural practice within her education, with a tone that is curious and thoughtful.

### 3. Selected academic work

Create a strong, image-led project showcase with **six featured studies**, plus a compact archive for the remaining work when suitable imagery is available. Each project card should show its title, typology, location, and a short source-supported description. Add category filters that actually work and a keyboard-accessible project detail dialog or equivalent case-study view.

Use these featured projects:

1. **Casa Adinerado** — Proposed two-storey residence, Urdaneta City, Pangasinan. A contemporary family home exploring natural light, ventilation, spatial fluidity, privacy, and comfort. Show the exterior and floor plans available in the source.
2. **Siete Lagos Manor** — Proposed boutique hotel, San Pablo, Laguna. An urban manor combining classical elegance with the identity of the City of Seven Lakes; its landscaped roof deck is imagined as a contemporary “seventh lake.” Credit **Pauline Claire Alaban** as a pair-project collaborator.
3. **The Sunbeam Gallery** — Proposed four-storey shophouse, Binondo, Manila. A cultural-commercial hub combining retail and gallery spaces, reinterpreting the traditional shophouse through historic motifs and contemporary detailing.
4. **Sanyata** — Proposed health and wellness center, Reserva, Baler, Aurora. Present the source’s aerial perspective and documented project context. Keep the description restrained where the PDF does not provide a fuller design narrative.
5. **New Manila City Hall** — Civic/institutional proposal, Ermita, Manila. Connected volumes take inspiration from the branching Nilad plant to express growth, connection, and community. Frame that reference as the project’s design inspiration.
6. **Amianan** — Proposed domestic airport terminal, Binalonan, Pangasinan. A cultural gateway exploring wing-inspired rooflines, open spaces, local materials and motifs, natural ventilation, shading, and landscaped buffers. Credit **Pauline Claire A. Alaban, Ma. Jeremy Grace C. Gumatay, Alexa Caira S. Santos, and Michaella Concepcion A. Tugano** as group-project collaborators.

The remaining architectural studies are **A Proposed Bungalow House, Barn House, Bo’s Coffee, Azamara, Sorelle, and Siglang Kampeon**. Use their real imagery and documented details if included. Azamara carries the same collaborator list as Amianan. **Sorelle**, the proposed women’s correctional institution in Tabun, Mabalacat, Pampanga, explores humane rehabilitation, education, reintegration, gardens, and natural ventilation; credit **Pauline Claire A. Alaban** and **Michaella Concepcion A. Tugano** as group-project collaborators. Identify Bo’s Coffee as an academic study; do not imply a commercial commission or brand relationship.

Project details should contain **Design intention**, **Project context**, **Drawings / visual studies**, and **Academic collaboration** where applicable. Use the available renderings, plans, and boards to show the work. For responsibilities, use **academic design study**, **pair project**, or **academic group collaboration** as supported by the document. Do not assign an undocumented lead role or claim sole authorship.

Replace generic “live demo” and “GitHub” links with **View project** and **View portfolio PDF** actions. Only show actions with working destinations.

### 4. Design approach, capabilities, and education

Replace a generic developer stack and professional work-history section with an elegant breakdown of demonstrated architectural capabilities:

- Concept development and spatial exploration
- Architectural planning and site design
- Exterior visualization and presentation
- Scale model making and structural exploration
- Manual drafting, rendering, and visual communication

Include a visual study section using the source’s scale models and manual plates: **Kinkakuji / The Golden Pavilion, Interconnected Museum, Thin Shell Structure, Tensegrity, Bamboo Stick Bridge, and Paper Folding**, together with pencil and pen-and-ink work. Connect these to proportion, circulation, geometry, materials, tension/compression, and form-making where the source supports it.

Feature **Mapúa University — BS Architecture, 2023–present**. If a fuller education timeline improves the design, include **International Colleges for Excellence, Inc.** for **Primary education, 2011–2017; Junior high school, 2017–2021; Senior high school, STEM, 2021–2023**. Keep this visually secondary to the work.

### 5. Contact

Close with an inviting, concise statement such as **“Let’s make room for a conversation.”** Provide genuine, functional direct contact links:

- **Email:** [kolleneaikaleyson@gmail.com](mailto:kolleneaikaleyson@gmail.com)
- **Phone:** [0926 031 5517](tel:+639260315517)
- **Instagram:** [@kolleneeee](https://www.instagram.com/kolleneeee/)
- **Facebook:** [Aika Leyson](https://www.facebook.com/aika.leyson)

Use direct contact links rather than an unconnected contact form. An optional copy-email button must provide accessible confirmation. Link to the supplied PDF where it can be opened or downloaded.

## Technical implementation

Use **clean semantic HTML, CSS, and a small amount of native JavaScript**, unless an existing project already provides a suitable framework. Keep the build simple and fast, with few files and no unnecessary dependencies.

Implement responsive navigation, working category filters, project detail views, an accessible image gallery, and usable contact/PDF actions. Detail dialogs must support Escape to close, focus management, and clear close controls. Include visible keyboard focus, descriptive image alternatives, semantic headings, appropriate contrast, reduced-motion support, responsive images, and lazy loading below the fold. Prevent horizontal overflow on small screens. Use image sizes appropriate for the layout rather than shipping every PDF page at full resolution.

## Accuracy requirements

Use **architecture student / aspiring architect** throughout. Do not invent professional experience, licensure, clients, employment, awards, certifications, software proficiency, construction status, project dates, budgets, dimensions, results, or social links. Do not infer her home location from project locations.

These are **academic studies and proposals**. Describe their design intentions with language such as **explores**, **proposes**, and **prioritizes**. Do not present proposed benefits as measured outcomes. Do not add fake performance statistics or proficiency bars. Any portfolio counts must be directly verifiable from the PDF and clearly describe content rather than professional achievements.

Deliver a complete, polished, responsive website with the real portfolio imagery and coherent copy. Verify navigation, filters, dialogs, image loading, contact links, and mobile layouts before presenting the result.
