# Utfordringer med datasett
* Navn er ikke konform. Enkelte år heter det "01 Buøy", andre år heter det "Buøy"
** Løsning: Lag Id ut fra tittel ved hjelp av Regex. Navn.match(/^(\d+)/g)
* Skrivefeil i dataset. F.eks i aldersstandardiserte dødsrater - Menn er det "Indiaktor" i stedet for Indikator
** Løsning: this.chartOptions.title.text = this.data[0].Indikator || this.data[0].Indiaktor
* Oppgaven sier man skal vise "fremstilling av levekår i egen bydel", og sammenligen "sin bydel" med resten av byen. Datasettet deler opp bydeler i flere områder.
** Løsning: Legge på et kartlag som viser bydeler. Legg til relasjoner mellom bydel og bydelsområde. Likevel er ikke bydelsområdet og bydelskart helt samsvarende i enkelte områder.