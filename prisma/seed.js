const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'changeme';
  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    create: { email, name: 'Admin', passwordHash },
    update: {},
  });

  const posts = [
    {
      title: 'PlatiGleam in Angkor Wat: My Journey Through Light and Shadow',
      slug: 'platigleam-in-angkor-wat-my-journey-through-light-and-shadow',
      excerpt:
        'I have always been drawn to the silent, sacred spaces of the world-places where history, spirituality, and architecture converge. Over the years, I have painted in many UNESCO World Heritage sites, each one teaching me something new about the human spirit. But this September, I stepped into Angkor Wat to paint for the first time there, carrying with me the vision and discoveries born from my residency at Borobudur, Indonesia. There, I had experienced the profound privilege',
      publishedAt: new Date('2025-10-08T00:00:00.000Z'),
      body: `<p>I have always been drawn to the silent, sacred spaces of the world-places where history, spirituality, and architecture converge. Over the years, I have painted in many UNESCO World Heritage sites, each one teaching me something new about the human spirit. But this September, I stepped into Angkor Wat to paint for the first time there, carrying with me the vision and discoveries born from my residency at Borobudur, Indonesia. There, I had experienced the profound privilege of creating the first-ever documented solo exhibition at the world's largest Buddhist temple, a moment I will never forget.</p>
<p>Then, I was honoured to be named Cultural Ambassador by InJourney Destination, and invited to do the first artist residency in Angkor Wat, Cambodia, under the Twin World Heritage Programme, supported by GIZ Cambodia. At Angkor Wat-the largest religious monument in the world, spanning 163 hectares-I spent seven sunrises creating a new body of work, again visible only through the moving glow of a mobile light. Conceived during the September equinox, these works respond to the temple's cosmic symbolism, establishing a dialogue between PlatiGleam paintings and such sacred architecture. In its 900-year history, the temple had never before hosted an artistic residency of this kind.</p>
<p>Painting the western facade.</p>
<p>Using my PlatiGleam technique, I created paintings that remain invisible until revealed only by certain kinds of light. No pigment, no immediately visible brushstrokes-only the potential for vision to emerge from darkness. I watched the night-shift staff, guardians of this timeless place, encounter PlatiGleam for the very first time. Their awe reminded me why I do this work: to transform perception, to invite wonder, and to make the unseen seen.</p>
<p>First reaction to my PlatiGleam paintings.</p>
<p>I first presented PlatiGleam in 2023 at Portugal's Batalha Monastery, in the exhibition Mist, which welcomed over 127,000 visitors. One of the paintings entered the monastery's permanent collection and has since been seen by over a million people. Later, I extended PlatiGleam to the temples of Nepal, exhibiting in Kathmandu Valley, Durbar Square, and at the Nepal Art Council.</p>
<p>It was later observed, with some wonder, that the paintings mirrored the proportions of the southern section of Angkor Wat's West Gallery - directly across the water from where I painted them.</p>
<p>Through PlatiGleam, I strive to redefine how audiences experience UNESCO World Heritage sites. Darkness becomes light. Silence becomes contemplation. Architecture becomes again a dialogue with the cosmos. And in these quiet, hidden moments, I hope every viewer-every pilgrim of light-feels that same spark of connection that continues to inspire me. Back at Borobudur, a 9 x 6 metre gallery now preserves these nocturnal creations for long-term display.</p>`,
    },
    {
      title: 'PlatiGleam at Borobudur Temple: A Historic First',
      slug: 'platigleam-at-borobudur-temple-a-historic-first',
      excerpt:
        "Standing inside the world's largest Buddhist temple with my PlatiGleam paintings was one of the most humbling and profound moments of my...",
      publishedAt: new Date('2025-08-29T00:00:00.000Z'),
      body: `<p>Standing inside the world's largest Buddhist temple with my PlatiGleam paintings was one of the most humbling and profound moments of my life. The temple is not only an architectural wonder, but also a living testament to humanity's search for meaning, carved into stone more than a thousand years ago.</p>
<p>To paint at the Temples of Prambanan, Sewu and Borobudur at night - and to bring my artworks into this sacred place felt almost like a dialogue across centuries. The metallic surfaces of PlatiGleam caught the shifting light, and in those fleeting reflections I felt a profound connection between my practice and the temple's timeless meditation on impermanence.</p>
<p>I never imagined that my art would become part of Borobudur Temple's long story - a story that began in the 9th century, with over 500 Buddha sculptures and more than five kilometres of carved narratives. To be, perhaps, the first artist to exhibit within its space was not just an honour, but also a responsibility: to show respect, humility, and gratitude for the cultural heritage that made this possible.</p>
<p>Borobudur has always been a place of pilgrimage. For me, it became a pilgrimage of art - a reminder that creation and contemplation are two sides of the same human impulse. My hope is that PlatiGleam added a small spark of light to the ancient stone, and that those who were there felt the same awe that I did.</p>
<p>I'm especially grateful to the team at Injourney Destination, who made this event so special. The opening evening of my exhibition Nyawiji (The Union) gathered 125 guests for a dinner prepared by the incredible chef Vicky Putra (of <a href="https://maps.app.goo.gl/ertKCnodXwCa9teh6">Bakmi Jowo Mbak Nuning</a>, near Prambanan Temple). Honestly, these were the best dishes I've had in Indonesia so far. The night was filled with the sound of a gamelan orchestra, the Kidung Tribangga Dance performed by the Avadhana Dance Studio, and then-finally-the paintings waiting to be unveiled. The evening held one last unforgettable surprise: Borobudur itself was lit up. This never happens except during religious ceremonies, so to see the temple glowing against the night sky felt almost otherworldly. It was a dramatic gesture that made the moment even more meaningful, as if the temple itself had joined the celebration:</p>
<p>Opening of Nyawiji painting exhibition by Avadhana Dance Studio, before unveiling the paintings - click on the image to play the video.</p>
<p>In the second video you can see the audience's first reaction. At first they stood very still, almost frozen, and I worried they didn't like the works. Then I realised they were simply absorbing them. Many later told me they felt hypnotised. It struck me deeply - here, people still look at art with such focus and intensity.</p>
<p>The public's first contact with the PlatiGleam paintings - click on the image to play the video.</p>
<p>And after the party ended:</p>
<p>Zen energy, with the sound of crickets.</p>
<p>Some visitors travelled ten long hours on motorbikes to be here.</p>
<p>The exhibition was also widely covered by the media - I'll share links to some of those articles too:</p>
<p><a href="https://injourneydestination.id/en/2025/08/24/pendar-lukisan-candi-borobudur-prambanan-dan-candi-sewu-di-kegelapan-dengan-teknik-platigleam/">InJourney Destination (English article by Borobudur Temple)</a><br/>
<a href="https://www.beritamagelang.id/seniman-portugal-gelar-pameran-lukisan-di-borobudur">Berita Magelang</a><br/>
<a href="https://borobudurnews.com/seniman-portugal-lukis-candi-borobudur-prambanan-dan-sewu-dengan-teknik-platigleam-hasilnya-memukau/">Borobudur News</a><br/>
<a href="https://www.instagram.com/p/DNj5ZCnxQtC/">Borobudur Temple</a><br/>
<a href="https://www.instagram.com/p/DN2B6dx3gx8/">Borobudur Temple IGTV</a><br/>
<a href="https://www.detik.com/jateng/budaya/d-8077410/unik-seniman-portugal-melukis-candi-borobudur-cuma-bisa-dilihat-saat-gelap">Detik</a><br/>
<a href="https://travel.detik.com/travel-news/d-8077656/lukisan-misterius-candi-borobudur-hanya-muncul-saat-gelap">Detik Travel</a><br/>
<a href="https://kedu.harianjogja.com/read/2025/08/25/647/1225529/seniman-asal-portugal-pamerkan-lukisan-unik-di-borobudur-hanya-bisa-dilihat-dengan-lampu-senter">Harian Jogja</a><br/>
<a href="https://www.youtube.com/watch?v=8EhQhKVhfT0">News Jateng</a><br/>
<a href="https://jatengpress.com/2025/budaya/08/pendar-lukisan-candi-borobudur-prambanan-dan-sewu-di-pameran-borobudur-art-exhibition/">Jateng Press</a><br/>
<a href="https://radarmagelang.jawapos.com/mungkid/686488830/pelukis-asal-portugal-nelson-ferreira-hadirkan-karya-menakjubkan-bangunan-candi-borobudur-dan-hanya-bisa-dilihat-saat-gelap">Jawa Pos Radar</a><br/>
<a href="https://www.kabarbumn.com/trending/116483803/sentuhan-nelson-ferreira-borobudur-prambanan-dan-sewu-hidup-dalam-pendar-platigleam">Kabar BUMN</a><br/>
<a href="https://www.liputan6.com/regional/read/6141399/seniman-portugal-gunakan-teknik-aneh-lukis-borobudur-hasilnya-mengejutkan">Liputan6</a><br/>
<a href="https://metrojateng.com/2025/08/26/pameran-lukisan-misterius-nelson-ferreira-hadir-di-borobudur/">Metro Jateng</a><br/>
<a href="https://www.youtube.com/watch?v=UslZ3CR4XZ0">Metro Siang</a><br/>
<a href="https://www.youtube.com/watch?v=xfo1fyXpano">Metro TV</a><br/>
<a href="https://www.youtube.com/watch?v=YNs2kV5hNmQ">Metro TV Jateng</a><br/>
<a href="https://www.youtube.com/watch?v=bNS4oy6h_C4">Nusantara TV</a><br/>
<a href="https://jateng.pikiran-rakyat.com/jawa-tengah/pr-3739597648/seniman-asal-portugal-ungkap-proses-di-balik-lukisan-platigleam-candi-borobudur-yang-misterius?page=all">Pikiran Rakyat</a><br/>
<a href="https://www.instagram.com/p/DNUpxelRktw/?img_index=1">Prambanan Temple</a><br/>
<a href="https://radarjogja.jawapos.com/jawa-tengah/656482226/seniman-portugal-nelson-ferreira-tampilkan-teknik-platigleam-satukan-cahaya-candi-dan-spiritualitas-dalam-kanvas">Radar Jogja</a><br/>
<a href="https://rri.co.id/semarang/hiburan/1791509/pelukis-portugal-pamerkan-karyanya-di-candi-borobudur">Radio Republik Indonesia (State radio)</a><br/>
<a href="https://suarabaru.id/2025/08/25/pelukis-portugal-pamerkan-seni-lukis-gaya-modern-di-borobudur">Suarabaru</a><br/>
<a href="https://www.youtube.com/watch?v=2e3wJO7P4fQ">Suarabaru Channel</a><br/>
<a href="https://jateng.suara.com/read/2025/08/25/071234/lukisan-borobudur-bersepuh-emas-putih">Suara Jateng</a><br/>
<a href="https://jogja.tribunnews.com/tribun-kedu/1190526/lukisan-candi-borobudur-dan-prambanan-ini-cuma-muncul-saat-ada-sorot-cahaya">Tribun Jogja</a></p>`,
    },
    {
      title: '(Un)VEILINGS OF PEDRO AND INÊS: Honoring 700 Years of Inês de Castro',
      slug: 'un-veilings-of-pedro-and-ines-honoring-700-years-of-ines-de-castro',
      excerpt:
        'In celebration of the 700th anniversary of Inês de Castro’s birth, I am delighted to be participating in the painting exhibition...',
      publishedAt: new Date('2025-03-29T00:00:00.000Z'),
      body: `<p>In celebration of the 700th anniversary of Inês de Castro’s birth, I am delighted to be participating in the painting exhibition (Un)VEILINGS OF PEDRO AND INÊS in Alcobaça. This remarkable show brings together an exceptional group of artists-Cristina Henriques, Gianmarco Donaggio, Joana Guerra, João Leirão, Jorge Prata, Maria De Fátima Silva, Nélia Caixinha, and Nelson Ferreira-curated by Alberto Guerreiro.</p>
<p>This exhibition explores the legendary and tragic love story of Pedro and Inês, one of the most moving tales in Portuguese history. Each artist presents a unique interpretation of this epic romance, revealing layers of emotion, fate, and intrigue through their work. Alcobaça, a place of profound historical significance, serves as the ideal setting, as it is home to the Monastery of Alcobaça, where the tombs of Pedro and Inês stand as eternal symbols of their love.</p>
<p>Some of the icons I painted in the Byzantine style.</p>
<p>Adding depth to this artistic experience, Jorge Pereira de Sampaio delivered a talk, providing historical and cultural context to the story of Inês de Castro.</p>
<p>To enhance the immersive journey, I have also subtitled a mesmerizing aria from the Italian opera Inês de Castro in English, Portuguese, and Italian. This musical masterpiece captures the profound sorrow and timeless beauty of Inês’s story, resonating across cultures and generations. Please listen to it:</p>`,
    },
    {
      title: 'A MINHA PINTURA NA COLEÇÃO D’A BRASILEIRA: UMA HOMENAGEM A PESSOA E AO FRAGMENTO',
      slug: 'a-minha-pintura-na-colecao-d-a-brasileira-uma-homenagem-a-pessoa-e-ao-fragmento',
      excerpt:
        'É com grande honra que partilho a notícia de que a minha pintura "Vestígio e Simulacro de Mim" recebeu um prémio histórico, dado apenas...',
      publishedAt: new Date('2024-11-19T00:00:00.000Z'),
      body: `<p>É com grande honra que partilho a notícia de que a minha pintura "Vestígio e Simulacro de Mim" recebeu um prémio histórico, dado apenas duas vezes num século (1925 e 1971). Esta tela foi escolhida para integrar a coleção permanente do café A Brasileira, em Lisboa (Chiado). Este é um espaço icónico, carregado de história, onde nomes ilustres como Fernando Pessoa, Almada Negreiros, Eduardo Viana, Eduardo Nery e João Vieira deixaram a sua marca, contribuindo para a rica tapeçaria artística deste lugar. A minha obra, inspirada por Fernando Pessoa, é uma tentativa de capturar a essência multifacetada deste poeta que tanto nos fascina e desafia. Pessoa, frequentemente descrito como um oceano de pensamentos e emoções, aparece aqui retratado numa paisagem surreal que é, ao mesmo tempo, ele próprio e também a vastidão que simboliza. Veja o vídeo:</p>
<p>A PAISAGEM SURREAL: PESSOA NO OCEANO DA INTERIORIDADE. Na composição, Fernando Pessoa é tanto figura quanto água. A superfície de um lago, que se ergue verticalmente, reflete e fragmenta a sua imagem de forma infinita. É um reflexo do reflexo - um eco visual que dialoga com a fragmentação psicológica e identitária tão presente na obra do autor. No ar em volta da sua silhueta, flutua uma citação emblemática de O Livro do Desassossego: "Nunca fui senão um vestígio e um simulacro de mim. O meu passado é tudo quanto não consegui ser." Este fragmento não é apenas um elemento literário; ele impregna a atmosfera da pintura como se as palavras tivessem corpo.</p>
<p>MULTIPLICIDADE LINGUÍSTICA: UMA PONTE COM O MUNDO. Para enriquecer ainda mais a experiência de quem contempla a obra, decidi traduzir esta citação para várias línguas. A Brasileira, sendo um local frequentado por visitantes de todo o mundo, pareceu-me o palco ideal para celebrar esta pluralidade. Cada tradução é uma nova camada de fragmentação, um convite a que o público, independentemente da sua língua, mergulhe no universo de Pessoa e reflita sobre a sua própria condição.</p>
<p>O SIGNIFICADO DE PERTENCER A ESTE ESPAÇO. A Brasileira é muito mais do que um café; é um símbolo da cultura lisboeta, um espaço onde artistas, poetas e pensadores de várias gerações encontraram inspiração. A Brasileira é o café mais famoso de Portugal, um dos três cafés mais antigos de Lisboa, e conhecida por popularizar o consumo de café no país, especialmente a "bica".</p>
<p>Ver a minha pintura neste contexto, ao lado de obras de artistas que tanto admiro, é um marco na minha jornada enquanto pintor. Espero que esta obra possa dialogar com o espírito do espaço e com aqueles que por lá passam, como uma pequena contribuição para a celebração do génio de Pessoa e do poder transformador da arte. Artistas premiados: António Faria Costa, Catarina Mendes, Catarina Oliveira, Filipe Amaral, Isabella Fernandes, Margarida Costa, Martim Vilhena, Nelson Ferreira, Rui Braz e Sara Conde. Os meus parabéns a todos! As obras estarão expostas no café A Brasileira de 15 de janeiro a setembro de 2025. Mais detalhes em: <a href="https://amensagem.pt/2024/11/19/brasileira-novos-quadros-concurso-chiado-cafe/">https://amensagem.pt/2024/11/19/brasileira-novos-quadros-concurso-chiado-cafe/</a></p>
<p>E estão aqui algumas fotos da cerimónia, cortesia de A Brasileira do Chiado e do Grupo O Valor do Tempo. Podem ver o momento em que a pintura chega ainda tapada, e depois revelada perante um auditório cheio.</p>`,
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        body: post.body,
        published: true,
        publishedAt: post.publishedAt,
      },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        body: post.body,
        published: true,
        publishedAt: post.publishedAt,
      },
    });
  }

  console.log('Seeded admin user:', email);
  console.log('Seeded posts:', posts.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
