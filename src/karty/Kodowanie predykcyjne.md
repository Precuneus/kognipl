---
tytuł: Kodowanie predykcyjne
osnowa: '[[Sieci mózgu i predykcja]]'
rodziny:
- '[[Predykcja]]'
sieci: []
bez_sieci: 'Predykcja zachodzi w każdej komórce mózgu, więc dotyczy wszystkich sieci naraz. Rao i Ballard opisali swój model dla kory wzrokowej (Rao i Ballard 1999)<!--[s:rao1999-feedback-predictions-feedforward-errors]-->.'
ryciny: []
materiały:
- tytuł: 'Rao i Ballard 1999: model kodowania predykcyjnego kory wzrokowej'
  url: https://doi.org/10.1038/4580
- tytuł: 'Bastos i in. 2012: warstwy kory w kodowaniu predykcyjnym'
  url: https://doi.org/10.1016/j.neuron.2012.10.038
- tytuł: 'Friston 2010: zasada swobodnej energii'
  url: https://doi.org/10.1038/nrn2787
rekordy:
- rao_1999
- bastos_2012
- kanai_2015
stan: gotowa
---
Kodowanie predykcyjne (ang. predictive coding) to model kory wzrokowej, w którym obszar dalszy od [[Odległość od receptorów|receptorów]] wysyła [[Połączenia wstępujące i zwrotne|połączeniami zwrotnymi]] (ang. feedback) [[Predykcja|predykcję]] (ang. prediction) aktywności obszaru bliższego receptorom, a połączenia wstępujące (ang. feedforward) odsyłają [[Zaskoczenie|zaskoczenie]] (ang. prediction error), czyli różnicę między predykcją a rzeczywistą aktywnością. Zaskoczenie aktualizuje predykcję (Rao i Ballard 1999)<!--[s:rao1999-feedback-predictions-feedforward-errors]-->.

Model Rao i Ballarda wyjaśnia paradoks kory wzrokowej. Część jej komórek u kota i małpy, odpowiadających najsilniej na odcinki linii o określonej długości i szczególnie licznych w warstwach 2 i 3, ma własność nazwaną hamowaniem na końcach (ang. endstopping): komórki te odpowiadają silnie na krótki odcinek o właściwym nachyleniu i słabną albo milkną, kiedy ta sama linia wydłuża się poza ich pole recepcyjne (ang. receptive field), czyli fragment pola widzenia, na który komórka odpowiada (Rao i Ballard 1999)<!--[s:rao1999-endstopping-defined]--><!--[s:rao1999-long-bar-predicted-from-context]-->. Więcej bodźca daje tu mniej aktywności. Według Rao i Ballarda na zdjęciach przyrody, na których uczył się model, krótka kreska zwykle należy do dłuższej, więc kreskę ciągnącą się poza pole recepcyjne predykcja obejmuje dzięki otoczeniu, z zaskoczeniem bliskim zera. Po odcięciu połączeń zwrotnych hamowanie na końcach zostało w 5 z 28 modelowych komórek, które je wcześniej miały, więc w modelu słabnięcie komórki wynika z predykcji płynących połączeniami zwrotnymi.

Z równań kodowania predykcyjnego Bastos i współpracownicy wyprowadzają, że zaskoczenie powinno mieć wyższe częstotliwości niż predykcje (Bastos i in. 2012)<!--[s:bastos2012-errors-higher-frequencies]-->. W korze wzrokowej makaka szybki [[Rytmy alfa i gamma|rytm gamma]] (ang. gamma rhythm) rozchodzi się wzdłuż połączeń wstępujących, a wolny rytm alfa (ang. alpha rhythm) wzdłuż zwrotnych (van Kerkoerle i in. 2014)<!--[s:vankerkoerle2014-gamma-ff-alpha-fb]-->, ale czy to ślady zaskoczenia i predykcji, pozostaje hipotezą.

Karl Friston rozszerza to ujęcie na cały mózg w zasadzie swobodnej energii (ang. free-energy principle). Swobodna energia to w niej wielkość zawsze co najmniej tak duża jak niespodziewaność wrażeń (ang. surprise), czyli miara tego, jak mało prawdopodobne są one według modelu, więc organizm, który zmniejsza swobodną energię, zmniejsza pośrednio niespodziewaność (Friston 2010)<!--[s:friston2010-free-energy-bounds-surprise]--><!--[s:friston2010-laplace-free-energy-prediction-error]-->. Według Fristona przy założeniu Laplace'a (ang. Laplace assumption) swobodna energia to różnica między predykcjami modelu a wrażeniami, których te predykcje dotyczą, a jej zmniejszanie to zmniejszanie zaskoczenia (ang. prediction error), czyli kodowanie predykcyjne.

Według Kanaia i współpracowników siła, z jaką zaskoczenie aktualizuje predykcję, zależy od [[Wzmocnienie zaskoczenia|wzmocnienia]] (ang. gain), czyli czułości komórek przekazujących zaskoczenie dalej od receptorów (Kanai i in. 2015)<!--[s:kanai2015-gain-of-prediction-errors]-->.

Kiedy patrzysz na stół, krawędź ciągnąca się przez całe pole widzenia budzi w pierwszorzędowej korze wzrokowej (ang. primary visual cortex, V1) mniejsze zaskoczenie niż jej urwany kawałek, jeśli Twoja kora działa tak jak ten model: ciągłą krawędź obejmuje predykcja z Twoich [[Modele Mentalne|Modeli Mentalnych]] stołu, a urwany kawałek je aktualizuje. Twoje widzenie stołu to wtedy [[Kontrolowane halucynacje|kontrolowana halucynacja]] w ujęciu Anila Setha i współpracowników: predykcja aktualizowana przez docierającą [[Bioinformacja|bioinformację]] (Hewitt i in. 2025)<!--[s:hewitt2025-controlled-hallucination]-->.
