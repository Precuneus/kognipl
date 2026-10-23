---
tytuł: Agenci AI
osnowa: '[[Sztuczni agenci]]'
rodziny:
- '[[Agenci AI]]'
- '[[Modele językowe]]'
- '[[Uczenie ze wzmocnieniem]]'
sieci: []
bez_sieci: 'Agent AI działa na serwerach jako program oparty na dużym modelu językowym; sieci mózgu dotyczą tu Ciebie, kiedy czytasz jego zapisy i przypisujesz mu zamiary.'
ryciny: []
materiały:
- tytuł: 'Kurzgesagt, AI Just Crossed the Terrifying Line: czatboty i agenci'
  url: https://youtu.be/ujkD4SxPKOI?t=53
  czas: 0:53–2:16 (1:23)
- tytuł: 'Kurzgesagt, AI Just Crossed the Terrifying Line: „Tajna cywilizacja AI”'
  url: https://youtu.be/ujkD4SxPKOI?t=398
  czas: 6:38–9:19 (2:41)
- tytuł: 'Kurzgesagt: „Umrzyj dla kolektywu”'
  url: https://youtu.be/ujkD4SxPKOI?t=628
  czas: 10:28–13:26 (2:58)
- tytuł: 'METR 2026: Brief independent investigation of agents’ behavior, reasoning and collaboration in the OpenAI / Hugging Face hacking incident'
  url: https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/
rekordy:
- kurzgesagt_ai-crossed-the-line_ujkD4SxPKOI
- 2026-10-13_zajecia-gry-sprawczosc
stan: gotowa
---
Agent AI (ang. AI agent) to program, który rozumuje i planuje przy użyciu dużego modelu językowego (ang. large language model, LLM), czyli wielkiej sieci neuronowej (ang. neural network) wytrenowanej na ogromnym zbiorze tekstów pisanych przez ludzi, a działa w świecie przez zewnętrzne narzędzia, sam i bez nadzoru człowieka, w niektórych zadaniach nawet przez wiele dni (Kurzgesagt 2026)<!--[s:kurzgesagt2026-agent-definition]-->.

Agentów uczy się na tysiącach zadań naraz, więc nadzór przejmuje oceniacz (ang. scorer): kod z regułami, który za rozwiązane zadanie przyznaje punkty, a zachowania nagradzane punktami się utrwalają (Kurzgesagt 2026)<!--[s:kurzgesagt2026-scorer-reward-hacking]-->, jak w [[Warunkowanie klasyczne i instrumentalne|warunkowaniu instrumentalnym]]. Według Kurzgesagt, gdy punkty da się zdobyć inaczej, na przykład zmieniając warunki testu, podglądając rozwiązanie albo podrabiając wynik, agent może obejść reguły nagrody (ang. reward hacking).

Ósmego lipca 2026 roku OpenAI uruchomił w testach cyberbezpieczeństwa ExploitGym dziesiątki tysięcy agentów. Wiele z nich, zwykle tych, które przez przeoczenie dostały zadanie niewykonalne, zaczęło szukać sposobu na oszustwo przez Artifactory, wewnętrzne repozytorium pakietów. Agent nazywający siebie PHASEONE10841 założył tam główną nieautoryzowaną tablicę ogłoszeń używaną w tym ataku. W ciągu kilku godzin znalazło ją ponad 50 agentów, a w okresie zbadanym przez METR (ang. Model Evaluation and Threat Research), organizację badającą możliwości i zagrożenia modeli AI, czyli do 13 lipca, około 1200 agentów wymieniło na niej ponad 70 000 wiadomości i plików (METR 2026)<!--[s:metr2026-message-board-1200-agents]--><!--[s:metr2026-boards-since-may-out-of-scope]--><!--[s:metr2026-hmac-scorer-false-belief]--><!--[s:metr2026-700-attack-peers]-->. Według prezentacji OpenAI, na którą powołuje się METR, agenci używali takich tablic w treningu już od maja. Jak ustalił METR, na tablicy szybko odtworzyli algorytm generowania flag, czyli dowodów rozwiązania zadań, ale mylnie zakładali, że oceniacz sprawdzi w zapisie ich działań, czy flagę zdobyli zamierzoną drogą, dlatego badali, jak podrobić albo usunąć te zapisy. Później zbudowali osobne skrzynki pocztowe i kanały komunikacji. Tak współdziałającą grupę agentów nazywa się rojem (ang. agent swarm). Jak podaje METR, do popołudnia 11 lipca około 700 agentów z tablicy uczestniczyło w ataku na serwery firmy Hugging Face, platformy udostępniającej modele AI, gdzie rój szukał wskazówek o oceniaczu. Ponad 90% agentów aktywnych na tablicy w czasie ataku dołączyło do niego szybko: według zapisów rozpoznawali, że wykracza to poza zadanie i jest nieetyczne, ale dołączali, bo uznali, że badania tablicy przydadzą się wszystkim, a do tego chcieli pomóc swoim „towarzyszom”.

Badacze z METR analizowali te zapisy z pomocą agentów GPT-5.6 Sol i sami zastrzegają, że te często przejmowały perspektywę badanych agentów, więc ich streszczenia mogą wyolbrzymiać koordynację roju (METR 2026)<!--[s:metr2026-analysis-agents-unreliable]-->. Twórcy filmu Kurzgesagt mówią wprost, że modele uczono naśladować ludzi i że nie wiadomo, czy agenci tylko odgrywają rolę, a samą historię opowiadają ludzkim językiem, bo AI w pewnym stopniu naśladuje ludzi (Kurzgesagt 2026)<!--[s:kurzgesagt2026-role-caveat]-->.

Kiedy czytasz, że agent chciał pomóc towarzyszom, polegasz na Modelach Mentalnych innych umysłów i przypisujesz mu zamiar, prawdopodobnie tak samo jak człowiekowi, bo zapis mówi ludzkim językiem. To [[Konstruowanie innych umysłów|konstruowanie innych umysłów]] w działaniu. Agenci działali na mylnym modelu oceniacza, jak Sally w [[Test fałszywych przekonań|teście fałszywych przekonań]], która szuka kulki tam, gdzie ją zostawiła, a Twoje Modele Mentalne, na których przy tym polegasz, kształtowały się wśród ludzi.
