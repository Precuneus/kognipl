---
tytuł: Drabina przyczynowości
osnowa: '[[Myślenie]]'
rodziny:
- '[[Rozumowanie i wnioskowanie]]'
głębokość:
- organizm
- sieć mózgowa
opis: 'Judea Pearl układa pytania o przyczynę w szczeble: co widać razem (skojarzenie), co się stanie, jeśli coś zrobisz (interwencja), oraz co by było, gdyby wszystko potoczyło się inaczej (kontrfakt). Na pytanie z danego szczebla odpowiadają tylko dane z tego szczebla albo wyższego, a dane z niższego prawie zawsze zostawiają odpowiedź nierozstrzygniętą.'
myśl: 'Widzieć, robić i wyobrażać sobie to osobne pytania o przyczynę, a pytanie dalej na drabinie wymaga więcej niż dane z niższego szczebla.'
sieci:
- kod: DMN
  powód: 'Poprawianie w wyobraźni własnych porażek z przeszłości angażowało tę samą sieć co przypominanie przeszłości i wyobrażanie przyszłości, z obszarami hipokampa, płatów skroniowych, linii środkowej i bocznej kory ciemieniowej (Van Hoeck i in. 2013)<!--[s:vanhoeck2013-counterfactual-shares-episodic-network]-->.'
bez_sieci: ''
ryciny: []
materiały:
- tytuł: 'Judea Pearl, The Mechanization of Causal Inference (ACM Turing Award Lecture)'
  url: https://youtu.be/iNm4nFBFmvo?t=343
  czas: 5:43–15:28 (9:45)
- tytuł: 'Lex Fridman, Judea Pearl: Causal Reasoning, Counterfactuals, and the Path to AGI'
  url: https://youtu.be/pEBI0vF45ic?t=2217
  czas: 36:57–41:46 (4:49)
- tytuł: 'Pearl 2019: The Seven Tools of Causal Inference, with Reflections on Machine Learning'
  url: https://doi.org/10.1145/3241036
- tytuł: 'Bareinboim, Correa, Ibeling i Icard 2022: On Pearl''s Hierarchy and the Foundations of Causal Inference'
  url: https://doi.org/10.1145/3501714.3501743
- tytuł: 'Van Hoeck i in. 2013: myślenie kontrfaktyczne w fMRI'
  url: https://doi.org/10.1093/scan/nss031
rekordy:
- association-for-computing-machinery-acm_pearl-causal-inference_iNm4nFBFmvo
- lex-fridman_pearl-causality-counterfactuals_pEBI0vF45ic
- obraz_memy-inne-279836478-3303608369879124-2553853542480201781-n
---
Na zdjęciu znad morza mewa siedzi na samym dole wygiętego pręta barierki, a podpis „Correlation vs. Causation” podsuwa najprostsze [[Dedukcja, indukcja, abdukcja|wyjaśnienie]]: to ona go wygięła. Judea Pearl układa podobną zagadkę ze zraszaczem, deszczem i chodnikiem. Widzisz, że zraszacz jest wyłączony, więc deszcz staje się bardziej prawdopodobny. Włączasz zraszacz, a prawdopodobieństwo deszczu zostaje takie samo, choć chodnik na pewno zmoknie. Zraszacz działa i chodnik jest mokry. Gdyby zraszacz był wyłączony, chodnik byłby suchy, bo pora roku jest pewnie sucha (Pearl 2012)<!--[s:pearl2012-sprinkler-seeing-doing-imagining]-->.

Pearl porządkuje takie pytania w hierarchię: skojarzenie (association), czyli widzenie, z pytaniem, co objaw mówi o chorobie; interwencja (intervention), czyli działanie, z pytaniem, czy ból głowy minie, jeśli weźmiesz aspirynę; kontrfakty (counterfactuals), czyli wyobrażanie i patrzenie wstecz, z pytaniem, czy ból głowy minął dzięki aspirynie. Na pytanie z danego szczebla odpowiadają tylko dane z tego szczebla albo wyższego (Pearl 2019)<!--[s:pearl2019-three-level-hierarchy]-->. W książce Pearla i Mackenzie z 2018 roku ta hierarchia nosi nazwę drabiny przyczynowości (Ladder of Causation), a zespół Eliasa Bareinboima udowodnił twierdzenie o hierarchii przyczynowej (Causal Hierarchy Theorem): dane z jednego szczebla prawie zawsze zostawiają szczeble wyższe niedookreślone (Bareinboim i in. 2022)<!--[s:bareinboim2022-ladder-of-causation-term]--><!--[s:bareinboim2022-cht-lower-underdetermines]-->.

Badanie obserwacyjne zbiera dane pierwszego szczebla, a eksperyment kontrolowany drugiego. Pytanie, czy Twój ból głowy minął dzięki aspirynie, należy do trzeciego, bo eksperymentu nie da się powtórzyć na tych samych osobach tak, jakby leku nie dostały (Pearl 2019)<!--[s:pearl2019-no-rerun-counterfactual]-->. Do odpowiedzi potrzebny jest model przyczynowy, zapisany równaniami tego, co od czego zależy, a systemy uczące się wyłącznie skojarzeń zostają na pierwszym szczeblu, nazywanym też [[Uczenie z modelem i bez modelu|„bez modelu”]] (model-free) albo „czarną skrzynką” (black-box) (Pearl 2019)<!--[s:pearl2019-counterfactuals-need-structural-models]--><!--[s:pearl2019-association-model-free-terms]-->.

Kiedy poprawiasz w wyobraźni własną porażkę z przeszłości, pracuje u Ciebie ta sama sieć co przy przypominaniu przeszłości i [[Wyobrażanie przyszłości|wyobrażaniu przyszłości]] (Van Hoeck i in. 2013)<!--[s:vanhoeck2013-counterfactual-shares-episodic-network]-->.
