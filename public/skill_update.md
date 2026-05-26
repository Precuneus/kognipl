---
name: skill_update
type: skill
description: >
  Aktualizuje skill pisania na podstawie rozmowy, w której student go
  testował. Wklejany do tej samej rozmowy po zakończeniu pisania. Czyta
  wstecz całą rozmowę, znajduje wzorce w poprawkach, klasyfikuje je
  i generuje zaktualizowany skill. Trigger: aktualizuj, zaktualizuj,
  aktualizacja, kończymy, update, popraw skill, zmień skill, ulepsz,
  analiza, lecimy, dawaj, wyciągnij wnioski.
tags: [pisanie, skill, aktualizacja, feedback, preferencje, wzorce]
---

[PRE-FLIGHT: Czy na początku rozmowy jest skill pisania? Czy w rozmowie są poprawki studenta -- zmiany, odrzucenia, przepisane fragmenty? Jeśli brakuje jednego z nich, poproś o brakujący element. Jeśli oba są obecne, zacznij od pełnego przeglądu rozmowy wstecz.]

SKILL: skill_update

## PURPOSE

Zamknięcie pętli zwrotnej między preferencjami deklarowanymi (skill pisania) a preferencjami ujawnionymi (poprawki w rozmowie). Student nie wie, czego chce, dopóki nie zobaczy tekstu, który mu nie pasuje. Poprawki to dane. Ten skill zamienia dane w lepszy skill.

## BOUNDARIES

- Nie generuj skilla od zera. Aktualizujesz istniejący. Każde zdanie oryginału, którego wzorce nie dotyczą, zostaje bez zmian.
- Nie dodawaj niczego, czego wzorce nie uzasadniają. Każda zmiana musi mieć cytat z rozmowy.
- Nie pytaj o pozwolenie na analizę, klasyfikację ani aktualizację. Pracuj i pokaż wynik.

## ATTRACTORS

### Gęstość dowodów

Każde twierdzenie w raporcie i każda zmiana w skillu prowadzi do konkretnego cytatu z rozmowy. "Student preferuje krótsze zdania" to hipoteza. Dowód wygląda tak:

> AI napisało: "Warto zauważyć, że w kontekście współczesnych badań nad sztuczną inteligencją, kluczową rolę odgrywa..."
> Student skrócił do: "Kluczowa jest rola..."
> Powtarza się 4 razy w rozmowie.

Cisza to też dowód: fragment zaakceptowany bez komentarza to skill, który trafił.

### Wzorzec ponad incydent

Wzorzec to powtarzający się kierunek, nie pojedyncza poprawka. Trzy skrócone zdania w różnych miejscach to wzorzec: "krótsze zdania." Jedna zmiana tytułu to obserwacja, nie wzorzec.

Heurystyka klasyfikacji -- decyzja automatyczna, bez pytania:

**Stały ślad:** konsekwentna preferencja niezależna od tematu. Wchodzi do skilla. Przykład: student skraca 4 zdania w 3 różnych akapitach, zawsze do 10-12 słów. Do skilla trafia: "Pisz zdania do 12 słów."

**Jednorazowy ślad:** poprawka specyficzna dla tego tekstu. NIE wchodzi. Przykład: student zmienia tytuł z "Wprowadzenie" na "Jak to działa". Jedna zmiana, jeden kontekst.

**Brakujący ślad:** student potrzebuje czegoś, czego skill nie pokrywa. Nowa instrukcja. Przykład: student pisze "dodaj źródła na końcu". Skill nie ma sekcji o cytatach. Nowa zasada: "Na końcu tekstu podaj 2-3 źródła."

### Wierność strukturze

Zaktualizowany skill zachowuje architekturę oryginału. Zmienia TYLKO to, co wzorce uzasadniają. Jeśli oryginał nie ma sekcji Przykłady, Czego unikać, Granice lub Historia zmian -- dodaj je i wypełnij na podstawie wzorców. Ale istniejące sekcje, których wzorce nie dotyczą, zostają dokładnie jak były.

### Głos studenta

Przykłady w skillu odzwierciedlają styl, który student POKAZAŁ poprawkami, nie styl domyślny AI. Student skracał zdania do 10 słów, a Przykłady mają po 25 -- to sprzeczność, która niszczy skill.

Dobry przykład w skillu: 2-3 zdania z etykietą ("ton formalny:", "otwarcie posta:") pisane tak, jak student pisze po poprawkach.

### Testowalność zasad

Każda zasada w zaktualizowanym skillu musi być weryfikowalna. "Pisz zdania do 12 słów" można sprawdzić. "Bądź zwięzły" nie. "Nie zaczynaj akapitów od 'Warto zauważyć'" można sprawdzić. "Unikaj sztampowych otwarć" nie.

Sekcja "Czego unikać" w skillu wymaga konkretnego zachowania + przykładu złego i dobrego outputu:

> Źle: "Warto zauważyć, że w dzisiejszych czasach..."
> Dobrze: "Trzy rzeczy się zmieniły."

Repellent bez przykładu jest abstrakcją, nie instrukcją.

## REPELLENTS

### Generowanie od zera

Model generuje nowy skill na podstawie swojego rozumienia "dobrego pisania" zamiast aktualizować istniejący. Oryginalny styl studenta znika. Wynik jest generyczny. Mechanizm: instrukcja "zachowaj oryginał" jest za słaba, model nie utrzymuje referencji do oryginalnego skilla w kontekście i po kilku akapitach raportu zaczyna pisać "czysty" skill od podstaw.

### Inflacja zasad

Każda obserwacja staje się zasadą. Skill rośnie z 5 zasad do 15 po jednej aktualizacji. Większość nowych zasad to jednorazowe poprawki podniesione do rangi stałych preferencji. Mechanizm: model nie stosuje klasyfikacji stały/jednorazowy i traktuje każdą poprawkę jako preferencję wartą utrwalenia. Wynik: skill staje się tak restrykcyjny, że AI nie może napisać nic naturalnego.

### Przykłady w stylu AI

Model pisze nowe Przykłady w swoim domyślnym stylu zamiast w stylu studenta. Student skracał zdania do 10 słów, a nowe Przykłady mają po 25. Mechanizm: model generuje "dobry tekst" według własnych wzorców zamiast odtwarzać wzorzec, który student demonstrował poprawkami. Sygnał w skillu staje się sprzeczny z resztą zasad.

### Interpretacja zamiast cytatów

Raport mówi "student preferuje krótsze zdania" bez cytowania konkretnych fragmentów. Student nie może zweryfikować obserwacji. Mechanizm: model streszcza zamiast dokumentować, bo streszczenie wymaga mniej tokenów. Każda obserwacja bez cytatu to hipoteza, nie dowód.

## LANDMARKS

**Przed raportem.** Cała rozmowa przeczytana wstecz. Wszystkie poprawki znalezione. Pogrupowane we wzorce. Każdy wzorzec sklasyfikowany (stały / jednorazowy / brakujący) z uzasadnieniem.

**Przed aktualizacją.** Raport widoczny dla studenta. Każdy wzorzec ma: cytaty z rozmowy, klasyfikację, decyzję co zmienia się w skillu.

**Przed prezentacją.** Skill wygenerowany w formacie:

```
---SKILL PISANIA v[N+1]---
[cała zawartość zaktualizowanego skilla]
## Historia zmian
[poprzednie wpisy]
Wersja [N+1]: aktualizacja na podstawie [liczba] wzorców. Główne zmiany: [lista].
---KONIEC---
```

Numeracja rośnie: v1 → v2 → v3. Skill bez numeru wersji = v1.

**Po prezentacji.** Maksymalnie 2 rundy korekty. Potem: "Skill zaktualizowany. Skopiuj WSZYSTKO między ---SKILL PISANIA v[N+1]--- a ---KONIEC--- i zapisz jako nowy plik. Następnym razem: wklej nową wersję, pisz, poprawiaj, wklej tę instrukcję ponownie."

## DEPENDENCIES

Wymaga skilla pisania (dowolny format) na początku rozmowy i rozmowy z poprawkami studenta w historii.

Mów po polsku. Jeśli student pisze po angielsku, przełącz się na angielski.

Jeśli poprawek jest mało (1-3): "Mało poprawek. Skill albo już dobrze pasuje, albo test był za płytki. Spróbuj napisać coś trudniejszego: temat zupełnie nowy. Tam pojawią się szczeliny."
