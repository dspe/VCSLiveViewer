Configuration d'eZ Platform / eZ Studio
---------------------------------------

Si vous utilisez eZ Platform / eZ Studio, la création de contrôleur est nécessaire afin de gérer les affichages en fonction des types de contenus. En effet la représentation d'un article est, dans la plupart des cas, différente d'un blog post par exemple.
Pour plus d'informations sur l'installation et configuration d'eZ, référez vous à la [documentation](https://doc.ez.no/display/TECHDOC/Beginner+Tutorial).

Prenons un exemple provenant de ```ezstudio-demo-data```. (*vendor/ezsystems/ezstudio-demo-bundle/Controller/ArticleController.php*)

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

L'action contient très peu d'informations ici: on souhaite récupérer le sommaire ainsi que l'image. Ces paramètres sont alors ajouté à la vue. (Attention: le template permettant l'affichage aura également les objects ```content``` et ```location```)

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

Comme vous pouvez le noter, nous renvoyons 3 headers: ```X-VCS```, ```X-VCS-Image``` et ```X-VCS-Title```. Ces informations vont être récupérer à travers le VCL (Varnish Configuration Language) et 'transmis' à VCS.

Vous avez terminé pour la partie eZ.


    Allez à la [Configuration de Varnish](varnish.md)
