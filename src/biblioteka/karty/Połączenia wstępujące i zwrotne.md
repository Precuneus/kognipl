---
tytuł: Połączenia wstępujące i zwrotne
osnowa: '[[Sieci mózgu i predykcja]]'
rodziny:
- '[[Anatomia mózgu]]'
- '[[Predykcja]]'
głębokość:
- sieć mózgowa
- komórka
opis: 'Połączenia wstępujące (feedforward) biegną od obszaru bliższego receptorom do dalszego, połączenia zwrotne (feedback) w stronę receptorów. We wczesnych obszarach wzrokowych makaka wstępujące wychodzą głównie z warstw powierzchownych i kończą się w warstwie 4, zwrotne wychodzą głównie z warstw głębokich i kończą się poza warstwą 4, więc warstwy zdradzają kierunek połączenia. W modelach predykcyjnych zwrotne niosą predykcje, a wstępujące zaskoczenie.'
myśl: 'Kierunek połączenia w korze widać w warstwach, a w [[Kodowanie predykcyjne|kodowaniu predykcyjnym]] ten kierunek rozdziela predykcje i zaskoczenie.'
sieci:
- kod: VIS
  powód: 'Reguły warstw opisano w obszarach wzrokowych makaka położonych blisko V1 (Markov i in. 2014)<!--[s:markov2014-supragranular-ff-infragranular-fb]-->.'
bez_sieci: ''
ryciny: []
materiały:
- tytuł: 'Bastos i in. 2012: warstwy kory w kodowaniu predykcyjnym'
  url: https://doi.org/10.1016/j.neuron.2012.10.038
- tytuł: 'Markov i in. 2014: warstwy połączeń wstępujących i zwrotnych u makaka'
  url: https://doi.org/10.1002/cne.23458
- tytuł: 'Felleman i Van Essen 1991: połączenia między obszarami kory makaka'
  url: https://doi.org/10.1093/cercor/1.1.1
rekordy:
- bastos_2012
- van_kerkoerle_2014
---
Barwnik wstrzyknięty do jednego obszaru kory makaka wędruje aksonami wstecz do ciał komórek, które wysyłają tam połączenia, więc na preparacie widać, w której warstwie innych obszarów leży każda z nich (Markov i in. 2014)<!--[s:markov2014-sln-hierarchical-distance]-->. Warstwy kory numeruje się od powierzchni: warstwy powierzchowne to 2 i 3, głębokie to 5 i 6, a warstwa 4 odbiera głównie bioinformację ze wzgórza, w V1 z ciała kolankowatego bocznego (Bastos i in. 2012; van Kerkoerle i in. 2014)<!--[s:bastos2012-layer-names-l4-thalamic]--><!--[s:vankerkoerle2014-lgn-layer4-feedback-avoids]-->. W obszarach wzrokowych położonych blisko pierwszorzędowej kory wzrokowej (V1) połączenia biegnące ku przodowi mózgu, dalej od [[Odległość od receptorów|receptorów]], wychodzą głównie z komórek warstw powierzchownych i kończą się w warstwie 4 obszaru docelowego, a połączenia biegnące ku tyłowi, w stronę V1, wychodzą głównie z warstw głębokich i kończą się poza warstwą 4 (Markov i in. 2014)<!--[s:markov2014-supragranular-ff-infragranular-fb]-->.

Pierwsze to połączenia wstępujące (feedforward), drugie połączenia zwrotne (feedback). Felleman i Van Essen ułożyli z reguł warstw porządek obszarów wzrokowych makaka, który zaczyna się w siatkówce i ciele kolankowatym bocznym, a kończy w korze śródwęchowej i hipokampie, przy czym około 10% dróg odbiega od schematu (Felleman i Van Essen 1991)<!--[s:felleman1991-laminar-hierarchy]-->. Analiza tych samych danych dopuszcza jednak 150 000 równie prawdopodobnych porządków (Hilgetag i in., za: Markov i in. 2014)<!--[s:markov2014-sln-hierarchical-distance]-->, dlatego Markov i in. mierzą, jak daleko od siebie leżą dwa połączone obszary, ciągłą miarą: odsetkiem oznaczonych komórek w warstwach powierzchownych.

Komórki piramidowe warstw powierzchownych wysyłają w [[Kodowanie predykcyjne|kodowaniu predykcyjnym]] dalej od receptorów zaskoczenie, a komórki piramidowe warstw głębokich w stronę receptorów predykcje; autorzy tego przypisania sami nazywają je spekulacją (Bastos i in. 2012)<!--[s:bastos2012-superficial-errors-deep-predictions]-->. Ten sam przegląd nazywa przy tym regułę warstw uproszczeniem (Bastos i in. 2012)<!--[s:bastos2012-laminar-origin-ff-fb]-->.

Rytm to cykliczne wahanie aktywności wielu komórek naraz, szybkie w paśmie gamma, około 40–90 Hz, oraz wolne w paśmie alfa, około 5–15 Hz (van Kerkoerle i in. 2014)<!--[s:vankerkoerle2014-alpha-gamma-bands]-->. Zapis naraz z V1 i z leżącego dalej od receptorów obszaru V4 pokazał, że gamma płynie wzdłuż połączeń wstępujących, a alfa wzdłuż zwrotnych, co potwierdziło słabe drażnienie elektryczne (mikrostymulacja) każdego z obszarów (van Kerkoerle i in. 2014)<!--[s:vankerkoerle2014-gamma-ff-alpha-fb]-->. Kierunek połączeń mogą więc zdradzać także [[Rytmy alfa i gamma|rytmy alfa i gamma]].
