Configuration de Varnish
------------------------

Je vous passe l'installation de Varnish ainsi que son fonctionnement. Ce qui nous intéresse ici, est la modification du fichier VCL pour réaliser notre démonstration. L'installation utilise le fichier VCL suivant: [Varnish4 VCL](https://github.com/ezsystems/ezplatform/blob/master/doc/varnish/vcl/varnish4.vcl).

Une petite astuce au passage. La partie *Normalize the Accept-Encoding headers* est déjà géré par Varnish. Il est donc possible de le supprimer du VCL.

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

Le code vérifie que le header ```x-vcs``` existe afin de logger une clé ```vcs-key``` suffixé par ```ART-``` et contenant le ```titre@l_url_de_mon_image@l_url_de_mon_contenu```.

Et voilà la configuration est également terminée pour Varnish.

    Aller à la [Configuration de VCS](vcs.md)
