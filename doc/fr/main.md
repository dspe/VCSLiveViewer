Tutoriel
========

Vous trouverez dans ce document la mise en place et l'implémentation du Live Viewver
avec Varnish Custom Statistic.

Pré-requis
---------

* [Varnish Plus](https://www.varnish-software.com/products/varnish-plus) et [Varnish Cache Statistic](https://www.varnish-software.com/plus/varnish-custom-statistics)
* La librairie [d3.js](https://d3js.org/)
* [eZ Platform](http://ezplatform.com/) / [eZ Studio](http://ezstudio.com/) (fonctionne également avec des versions 5.x d'eZ Publish Platform).

Concept
-------

Afin de visualiser en temps réel (ou proche pour la démo) des contenus provenant d'eZ, il va être nécessaire de rajouter des headers. Varnish va alors utiliser ceux ci afin de rajouter des statistiques à VCS et par conséquent de nous générer une liste d'URL avec un score. Le score est tout simplement le nombre de personnes consultant la page.

1. [Configuration d'eZ Platform/eZ Studio](ez.md)
2. [Configuration de Varnish](varnish.md)
3. [Configuration de VCS](vcs.md)
4. [Mise en place de d3.js](d3.md)
