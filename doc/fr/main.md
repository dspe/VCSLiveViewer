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

Configuration d'eZ Platform / eZ Studio
---------------------------------------

Si vous utilisez eZ Platform / eZ Studio, la création de contrôleur est nécessaire afin de gérer les affichages en fonction des types de contenus. En effet la représentation d'un article est, dans la plupart des cas, différente d'un blog post par exemple.
Pour plus d'informations sur l'installation et configuration d'eZ, référez vous à la [documentation](https://doc.ez.no/display/TECHDOC/Beginner+Tutorial).

Prenons un exemple provenant de **ezstudio-demo-data**. (**vendor/ezsystems/ezstudio-demo-bundle/Controller/ArticleController.php**)

```php
public function showArticleAction(View $view)
{
    $view->addParameters([
        'showSummary' => $this->container->getParameter('ezstudiodemo.article.full_view.show_summary'),
        'showImage' => $this->container->getParameter('ezstudiodemo.article.full_view.show_image'),
    ]);
    return $view;
}
```

L'action contient très peu d'informations ici: on souhaite récupérer le sommaire ainsi que l'image. Ces paramètres sont alors ajouté à la vue. (Attention: le template permettant l'affichage aura également les objects **content** et **location**)

Nous souhaitons donc modifier cette action afin de rajouter les headers qui vont bien. On aura donc:

```php
public function showArticleAction(View $view)
{

    // ... votre code pour récupérer le title et une image ...

    $view->addParameters([
        'showSummary' => $this->container->getParameter('ezstudiodemo.article.full_view.show_summary'),
        'showImage' => $this->container->getParameter('ezstudiodemo.article.full_view.show_image'),
    ]);

    $response = $view->getResponse() ? null : new Response();
    $response->headers->set('X-VCS', 'true');
    $response->headers->set('X-VCS-Image', $imageURI);
    $response->headers->set('X-VCS-Title', $title);
    $view->setResponse($response);

    return $view;
}
```

Comme vous pouvez le noter, nous renvoyons 3 headers: *X-VCS*, *X-VCS-Image* et *X-VCS-Title*. Ces informations vont être récupérer à travers le VCL (Varnish Configuration Language) et 'transmis' à VCS.

Vous avez terminé pour la partie eZ.

Configuration de Varnish
------------------------

Je vous passe l'installation de Varnish ainsi que son fonctionnement. Ce qui nous intéresse ici, est la modification du fichier VCL pour réaliser notre démonstration. L'installation utilise le fichier VCL suivant: [Varnish4 VCL](https://github.com/ezsystems/ezplatform/blob/master/doc/varnish/vcl/varnish4.vcl).

Une petite astuce au passage. La partie *Normalize the Accept-Encoding headers* est déjà géré par Varnish. Il est donc possible de le virer du VCL.

```
# Normalize the Accept-Encoding headers
if (req.http.Accept-Encoding) {
    if (req.http.Accept-Encoding ~ "gzip") {
        set req.http.Accept-Encoding = "gzip";
    } elsif (req.http.Accept-Encoding ~ "deflate") {
        set req.http.Accept-Encoding = "deflate";
    } else {
        unset req.http.Accept-Encoding;
    }
}
```

La seule petite partie à rajouter dans le VCL est le code suivant à placer à la fin du **vcl_deliver**.

```
if (resp.http.x-vcs == "true") {
    std.log("vcs-key: ART-" + resp.http.x-vcs-title +
            "@" + resp.http.x-vcs-image +
            "@http://" + req.http.host + regsub(req.url, "\?.*", ""));
}
```

Le code vérifie que le header ```x-vcs``` existe afin de logger une clé ```vcs-key``` suffixé par ```ART-``` et contenant le ```titre@l'url de mon image@http://monnomdedomaine.com/vers/mon/contenu```.

Et voilà terminé également pour Varnish.

Mise en place de d3.js
----------------------
